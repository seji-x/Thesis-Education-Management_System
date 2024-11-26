from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, permissions
from rest_framework.pagination import LimitOffsetPagination

from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.contrib.auth.models import AnonymousUser
from core.apps.engine.models_container import UserClass
from core.apps.engine.models_container.models import Schedule
from core.apps.engine.serializers_container.schedule import GetScheduleSerializer, CreateScheduleSerializer


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    pagination_class = LimitOffsetPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return GetScheduleSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return CreateScheduleSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        user = self.request.user

        if isinstance(user, AnonymousUser):
            return []

        if user.role == 'ADMIN':
            queryset = Schedule.objects.all()
            class_instance = self.request.query_params.get('class_instance_id', None)
            class_subject_id = self.request.query_params.get('class_subject_id', None)
            teacher_id = self.request.query_params.get('teacher_id', None)
            student_id = self.request.query_params.get('student_id', None)

            if class_instance:
                queryset = queryset.filter(class_subject__class_instance__id=class_instance)
            if class_subject_id:
                queryset = queryset.filter(class_subject__id=class_subject_id)
            if teacher_id:
                queryset = queryset.filter(class_subject__teacher_id=teacher_id)

            if student_id:
                user_classes = UserClass.objects.filter(user__id=student_id).values_list('class_instance_id', flat=True)
                queryset = queryset.filter(class_subject__class_instance__id__in=user_classes)

            return queryset

        elif user.role == 'TEACHER':
            return Schedule.objects.filter(class_subject__teacher_id=user)

        elif user.role == 'STUDENT':
            user_classes = UserClass.objects.filter(user=user).values_list('class_instance_id', flat=True)
            return Schedule.objects.filter(class_subject__class_instance__id__in=user_classes)

        return Schedule.objects.none()

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('class_instance_id', openapi.IN_QUERY, description="class_instance_id of the class Schedule",
                              type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('class_subject_id', openapi.IN_QUERY,
                              description="class_subject_id of the class Schedule",
                              type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('teacher_id', openapi.IN_QUERY, description="teacher_id of the class Schedule",
                              type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('student_id', openapi.IN_QUERY, description="student_id of the class Schedule",
                              type=openapi.TYPE_STRING, required=False),
        ],
        responses={200: GetScheduleSerializer(many=True)},
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
