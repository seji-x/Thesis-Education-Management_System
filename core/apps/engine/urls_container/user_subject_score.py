from django.urls import path, include
from rest_framework import routers

from core.apps.engine.views_container.user_subject_score import UserSubjectScoreViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register('user_subject_score', UserSubjectScoreViewSet)

urlpatterns=[
    path("", include(router.urls))
]