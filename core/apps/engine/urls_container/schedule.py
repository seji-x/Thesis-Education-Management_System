from django.urls import path, include
from rest_framework import routers

from core.apps.engine.views_container.schedule import ScheduleViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register('schedule', ScheduleViewSet)

urlpatterns = [
    path("", include(router.urls))
]
