from django.db.models import Avg
from rest_framework import serializers

from core.apps.engine.models_container import Subject


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'
        extra_kwargs = {
            "id": {
                "read_only": True
            }
        }
