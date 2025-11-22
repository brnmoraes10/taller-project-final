from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Pago, EstadoPago, TipoPago, Comprobante, Alumno

User = get_user_model()

# Serializer para login JWT (si quieres campos adicionales)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Agregar campos personalizados si quieres
        token['username'] = user.username
        token['role'] = user.role  # si tu User tiene campo role
        return token

# Serializer para tus pagos (EstadoCuenta)

class EstadoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoPago
        fields = '__all__'

class TipoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoPago
        fields = '__all__'

class AlumnoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumno
        fields = '__all__'

class PagoSerializer(serializers.ModelSerializer):
    estado_pago = EstadoPagoSerializer(read_only=True)
    tipos_pago = TipoPagoSerializer(read_only=True)
    alumno = AlumnoSerializer(read_only=True)

    class Meta:
        model = Pago
        fields = '__all__'

class ComprobanteSerializer(serializers.ModelSerializer):

    # SOLO mostramos los datos del pago, pero mantenemos el campo escrito
    pago = PagoSerializer(read_only=True)
    pago_id = serializers.PrimaryKeyRelatedField(
        queryset=Pago.objects.all(),
        source="pago",
        write_only=True,
        required=False
    )

    tipopago = TipoPagoSerializer(read_only=True)
    tipopago_id = serializers.PrimaryKeyRelatedField(
        queryset=TipoPago.objects.all(),
        source="tipopago",
        write_only=True,
        required=False
    )

    estadopago = EstadoPagoSerializer(read_only=True)
    estadopago_id = serializers.PrimaryKeyRelatedField(
        queryset=EstadoPago.objects.all(),
        source="estadopago",
        write_only=True,
        required=False
    )

    class Meta:
        model = Comprobante
        fields = "__all__"


