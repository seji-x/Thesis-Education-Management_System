from django.db.models import Avg
from rest_framework import serializers
from core.apps.engine.models_container import UserClass
from core.apps.engine.serializers_container.class_serializers import ClassSerializer


class CreateUserClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserClass
        fields = ['user', 'class_instance']


class GetUserClassSerializer(serializers.ModelSerializer):
    class_instance = ClassSerializer(read_only=True)
    user = serializers.SerializerMethodField()

    class Meta:
        model = UserClass
        fields = '__all__'
        extra_kwargs = {
            "id": {
                "read_only": True
            }
        }

    def get_user(self, obj):
        from core.apps.engine.serializers_container.user import UserSerializer
        return UserSerializer(obj.user).data
