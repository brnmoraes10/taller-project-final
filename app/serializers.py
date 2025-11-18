from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Pago

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
class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = '__all__'
