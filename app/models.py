from django.db import models
from django.contrib.auth.models import AbstractUser

# ========================
#  MODELO USER PERSONALIZADO
# ========================
class User(AbstractUser):
    ROLES = (
        ('alumno', 'Alumno'),
        ('cajero', 'Cajero'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLES, default='alumno')


# ========================
#  ALUMNO
# ========================
class Alumno(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    carrera = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.user.username


# ========================
#  TIPO DE PAGO
# ========================
class TipoPago(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre


# ========================
#  ESTADO DEL PAGO
# ========================
class EstadoPago(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre


# ========================
#  PLAN PAGO ALUMNO
# ========================
class PlanPagoAlumno(models.Model):
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE)
    nombre_plan = models.CharField(max_length=100)
    descripcion = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.nombre_plan} - {self.alumno}"


# ========================
#  PAGO
# ========================
class Pago(models.Model):
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE)
    fecha = models.DateField(auto_now_add=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.CharField(max_length=255)
    aprobado = models.BooleanField(default=False)

    id_plan_pago_alumno = models.ForeignKey(
        PlanPagoAlumno, on_delete=models.SET_NULL,
        null=True, blank=True
    )
    tipos_pago = models.ForeignKey(
        TipoPago, on_delete=models.SET_NULL,
        null=True
    )
    estado_pago = models.ForeignKey(
        EstadoPago, on_delete=models.SET_NULL,
        null=True
    )

    detalle_planes_pago_cuota_alumno = models.CharField(
        max_length=255, null=True, blank=True
    )
    referencia = models.CharField(
        max_length=100, null=True, blank=True
    )
    id_cupon_pago_cuota = models.IntegerField(null=True, blank=True)

    usuario_registra = models.ForeignKey(
        User, related_name='pagos_registrados',
        on_delete=models.SET_NULL, null=True
    )
    usuario_valida = models.ForeignKey(
        User, related_name='pagos_validados',
        on_delete=models.SET_NULL,
        null=True, blank=True
    )

    estado_registro = models.IntegerField(default=1)
    observaciones = models.TextField(null=True, blank=True)
    id_tipo_pago = models.IntegerField(null=True, blank=True)

    descuento = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    recargo = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Pago {self.id} - {self.alumno}"


# ========================
#  COMPROBANTE
# ========================
class Comprobante(models.Model):
    pago = models.ForeignKey(Pago, on_delete=models.CASCADE)
    archivo = models.FileField(upload_to='comprobantes/')
    aprobado = models.BooleanField(default=False)

    def __str__(self):
        return f"Comprobante {self.id} - Pago {self.pago.id}"
