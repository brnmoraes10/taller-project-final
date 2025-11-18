from django.db import models
from django.contrib.auth.models import AbstractUser

# Usuario personalizado
class User(AbstractUser):
    ROLES = (
        ('alumno', 'Alumno'),
        ('cajero', 'Cajero'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLES, default='alumno')

# Alumno (si necesitás info extra)
class Alumno(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    carrera = models.CharField(max_length=100, blank=True, null=True)

# Pago
class Pago(models.Model):
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE)
    fecha = models.DateField(auto_now_add=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.CharField(max_length=255)
    aprobado = models.BooleanField(default=False)

# Comprobante (para subir comprobantes)
class Comprobante(models.Model):
    pago = models.ForeignKey(Pago, on_delete=models.CASCADE)
    archivo = models.FileField(upload_to='comprobantes/')
    aprobado = models.BooleanField(default=False)
