import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AlumnoLayout from "./layouts/AlumnoLayout";
import CajeroLayout from "./layouts/CajeroLayout";
import AdminLayout from "./layouts/AdminLayout";

import Login from "./pages/alumno/Login";
import EstadoCuenta from "./pages/alumno/EstadoCuenta";
import SeleccionCarrera from "./pages/alumno/SeleccionCarrera";
import SubirComprobante from "./pages/alumno/SubirComprobante";
import HistorialPagos from "./pages/alumno/HistorialPagos";

import RegistroPagos from "./pages/cajero/RegistroPago";
import RevisarComprobantesCajero from "./pages/cajero/RevisarComprobantesCajero";
import RegistroActividadesCajero from "./pages/cajero/RegistroActividadesCajero";

import RevisarComprobantes from "./pages/admin/RevisarComprobantes";
import RegistroActividades from "./pages/admin/RegistroActividades";
import RegistroPagosAdmin from "./pages/admin/RegistroPagoAdmin";
import Reportes from "./pages/admin/Reportes";
import CajeroPage from "./pages/cajero/CajeroPage";
import AlumnoPage from "./pages/alumno/AlumnoPage";
import AdminPage from "./pages/admin/AdminPage";

function App() {
  return (
    <Router>
      <Routes>

        {/* ========= LOGIN (SIN SIDEBAR) ========= */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/seleccion-carrera" element={<SeleccionCarrera />} />

        {/* ========= RUTAS DEL ALUMNO ========= */}
        <Route element={<AlumnoLayout />}>
          <Route path="/alumno" element={<AlumnoPage />} />
          <Route path="/alumno/estado-cuenta" element={<EstadoCuenta />} />
          <Route path="/alumno/subir-comprobante" element={<SubirComprobante />} />
          <Route path="/alumno/historial-pagos" element={<HistorialPagos />} />
        </Route>

        {/* ========= RUTAS DEL CAJERO ========= */}
        <Route element={<CajeroLayout />}>
          <Route path="/cajero" element={<CajeroPage />} />
          <Route path="/cajero/registro-pagos" element={<RegistroPagos />} />
          <Route path="/cajero/revisar-comprobantes" element={<RevisarComprobantesCajero />} />
          <Route path="/cajero/registro-actividades" element={<RegistroActividadesCajero />} />
        </Route>

        {/* ========= RUTAS DEL ADMIN ========= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="revisar-comprobantes" element={<RevisarComprobantes />} />
          <Route path="registro-actividades" element={<RegistroActividades />} />
          <Route path="registro-pagos" element={<RegistroPagosAdmin />} />
          <Route path="reportes" element={<Reportes />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
