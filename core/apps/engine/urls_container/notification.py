from django.urls import path, include
from rest_framework import routers

from core.apps.engine.views_container.notification import NotificationViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register('notification', NotificationViewSet)

urlpatterns = [
    path("", include(router.urls))
]
