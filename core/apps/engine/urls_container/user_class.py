from django.urls import path, include
from rest_framework import routers

from core.apps.engine.views_container.user_class import UserCLassViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register('user_class', UserCLassViewSet)

urlpatterns=[
    path("", include(router.urls))
]