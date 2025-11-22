from django.db import models
from django.contrib.auth.models import AbstractUser

# ======================================
#   USER PERSONALIZADO
# ======================================
class User(AbstractUser):
    ROLES = (
        ('alumno', 'Alumno'),
        ('cajero', 'Cajero'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLES, default='alumno')

    def __str__(self):
        return self.username


# ======================================
#   ALUMNO  → tabla: app_alumno
# ======================================
class Alumno(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    carrera = models.CharField(max_length=100, null=True, blank=True)

    apellido_alumno = models.CharField(max_length=100, null=True, blank=True)
    nombre_alumno = models.CharField(max_length=100, null=True, blank=True)
    DNI = models.IntegerField(null=True, blank=True)
    domicilio_alumno = models.CharField(max_length=100, null=True, blank=True)
    telefono_alumno = models.IntegerField(null=True, blank=True)
    email_alumno = models.CharField(max_length=100, null=True, blank=True)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nombre_alumno} {self.apellido_alumno}"


# ======================================
#   TIPO DE PAGO  → tabla: app_tipopago
# ======================================
class TipoPago(models.Model):
    tipopago = models.CharField(max_length=50, db_column='tipopago')
    id_estado = models.IntegerField(db_column='id_estado')

    def __str__(self):
        return self.tipopago


# ======================================
#   ESTADO PAGO → tabla: app_estadopago
# ======================================
class EstadoPago(models.Model):
    nombre_estado = models.CharField(max_length=50, db_column='nombre_estado')
    descripcion = models.CharField(max_length=100, null=True, blank=True, db_column='descripcion')
    
    # Debe ser nullable
    id_estado = models.IntegerField(null=True, blank=True, db_column='id_estado')

    color = models.CharField(    
        max_length=20,           
        null=True,
        blank=True,
        db_column='color'
    )

    def __str__(self):
        return self.nombre_estado


# ======================================
#   PLAN PAGO ALUMNO → app_planpagoalumno
# ======================================
class PlanPagoAlumno(models.Model):
    nombre_plan = models.CharField(max_length=100)
    descripcion = models.TextField(null=True, blank=True)
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE)

    id_alumno = models.IntegerField(null=True, blank=True)
    id_cuota = models.IntegerField(null=True, blank=True)
    estado = models.BooleanField(default=True)
    fecha_ini = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.nombre_plan} - {self.alumno}"


# ======================================
#   PAGO  → tabla: app_pago
# ======================================
class Pago(models.Model):
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE)
    fecha = models.DateField()
    fecha_ven = models.DateField(null=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.CharField(max_length=255)
    aprobado = models.BooleanField(default=False)
    descuento = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    recargo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    detalle_planes_pago_cuota_alumno = models.CharField(max_length=255, null=True, blank=True)
    estado_registro = models.IntegerField(default=1)
    id_cupon_pago_cuota = models.IntegerField(null=True, blank=True)
    id_tipo_pago = models.IntegerField(null=True, blank=True)
    observaciones = models.TextField(null=True, blank=True)
    referencia = models.CharField(max_length=100, null=True, blank=True)

    usuario_registra = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True,
        related_name='pagos_registrados'
    )
    usuario_valida = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='pagos_validados'
    )

    # CLAVES CORREGIDAS PARA QUE COINCIDAN CON LA BD REAL
    estado_pago = models.ForeignKey(
        EstadoPago,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='estado_pago_id'
    )

    tipos_pago = models.ForeignKey(
        TipoPago,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='tipos_pago_id'
    )

    id_plan_pago_alumno = models.ForeignKey(
        PlanPagoAlumno,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        db_column='id_plan_pago_alumno_id'
    )

    def __str__(self):
        return f"Pago {self.id} - {self.alumno}"


# ======================================
#   COMPROBANTE  → tabla: app_comprobante
# ======================================
class Comprobante(models.Model):
    id_comprobante = models.AutoField(primary_key=True)
    archivo = models.CharField(max_length=100, null=True, blank=True)
    aprobado = models.BooleanField(default=False)
    cupon = models.CharField(max_length=100, null=True, blank=True)
    nro_comprobante = models.IntegerField(null=True, blank=True)
    fecha_emision = models.DateField(null=True, blank=True)
    estado = models.CharField(max_length=100, null=True, blank=True)
    id_cuponpago_cuota = models.IntegerField(null=True, blank=True)
    importe = models.IntegerField(null=True, blank=True)
    user_valida = models.CharField(max_length=100, null=True, blank=True)
    fecha_validado = models.DateField(null=True, blank=True)
    observacion = models.CharField(max_length=200, null=True, blank=True)
    urlarchivo = models.FileField(upload_to='comprobantes/', null=True, blank=True)
    pasarela = models.CharField(max_length=100, null=True, blank=True)

    # FK REAL (columna: pago_id)
    pago = models.ForeignKey(Pago, on_delete=models.CASCADE, db_column='id_pago')
    tipopago = models.ForeignKey(TipoPago, on_delete=models.SET_NULL, null=True, blank=True, db_column='id_tipo_pago')
    estadopago = models.ForeignKey(EstadoPago, on_delete=models.SET_NULL, null=True, blank=True, db_column='id_estado')

    def __str__(self):
        return f"Comprobante {self.id}"
