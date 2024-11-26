from django.db.models import Avg
from rest_framework import serializers

from core.apps.engine.models_container import Class, Subject, User, UserClass, UserSubjectScore
from core.apps.engine.models_container.models import ClassSubject
from core.apps.engine.serializers_container.class_serializers import ClassSerializer
from core.apps.engine.serializers_container.subject import SubjectSerializer
from core.apps.engine.serializers_container.user import UserSerializer


class CreateClassSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassSubject
        fields = '__all__'
        extra_kwargs = {
            "id": {
                "read_only": True
            }
        }

    def create(self, validated_data):
        class_instance = validated_data.get('class_instance')
        subject = validated_data.get('subject')

        class_subject = ClassSubject.objects.create(**validated_data)

        users = UserClass.objects.filter(class_instance=class_instance).values_list('user', flat=True)

        user_subject_scores = [
            UserSubjectScore(
                student_id_id=user_id,
                subject=subject,
                score={}
            )
            for user_id in users
        ]

        UserSubjectScore.objects.bulk_create(user_subject_scores)

        return class_subject


class GetClassSubjectSerializer(serializers.ModelSerializer):
    class_instance = ClassSerializer()
    subject = SubjectSerializer()
    teacher_id = UserSerializer()

    class Meta:
        model = ClassSubject
        fields = '__all__'
        extra_kwargs = {
            "id": {
                "read_only": True
            }
        }
