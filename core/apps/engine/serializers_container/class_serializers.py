from django.db.models import Avg
from rest_framework import serializers

from core.apps.engine.models_container import Class, UserClass


class ClassSerializer(serializers.ModelSerializer):
    teacher = serializers.SerializerMethodField()
    student_count = serializers.SerializerMethodField()

    class Meta:
        model = Class
        fields = ['id', 'name', 'key', 'year', 'teacher', 'student_count']

    def get_teacher(self, obj):
        from core.apps.engine.serializers_container.user import UserSerializer
        if obj.teacher:
            return UserSerializer(obj.teacher).data
        return None

    def get_student_count(self, obj):
        return UserClass.objects.filter(class_instance=obj).count()


class CreateClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['name', 'key', 'year', 'teacher']
