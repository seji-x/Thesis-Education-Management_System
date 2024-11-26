from django.urls import path, include
from rest_framework import routers

from core.apps.engine.views_container.setting import SettingSubjectViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register('setting', SettingSubjectViewSet)

urlpatterns = [
    path("", include(router.urls))
]
