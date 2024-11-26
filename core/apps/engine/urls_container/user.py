from django.urls import path, include
from rest_framework import routers

from core.apps.engine.views_container.user import UserViewSet, UpdateAvatar

router = routers.DefaultRouter(trailing_slash=False)
router.register('user', UserViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("user/<uuid:id>/update-avatar/", UpdateAvatar.as_view(), name="update-avatar"),
]