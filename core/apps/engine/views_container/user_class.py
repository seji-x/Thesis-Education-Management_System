from django.db.models import Q
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, permissions
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from core.apps.engine.models_container import UserClass
from core.apps.engine.models_container.enum_type import RoleUserEnum, GenderEnum
from core.apps.engine.serializers_container.user_class import CreateUserClassSerializer, GetUserClassSerializer



class UserCLassViewSet(viewsets.ModelViewSet):
    queryset = UserClass.objects.all()
    pagination_class = LimitOffsetPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return GetUserClassSerializer
        return CreateUserClassSerializer

    def get_queryset(self):
        queryset = UserClass.objects.all()
        phone_number_user = self.request.query_params.get('phone_number_user', None)
        gender_user = self.request.query_params.get('gender_user', None)
        class_id = self.request.query_params.get('class_id', None)
        search = self.request.query_params.get('search', None)

        if search:
            queryset = queryset.filter(Q(user__full_name__icontains=search) | Q(user__email__icontains=search))
        if phone_number_user:
            queryset = queryset.filter(user__phone_number__icontains=phone_number_user)
        if gender_user:
            queryset = queryset.filter(user__gender__icontains=gender_user)
        if class_id:
            queryset = queryset.filter(class_instance__id__icontains=class_id)

        return queryset

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('search', openapi.IN_QUERY, description="search of the user", type=openapi.TYPE_STRING,
                              required=False),
            openapi.Parameter('phone_number_user', openapi.IN_QUERY, description="Key of the class",
                              type=openapi.TYPE_STRING,
                              required=False),
            openapi.Parameter('gender_user', openapi.IN_QUERY,
                              description="gender of the user (e.g. MALE, FEMALE, OTHER)",
                              type=openapi.TYPE_STRING, required=False, enum=[role.value for role in GenderEnum]),
            openapi.Parameter('class_id', openapi.IN_QUERY, description="Key of the class", type=openapi.TYPE_STRING,
                              required=False),
        ],
        responses={200: GetUserClassSerializer(many=True)},
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
