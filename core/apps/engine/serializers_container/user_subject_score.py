from django.db.models import Avg
from rest_framework import serializers

from core.apps.engine.models_container import UserSubjectScore
from core.apps.engine.models_container.models import ClassSubject
from core.apps.engine.serializers_container.class_subject import GetClassSubjectSerializer
from core.apps.engine.serializers_container.subject import SubjectSerializer
from core.apps.engine.serializers_container.user import UserSerializer


class CreateUserSubjectScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSubjectScore
        fields = '__all__'
        extra_kwargs = {
            "id": {
                "read_only": True
            }
        }


class GetUserSubjectScoreSerializer(serializers.ModelSerializer):
    student_id = UserSerializer()
    subject = SubjectSerializer()
    class_subject = serializers.SerializerMethodField()

    class Meta:
        model = UserSubjectScore
        fields = '__all__'

    def get_class_subject(self, obj):
        class_subject = ClassSubject.objects.filter(subject=obj.subject).first()
        if class_subject:
            return GetClassSubjectSerializer(class_subject).data
        return None


class UpdateUserSubjectScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSubjectScore
        fields = ['student_id', 'subject', 'score', 'average_score', 'status']

    def update(self, instance, validated_data):
        instance.student_id = validated_data.get('student_id', instance.student_id)
        instance.subject = validated_data.get('subject', instance.subject)
        instance.score = validated_data.get('score', instance.score)
        instance.status = validated_data.get('status', instance.status)
        instance.average_score = validated_data.get('average_score', instance.average_score)
        instance.save()

        return instance

class AverageScoreSerializer(serializers.Serializer):
    average_score = serializers.FloatField()
