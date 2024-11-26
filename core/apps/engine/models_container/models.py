from core.apps.engine.models_container import (UserManager, make_password, AbstractBaseUser,
                                               PermissionsMixin, models, uuid)
from core.apps.engine.models_container.enum_type import SystemRoleEnum, RoleUserEnum, RoleTenantEnum, RoleTenantEnum, \
    RoleUserEnum, GenderEnum, DayOfWeekEnum, StatusClassSubjectEnum, StatusUserSubjectScoreEnum
from core.apps.engine.utils.utils import generate_code_by_domain


# Create your models here.

class CustomUserManager(UserManager):
    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a user with the given username, email, and password.
        """
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.password = make_password(password)
        user.referral = generate_code_by_domain()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a `User` with superuser (admin) permissions."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'ADMIN')
        # Call _create_user method to create the user
        user = self._create_user(email, password, **extra_fields)
        return user

    def create_user(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_active', False)
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('role', SystemRoleEnum.USER)
        return self._create_user(email, password, **extra_fields)

    def get_by_natural_key(self, email):
        """Retrieve a user by email."""
        return self.get(email=email)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(null=True, blank=False, unique=True)
    password = models.CharField(max_length=255, blank=True)
    full_name = models.CharField(max_length=255, null=True, blank=False)
    username = models.CharField(max_length=255, null=True, blank=False)
    phone_number = models.CharField(max_length=10, null=True, blank=True)
    code = models.CharField(max_length=255, null=True, blank=False)
    is_active = models.BooleanField(default=True, blank=True)
    avatar = models.ImageField(upload_to='data/avatars/', null=True, blank=True)
    role = models.CharField(max_length=50, choices=RoleUserEnum.choices(), null=True, blank=True,
                            default=RoleUserEnum.STUDENT.value)
    gender = models.CharField(max_length=50, choices=GenderEnum.choices(), null=True, blank=True)
    is_superuser = models.BooleanField(default=False, blank=True)
    is_staff = models.BooleanField(default=False, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    verify_code = models.CharField(max_length=50, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    soft_delete = models.BooleanField(default=False, blank=True)
    settings = models.JSONField(null=True, blank=True)

    date_joined = models.DateTimeField(auto_now_add=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'username']

    objects = CustomUserManager()

    class Meta:
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['username']),
        ]

    def __str__(self):
        return self.email


class Class(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=255, null=True, blank=False, unique=True)
    key = models.CharField(max_length=255, null=True, blank=False)
    year = models.PositiveIntegerField(null=False, blank=False)
    teacher = models.ForeignKey('User', on_delete=models.CASCADE, related_name='classes', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Class"
        verbose_name_plural = "Classes"

    def __str__(self):
        return self.name

    @classmethod
    def total_classes(cls):
        return cls.objects.count()


class UserClass(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_classes')
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="user_classes", null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.full_name} - {self.class_instance.name if self.class_instance else "No Class"}'


class Subject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=255, null=True, blank=False, unique=True)
    key = models.CharField(max_length=255, null=True, blank=False)
    grade = models.CharField(max_length=255, null=True, blank=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def total_subjects(cls):
        return cls.objects.count()


class ClassSubject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, related_name="class_subjects")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="class_subjects")
    teacher_id = models.ForeignKey('User', on_delete=models.CASCADE, related_name='class_subjects', null=True,
                                   blank=True)

    status = models.CharField(max_length=50, choices=StatusClassSubjectEnum.choices(), null=True, blank=True,
                              default=StatusClassSubjectEnum.ACTIVE)
    semester = models.PositiveIntegerField(null=True, blank=True)
    year = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class UserSubjectScore(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    student_id = models.ForeignKey('User', on_delete=models.CASCADE, related_name='user_subject_score', null=True,
                                   blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="user_subject_score", null=True,
                                blank=True)
    score = models.JSONField(null=True, blank=True)
    average_score = models.FloatField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=StatusUserSubjectScoreEnum.choices(), null=True, blank=True,
                              default=StatusUserSubjectScoreEnum.OPEN)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Schedule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    class_subject = models.ForeignKey(ClassSubject, on_delete=models.CASCADE, related_name="schedules", null=True,
                                      blank=True)
    day_of_week = models.CharField(max_length=50, choices=DayOfWeekEnum.choices(), null=True, blank=True)
    period = models.PositiveIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Notification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications', null=True, blank=True)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_notifications', null=True,
                                  blank=True)
    title = models.CharField(max_length=255, null=True, blank=True)
    detail = models.TextField(null=True, blank=True)
    status = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Setting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    data = models.JSONField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="documents", null=True, blank=True)
    title = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    url = models.CharField(max_length=500, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title if self.title else "Untitled Document"
