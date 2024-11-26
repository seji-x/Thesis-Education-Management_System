from rest_framework import viewsets, permissions
from rest_framework.pagination import LimitOffsetPagination

from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from core.apps.engine.models_container import Subject
from core.apps.engine.serializers_container.subject import SubjectSerializer


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    pagination_class = LimitOffsetPagination
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
