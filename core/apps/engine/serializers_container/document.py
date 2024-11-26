from django.db.models import Avg
from rest_framework import serializers

from core.apps.engine.models_container import Document
from core.apps.engine.serializers_container.subject import SubjectSerializer


class CreateDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
        extra_kwargs = {
            "id": {
                "read_only": True
            }
        }


class GetDocumentSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()

    class Meta:
        model = Document
        fields = '__all__'
        extra_kwargs = {
            "id": {
                "read_only": True
            }
        }
