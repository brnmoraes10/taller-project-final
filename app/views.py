from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .forms import RegistroForm
from .serializers import MyTokenObtainPairSerializer, PagoSerializer
from .models import Pago, User

# ==========================
# Django Views (HTML pages)
# ==========================

def login_view(request):
    error = None
    if request.method == 'POST':
        u = request.POST.get('username', "").strip()
        p = request.POST.get('password', "").strip()
        user = authenticate(request, username=u, password=p)
        if user is not None:
            login(request, user)
            return redirect('home')
        error = "Usuario o contraseña incorrectos"
    return render(request, 'login.html', {'error': error})

def register_view(request):
    from django.contrib.auth.forms import UserCreationForm
    Form = RegistroForm if 'RegistroForm' in globals() else UserCreationForm

    if request.method == 'POST':
        form = Form(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = Form()
    return render(request, 'registro.html', {'form': form})

def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return redirect('login')
    return render(request, 'confirm_logout.html')

@login_required
def home(request):
    return render(request, 'home.html')

# ==========================
# API Views (JWT / REST)
# ==========================

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class EstadoCuentaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Obtenemos el Alumno asociado al usuario actual
        alumno = getattr(request.user, 'alumno', None)
        if alumno is None:
            return Response({"error": "No se encontró información del alumno"}, status=404)

        pagos = Pago.objects.filter(alumno=alumno)
        serializer = PagoSerializer(pagos, many=True)
        return Response(serializer.data)

class CajeroView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "mensaje": "Datos del cajero",
            "usuario": request.user.username
        })

class AdminView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "mensaje": "Datos del admin",
            "usuario": request.user.username
        })

# ==========================
# API para obtener info del usuario
# ==========================

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "rol": user.role
        })
