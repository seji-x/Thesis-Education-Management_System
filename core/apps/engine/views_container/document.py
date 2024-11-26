from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import viewsets, permissions
from rest_framework.pagination import LimitOffsetPagination

from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from core.apps.engine.models_container import Document
from core.apps.engine.serializers_container.document import GetDocumentSerializer, \
    CreateDocumentSerializer


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    pagination_class = LimitOffsetPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return GetDocumentSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return CreateDocumentSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        queryset = Document.objects.all()
        title = self.request.query_params.get('title', None)
        subject = self.request.query_params.get('subject', None)

        if title:
            queryset = queryset.filter(title__icontains=title)
        if subject:
            queryset = queryset.filter(subject__id=subject)

        return queryset

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('subject', openapi.IN_QUERY, description="Subject ID of the Document",
                              type=openapi.TYPE_STRING, required=False),
            openapi.Parameter('title', openapi.IN_QUERY, description="Partial title of the Document",
                              type=openapi.TYPE_STRING, required=False),
        ],
        responses={200: GetDocumentSerializer(many=True)},
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
