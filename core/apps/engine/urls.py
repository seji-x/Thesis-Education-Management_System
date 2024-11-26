from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from django.urls import path, include

from core.apps.engine.views_container.user import CustomTokenObtainPairView, UserLogOutViewSet, RegisterViewSet, \
    VerifyCodeViewSet, StatisticalView, ChangePasswordViewSet

urlpatterns = [
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='login_api'),
    path("auth/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/logout/", UserLogOutViewSet.as_view(), name="token_refresh"),
    path('auth/register/', RegisterViewSet.as_view(), name='register'),
    path('auth/verify-code/', VerifyCodeViewSet.as_view(), name='verify'),
    path('auth/change_password/', ChangePasswordViewSet.as_view(), name='change_password'),

    path('statistic/', StatisticalView.as_view(), name='statistic'),

    # path('', include('core.ap ps.engine.routers.user')),
    path('', include('core.apps.engine.urls_container.user')),
    path('', include('core.apps.engine.urls_container.class_urls')),
    path('', include('core.apps.engine.urls_container.subject')),
    path('', include('core.apps.engine.urls_container.user_class')),
    path('', include('core.apps.engine.urls_container.user_subject_score')),
    path('', include('core.apps.engine.urls_container.schedule')),
    path('', include('core.apps.engine.urls_container.schedule')),
    path('', include('core.apps.engine.urls_container.notification')),
    path('', include('core.apps.engine.urls_container.class_subject')),
    path('', include('core.apps.engine.urls_container.setting')),
    path('', include('core.apps.engine.urls_container.document')),
]
