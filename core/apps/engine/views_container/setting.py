from django.db.models import Q
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import viewsets, permissions
from rest_framework.pagination import LimitOffsetPagination

from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from core.apps.engine.models_container.models import Setting
from core.apps.engine.serializers_container.setting import SettingSerializer


class SettingSubjectViewSet(viewsets.ModelViewSet):
    queryset = Setting.objects.all()
    pagination_class = LimitOffsetPagination
    serializer_class = SettingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]