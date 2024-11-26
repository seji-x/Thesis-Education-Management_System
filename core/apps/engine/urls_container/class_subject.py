from django.urls import path, include
from rest_framework import routers

from core.apps.engine.views_container.class_subject import ClassSubjectViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register('class_subject', ClassSubjectViewSet)

urlpatterns = [
    path("", include(router.urls))
]
