from django.db.models import Q
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, permissions
from rest_framework.pagination import LimitOffsetPagination

from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from core.apps.engine.models_container import Class
from core.apps.engine.serializers_container.class_serializers import ClassSerializer, CreateClassSerializer


class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    pagination_class = LimitOffsetPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ClassSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return CreateClassSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        queryset = Class.objects.all()
        search = self.request.query_params.get('search', None)
        teacher_id = self.request.query_params.get('teacher_id', None)
        if search:
            queryset = queryset.filter(Q(key__icontains=search) | Q(name__icontains=search))
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)

        return queryset

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('search', openapi.IN_QUERY, description="Key of the class", type=openapi.TYPE_STRING,
                              required=False),
            openapi.Parameter('teacher_id', openapi.IN_QUERY, description="teacher_id of the class",
                              type=openapi.TYPE_STRING,
                              required=False),
        ],
        responses={200: ClassSerializer(many=True)},
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
