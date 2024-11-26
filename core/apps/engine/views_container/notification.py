from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from rest_framework.pagination import LimitOffsetPagination

from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from core.apps.engine.models_container import Notification
from core.apps.engine.serializers_container.notification import GetNotificationSerializer, CreateNotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    pagination_class = LimitOffsetPagination
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        if self.request.user.is_authenticated:
            status_param = self.request.query_params.get('status')
            queryset = Notification.objects.filter(recipient=self.request.user)
            if status_param is not None:
                queryset = queryset.filter(status=status_param.lower() == 'true')
            queryset = queryset.order_by('-created_at')
            return queryset
        return Notification.objects.none()

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('status', openapi.IN_QUERY, description="status of the notification",  type=openapi.TYPE_BOOLEAN,
                              required=False),
        ],
        responses={200: GetNotificationSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        unread_count = queryset.filter(status=False).count()
        response_data = {
            'count': self.get_queryset().count(),
            'unread': unread_count,
            'results': serializer.data
        }

        return Response(response_data, status=status.HTTP_200_OK)

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve', 'update', 'partial_update']:
            return GetNotificationSerializer
        if self.action == 'create':
            return CreateNotificationSerializer
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"status": "success", "message": "Notification created successfully."},
            status=status.HTTP_201_CREATED
        )

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
