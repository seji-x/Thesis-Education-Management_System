from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, permissions
from rest_framework.pagination import LimitOffsetPagination

from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from core.apps.engine.models_container.enum_type import StatusClassSubjectEnum
from core.apps.engine.models_container.models import ClassSubject
from core.apps.engine.serializers_container.class_subject import GetClassSubjectSerializer, CreateClassSubjectSerializer


class ClassSubjectViewSet(viewsets.ModelViewSet):
    queryset = ClassSubject.objects.all()
    pagination_class = LimitOffsetPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return GetClassSubjectSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return CreateClassSubjectSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        queryset = ClassSubject.objects.all()
        class_instance = self.request.query_params.get('class_instance', None)
        subject = self.request.query_params.get('subject', None)
        teacher_id = self.request.query_params.get('teacher_id', None)
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        if class_instance:
            queryset = queryset.filter(class_instance__id=class_instance)
        if subject:
            queryset = queryset.filter(subject__id=subject)
        if teacher_id:
            queryset = queryset.filter(teacher_id__id=teacher_id)

        return queryset

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('class_instance', openapi.IN_QUERY, description="class_instance of the class subject",
                              type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('subject', openapi.IN_QUERY, description="subject of the class subject",
                              type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('teacher_id', openapi.IN_QUERY, description="teacher_id of the class subject",
                              type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('status', openapi.IN_QUERY,
                              description="gender of the user (e.g. MALE, FEMALE, OTHER)",
                              type=openapi.TYPE_STRING, required=False, enum=[role.value for role in StatusClassSubjectEnum]),
        ],
        responses={200: GetClassSubjectSerializer(many=True)},
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
