from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .forms import RegistroForm
from .serializers import MyTokenObtainPairSerializer, PagoSerializer, ComprobanteSerializer, TipoPagoSerializer, AlumnoSerializer
from .models import Pago, TipoPago, Comprobante, Alumno
from rest_framework import status

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

        pagos = Pago.objects.filter(alumno=alumno).select_related(
        'estado_pago',
        'tipos_pago'
        )

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
    
class ComprobanteCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ComprobanteSerializer(data=request.data)
        print("REQUEST DATA =>", request.data)
        if serializer.is_valid():
            comprobante = serializer.save()   # ← ya tienes el comprobante creado

            # ---- ACTUALIZAR ESTADO DEL PAGO ----
            pago = comprobante.pago           # ← obtienes el pago relacionado
            pago.estado_pago_id = 4           # ← el valor que necesites
            pago.save()                       # ← guardas

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("ERRORS =>", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class TipoPagoListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        tipos_pagos = TipoPago.objects.all()
        serializer = TipoPagoSerializer(tipos_pagos, many=True)
        return Response(serializer.data)
    
class ComprobantesListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        comprobantes = Comprobante.objects.select_related(
        'pago',
        'tipopago',
        'estadopago'
    
        )
        serializer = ComprobanteSerializer(comprobantes, many=True)
        return Response(serializer.data)
    
class ComprobantesUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            comprobante = Comprobante.objects.get(pk=pk)
        except Comprobante.DoesNotExist:
            return Response({"error": "Comprobante no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ComprobanteSerializer(comprobante, data=request.data, partial=True)

        if serializer.is_valid():
            comprobante_actualizado = serializer.save()

            # ----- ACTUALIZAR ESTADO DEL PAGO -----
            pago = comprobante_actualizado.pago      # obtenemos el pago relacionado
            pago.estado_pago_id = comprobante_actualizado.estadopago_id  # estado que quieras asignar
                                         

            if comprobante_actualizado.estadopago_id == 1:
                pago.aprobado = 1
            else:
                pago.aprobado = 0

            pago.save()  # guardamos
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class AlumnosListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        alumnos = Alumno.objects.all()
        serializer = AlumnoSerializer(alumnos, many=True)
        return Response(serializer.data)

