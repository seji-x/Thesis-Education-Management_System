from django.urls import path, include
from rest_framework import routers

from core.apps.engine.views_container.subject import SubjectViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register('subject', SubjectViewSet)

urlpatterns=[
    path("", include(router.urls))
]