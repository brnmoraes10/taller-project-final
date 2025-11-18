# app/urls.py
from django.urls import path
from .views import (
    MyTokenObtainPairView,
    EstadoCuentaView,
    CajeroView,
    AdminView,
    MeView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # JWT login / refresh
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Info usuario
    path('me/', MeView.as_view(), name='me'),

    # Endpoints de tu app
    path('estado-cuenta/', EstadoCuentaView.as_view(), name='estado_cuenta'),
    path('cajero/', CajeroView.as_view(), name='cajero_data'),
    path('admin/', AdminView.as_view(), name='admin_data'),
]
