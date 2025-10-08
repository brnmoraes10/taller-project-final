import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';

import EstadoCuenta from './pages/alumno/EstadoCuenta';
import RegistroPagos from './pages/cajero/RegistroPago';
import Cupones from './pages/cajero/Cupones';
import Reportes from './pages/admin/Reportes';
import Login from './pages/alumno/Login';
import SeleccionCarrera from './pages/alumno/SeleccionCarrera';
import SubirComprobante from './pages/alumno/SubirComprobante';
import HistorialPagos from './pages/alumno/HistorialPagos';
import RevisarComprobantes from './pages/admin/RevisarComprobantes';
import RegistroActividades from './pages/admin/RegistroActividades';
import CajeroPage from './pages/cajero/CajeroPage';  
import AlumnoLayout from './layouts/AlumnoLayout';
import CajeroLayout from './layouts/CajeroLayout';
import AdminLayout from './layouts/AdminLayout';
import CajeroSidebar from './components/CajeroSidebar'; 
import RegistroPagosAdmin from './pages/admin/RegistroPagoAdmin';
import RevisarComprobantesCajero from './pages/cajero/RevisarComprobantesCajero';
import RegistroActividadesCajero from './pages/cajero/RegistroActividadesCajero';




function App() {
  return (
    <Router>
      <div className="d-flex min-vh-100">
        {/* Sidebar fijo a la izquierda */}
        <Sidebar />

        {/* Contenido principal */}
        <div className="flex-grow-1 p-4 bg-light">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/estado-cuenta" element={<EstadoCuenta />} />
            <Route path="/registro-pagos" element={<RegistroPagos />} />
            <Route path="/cupones" element={<Cupones />} />
            <Route path="/login" element={<Login />} />
            <Route path="/seleccion-carrera" element={<SeleccionCarrera />} />
            <Route path="/estado-cuenta" element={<EstadoCuenta />} />
            <Route path="/subir-comprobante" element={<SubirComprobante />} />
            <Route path="/historial-pagos" element={<HistorialPagos />} />
            <Route path="/admin/revisar-comprobantes" element={<RevisarComprobantes />} />
            <Route path="/admin/registro-actividades" element={<RegistroActividades />} />
            <Route path="/admin/registro-pagos" element={<RegistroPagosAdmin />} />
            <Route path="/admin/reportes" element={<Reportes />} />
            <Route path="/cajero" element={<CajeroPage />} />
            <Route path="/cajero/registro-pagos" element={<RegistroPagos />} />
            <Route path="/cajero/registro-actividades" element={<RegistroActividadesCajero />} />
            <Route path="/cajero/revisar-comprobantes" element={<RevisarComprobantesCajero />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}


export default App;
