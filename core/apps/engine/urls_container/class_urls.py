from django.urls import path, include
from rest_framework import routers

from core.apps.engine.views_container.class_views import ClassViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register('class', ClassViewSet)

urlpatterns = [
    path("", include(router.urls))
]
