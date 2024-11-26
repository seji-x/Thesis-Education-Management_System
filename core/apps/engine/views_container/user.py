from django.db.models import Q
from rest_framework import viewsets, mixins, status, generics, views
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import get_object_or_404

from core.apps.engine.models_container import Class, Subject
from core.apps.engine.models_container.enum_type import RoleUserEnum
from core.apps.engine.models_container.models import ClassSubject
from core.apps.engine.serializers import (
    UserSerializer,
    UserSerializers,
    UserLogoutSerializer,
    UpdateUserSerializer,
    UserRegisterSerializer,
    UserDeleteAccountSerializer,
)
from core.apps.engine.serializers_container.token import CustomTokenObtainPairSerializer
from core.apps.engine.serializers_container.user import GetUserSerializer, UpdateAvatarSerializer, \
    ChangePasswordSerializer
from core.apps.engine.views_container import (
    User, action, openapi, timezone, Response, AppStatus,
    permissions, RefreshToken, GenericAPIView,
    swagger_auto_schema, )


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterViewSet(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    parser_classes = (MultiPartParser, FormParser)


class ChangePasswordViewSet(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Đổi mật khẩu người dùng",
        request_body=ChangePasswordSerializer,
        responses={
            200: openapi.Response("successfully."),
            400: openapi.Response("Error changing password.", ChangePasswordSerializer),
        }
    )
    def post(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']
            if not user.check_password(old_password):
                return Response({"The old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(new_password)
            user.save()

            return Response({"successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyCodeViewSet(GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers

    @swagger_auto_schema(request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT, properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING),
            'verify_code': openapi.Schema(type=openapi.TYPE_STRING)
        },
        required=['email', 'verify_code']),
    )
    def post(self, request):
        email = request.data['email']
        verify_code = request.data['verify_code']
        user = User.objects.filter(email=email).first()
        if user:
            if user.verify_code == verify_code:
                if user.code_lifetime >= timezone.now():
                    user.is_active = True
                    user.save()
                    refresh = RefreshToken.for_user(user)
                    data = {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token)
                    }
                    return Response(data)
                return Response(AppStatus.EXPIRED_VERIFY_CODE.message)
            else:
                return Response(AppStatus.INVALID_VERIFY_CODE.message)
        else:
            return Response(AppStatus.EMAIL_NOT_EXIST.message)


class StatisticalView(views.APIView):
    def get(self, request):
        student_count = User.objects.filter(role=RoleUserEnum.STUDENT, soft_delete=False).count()
        teacher_count = User.objects.filter(role=RoleUserEnum.TEACHER, soft_delete=False).count()
        total_users = User.objects.filter(soft_delete=False).count()
        total_classes = Class.total_classes()
        total_subjects = Subject.total_subjects()

        data = {
            'total_students': student_count,
            'total_teachers': teacher_count,
            'total_users': total_users,
            'total_classes': total_classes,
            'total_subjects': total_subjects,
        }
        return Response(data, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    pagination_class = LimitOffsetPagination
    serializer_class = GetUserSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = User.objects.all()
        role = self.request.query_params.get('role', None)
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(Q(full_name__icontains=search) | Q(email__icontains=search))
        if role:
            queryset = queryset.filter(role=role)
        return queryset

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('role', openapi.IN_QUERY, description="Role of the user (e.g. ADMIN, TEACHER, STUDENT)",
                              type=openapi.TYPE_STRING, required=False, enum=[role.value for role in RoleUserEnum]),
            openapi.Parameter('search', openapi.IN_QUERY, description="search of the user", type=openapi.TYPE_STRING,
                              required=False),
        ],
        responses={200: GetUserSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'total_count': queryset.count(),
            'results': serializer.data,
        })

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='get_me/')
    def get_me(self, request):
        user = request.user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'user_ids': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Items(type=openapi.TYPE_STRING),
                    description="List of user IDs to delete",
                )
            },
            required=['user_ids'],
        ),
        responses={
            200: "Users deleted successfully",
            400: "Invalid or empty user_ids list"
        }
    )
    @action(detail=False, methods=['DELETE'], permission_classes=[IsAuthenticated], url_path='delete_multiple/')
    def delete_multiple(self, request):
        user_ids = request.data.get('user_ids', [])
        if not isinstance(user_ids, list) or not user_ids:
            return Response({"error": "Invalid or empty user_ids list."}, status=status.HTTP_400_BAD_REQUEST)
        users_to_delete = User.objects.filter(id__in=user_ids)
        for user in users_to_delete:
            if user.role == 'TEACHER':
                Class.objects.filter(teacher=user).update(teacher=None)
                ClassSubject.objects.filter(teacher_id=user).update(teacher_id=None)
                user.delete()
            else:
                User.objects.filter(id__in=user_ids).delete()[0]
        return Response({"message": f"users deleted successfully."}, status=status.HTTP_200_OK)


class UserLogOutViewSet(GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserLogoutSerializer

    def get(self, *args, **kwargs):
        user = self.request.user
        user.device_token = None
        user.save()
        return Response(AppStatus.USER_LOGOUT_SUCCESS.message)


class UpdateAvatar(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'id', openapi.IN_PATH, description="User ID", type=openapi.TYPE_STRING
            )
        ],
        request_body=UpdateAvatarSerializer,
        responses={200: 'Avatar updated successfully', 400: 'Invalid data'}
    )
    def put(self, request, id, *args, **kwargs):
        if not request.user.is_staff:
            return Response({"detail": "Permission denied. Only admins can update avatars."},
                            status=status.HTTP_403_FORBIDDEN)
        user = get_object_or_404(User, id=id)
        serializer = UpdateAvatarSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
