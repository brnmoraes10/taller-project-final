
# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Alumno, Pago, Comprobante

class CustomUserAdmin(UserAdmin):
    # Mostrar campo 'role' en el admin
    fieldsets = UserAdmin.fieldsets + (
        ('Rol del usuario', {'fields': ('role',)}),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Rol del usuario', {'fields': ('role',)}),
    )

    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser')

admin.site.register(User, CustomUserAdmin)
admin.site.register(Alumno)
admin.site.register(Pago)
admin.site.register(Comprobante)
