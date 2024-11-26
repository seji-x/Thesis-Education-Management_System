from typing import Dict, Any
from rest_framework import status
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from core.apps.engine.utils.exception import HandleExceptionResponse

from core.apps.engine.serializers_container import (serializers, AppStatus)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'full_name': self.user.full_name,
            'role': self.user.role,
            'email': self.user.email,
            'code': self.user.code,
            'avatar': self.user.avatar.url if self.user.avatar and hasattr(self.user.avatar, 'url') else None,
            'gender': self.user.gender,
            'date_of_birth': self.user.date_of_birth,
            'date_joined': self.user.date_joined,
            'phone_number': self.user.phone_number,
            'address': self.user.address
        }
        return data
