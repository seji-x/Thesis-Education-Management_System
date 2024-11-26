from django.urls import path, include
from rest_framework import routers

from core.apps.engine.views_container.document import DocumentViewSet

router = routers.DefaultRouter(trailing_slash=False)
router.register('document', DocumentViewSet)

urlpatterns=[
    path("", include(router.urls))
]