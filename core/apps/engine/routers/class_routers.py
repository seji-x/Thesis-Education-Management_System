from core.apps.engine.routers import *

from core.apps.engine.views import (
    ClassViewSet
)

urlpatterns = [
    path('class//', ClassViewSet.as_view(), name='user-detail'),
]
