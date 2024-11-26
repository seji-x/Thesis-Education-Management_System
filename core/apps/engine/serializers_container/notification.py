from django.db.models import Avg
from rest_framework.response import Response
from rest_framework import serializers, status

from core.apps.engine.models_container import Notification, User, UserClass
from core.apps.engine.serializers_container.user import UserSerializer


class GetNotificationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = '__all__'
        extra_kwargs = {
            "id": {
                "read_only": True
            }
        }


class CreateNotificationSerializer(serializers.ModelSerializer):
    all_students = serializers.BooleanField(write_only=True, required=False, default=False)
    student_ids = serializers.ListField(child=serializers.CharField(max_length=100), write_only=True, required=False,
                                        help_text="List of student IDs to send the notification")
    all_teacher = serializers.BooleanField(write_only=True, required=False, default=False)
    teacher_ids = serializers.ListField(child=serializers.CharField(max_length=100), write_only=True, required=False,
                                        help_text="List of student IDs to send the notification")
    class_instance = serializers.UUIDField(write_only=True, required=False, help_text="Class instance ID")

    class Meta:
        model = Notification
        fields = '__all__'
        extra_kwargs = {
            "id": {
                "read_only": True
            },
            "sender": {
                "read_only": True
            },
            "recipient": {
                "read_only": True
            }
        }

    def create(self, validated_data):
        request_user = self.context['request'].user
        role = request_user.role
        validated_data.pop('sender', None)

        all_students = validated_data.pop('all_students', False)
        student_ids = validated_data.pop('student_ids', [])
        all_teacher = validated_data.pop('all_teacher', False)
        teacher_ids = validated_data.pop('teacher_ids', [])
        class_instance_id = validated_data.pop('class_instance', None)

        notifications_to_create = []

        if role == 'ADMIN':
            if all_students:
                students = User.objects.filter(role="STUDENT")
                notifications_to_create.extend([
                    Notification(sender=request_user, recipient=student, **validated_data) for student in students
                ])
            elif class_instance_id:
                student_ids = UserClass.objects.filter(class_instance=class_instance_id).values_list('user', flat=True)
                students = User.objects.filter(id__in=student_ids)
                notifications_to_create.extend([
                    Notification(sender=request_user, recipient=student, **validated_data) for student in students
                ])
            elif student_ids:
                student_ids = [uuid for student_id_str in student_ids for uuid in student_id_str.split(',')]
                students = User.objects.filter(id__in=student_ids, role="STUDENT")
                notifications_to_create.extend([
                    Notification(sender=request_user, recipient=student, **validated_data) for student in students
                ])
            elif all_teacher:
                teachers = User.objects.filter(role="TEACHER")
                notifications_to_create.extend([
                    Notification(sender=request_user, recipient=teacher, **validated_data) for teacher in teachers
                ])
            elif teacher_ids:
                teacher_ids = [uuid for teacher_id_str in teacher_ids for uuid in teacher_id_str.split(',')]
                teachers = User.objects.filter(id__in=teacher_ids, role="TEACHER")
                notifications_to_create.extend([
                    Notification(sender=request_user, recipient=teacher, **validated_data) for teacher in teachers
                ])

        elif role == 'TEACHER':
            if class_instance_id:
                student_ids = UserClass.objects.filter(class_instance=class_instance_id).values_list('user', flat=True)
                students = User.objects.filter(id__in=student_ids)
                notifications_to_create.extend([
                    Notification(sender=request_user, recipient=student, **validated_data) for student in students
                ])
            elif student_ids:
                student_ids = [uuid for student_id_str in student_ids for uuid in student_id_str.split(',')]
                students = User.objects.filter(id__in=student_ids, role="STUDENT")
                notifications_to_create.extend([
                    Notification(sender=request_user, recipient=student, **validated_data) for student in students
                ])
        else:
            raise serializers.ValidationError("Permission denied. Only ADMIN and TEACHER roles are allowed.")

        if notifications_to_create:
            Notification.objects.bulk_create(notifications_to_create)
        return Response({"status": "success", "message": "Notifications created successfully."})
