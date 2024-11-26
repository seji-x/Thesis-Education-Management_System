from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from core.apps.engine.models import User  # Import đúng từ models.py


class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ('email', 'full_name', 'is_active', 'date_joined')  # Các trường hiển thị trong Admin
    search_fields = ('email', 'full_name')
    list_filter = ('is_active', 'is_staff', 'is_superuser')
    ordering = ('-date_joined',)  # Sắp xếp theo thời gian tham gia (mới nhất đầu tiên)
    fields = (
        'email', 'password', 'full_name', 'username', 'phone_number', 'code', 'is_active', 'avatar',
        'role', 'gender', 'is_superuser', 'is_staff', 'date_of_birth', 'verify_code', 'address',
        'soft_delete', 'settings', 'date_joined'
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')
        }),
    )  # Nếu bạn muốn định nghĩa trường khi tạo người dùng mới


admin.site.register(User, CustomUserAdmin)
