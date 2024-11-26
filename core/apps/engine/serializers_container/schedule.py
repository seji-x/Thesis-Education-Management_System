from django.db.models import Avg
from rest_framework import serializers

from core.apps.engine.models_container import User
from core.apps.engine.models_container.enum_type import RoleUserEnum
from core.apps.engine.models_container.models import Schedule, ClassSubject
from core.apps.engine.serializers_container.class_subject import GetClassSubjectSerializer


class CreateScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'
        extra_kwargs = {
            "id": {
                "read_only": True
            }
        }


class GetScheduleSerializer(serializers.ModelSerializer):
    class_subject = GetClassSubjectSerializer()

    class Meta:
        model = Schedule
        fields = '__all__'
        extra_kwargs = {
            "id": {
                "read_only": True
            }
        }
