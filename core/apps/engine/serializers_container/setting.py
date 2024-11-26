from django.db.models import Avg
from rest_framework import serializers

from core.apps.engine.models_container import User
from core.apps.engine.models_container.enum_type import RoleUserEnum
from core.apps.engine.models_container.models import Setting
from core.apps.engine.serializers_container.class_subject import GetClassSubjectSerializer


class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = '__all__'
        extra_kwargs = {
            "id": {
                "read_only": True
            }
        }
