from drf_yasg import openapi
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, permissions, status
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated

from core.apps.engine.models_container import UserSubjectScore, UserClass
from core.apps.engine.models_container.enum_type import StatusUserSubjectScoreEnum
from core.apps.engine.models_container.models import ClassSubject
from core.apps.engine.serializers_container.user_subject_score import CreateUserSubjectScoreSerializer, \
    GetUserSubjectScoreSerializer, UpdateUserSubjectScoreSerializer, AverageScoreSerializer


class UserSubjectScoreViewSet(viewsets.ModelViewSet):
    queryset = ClassSubject.objects.all()
    pagination_class = LimitOffsetPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return GetUserSubjectScoreSerializer
        if self.action in ['create']:
            return CreateUserSubjectScoreSerializer
        if self.action in ['update', 'partial_update']:
            return UpdateUserSubjectScoreSerializer
        if self.action in ['average_score']:
            return AverageScoreSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        queryset = UserSubjectScore.objects.all()
        class_subject_id = self.request.query_params.get('class_subject_id', None)
        student_id = self.request.query_params.get('student_id', None)
        subject_id = self.request.query_params.get('subject_id', None)
        if class_subject_id:
            class_subject = ClassSubject.objects.filter(id=class_subject_id).first()
            if class_subject:
                subject = class_subject.subject
                user_classes = UserClass.objects.filter(class_instance=class_subject.class_instance)
                student_ids = user_classes.values_list('user_id', flat=True)
                queryset = queryset.filter(subject=subject, student_id__in=student_ids)
            else:
                queryset = UserSubjectScore.objects.none()
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)

        # return queryset
        return queryset.prefetch_related('subject')

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('class_subject_id', openapi.IN_QUERY,
                              description="class_subject_id of the UserSubjectScore", type=openapi.TYPE_STRING,
                              required=False),
            openapi.Parameter('student_id', openapi.IN_QUERY, description="student_id of the UserSubjectScore",
                              type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('subject_id', openapi.IN_QUERY, description="subject_id of the UserSubjectScore",
                              type=openapi.TYPE_STRING, required=False),
        ],
        responses={200: GetUserSubjectScoreSerializer(many=True)},
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

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = UpdateUserSubjectScoreSerializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            updated_instance = serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('subject_id', openapi.IN_QUERY,
                              description="subject_id of the UserSubjectScore", type=openapi.TYPE_STRING,
                              required=True)
        ],
        responses={200: AverageScoreSerializer()},
    )
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='average_score/')
    def average_score(self, request, *args, **kwargs):
        subject_id = request.query_params.get('subject_id', None)
        if not subject_id:
            return Response({"detail": "subject_id is required"}, status=400)
        user_subject_scores = UserSubjectScore.objects.filter(subject_id=subject_id,
                                                              status=StatusUserSubjectScoreEnum.CONFIRM)
        if not user_subject_scores.exists():
            return Response({"detail": "No scores found for this subject"}, status=404)
        total_score = 0
        count = 0
        for score in user_subject_scores:
            if score.average_score is not None:
                total_score += score.average_score
                count += 1

        if count == 0:
            return Response({"detail": "No valid scores to calculate average"}, status=400)

        average_score = total_score / count
        return Response({"average_score": average_score})
