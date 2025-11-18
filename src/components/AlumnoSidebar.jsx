import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AlumnoSidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active bg-primary' : '';

  return (
    <div className="d-flex flex-column p-3 bg-dark text-white" style={{ width: '250px', minHeight: '100vh' }}>
      <h4 className="mb-4">Instituto del Milagro</h4>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/alumno" className={`nav-link text-white ${isActive('/alumno')}`}>
            Inicio
          </Link>
        </li>
        <li className="nav-item">
        <Link to="/alumno/estado-cuenta" className={`nav-link text-white ${isActive('/alumno/estado-cuenta')}`}>
          Estado de Cuenta
        </Link>

        <Link to="/alumno/subir-comprobante" className={`nav-link text-white ${isActive('/alumno/subir-comprobante')}`}>
          Subir Comprobante
        </Link>

        <Link to="/alumno/historial-pagos" className={`nav-link text-white ${isActive('/alumno/historial-pagos')}`}>
          Historial de Pagos
        </Link>

        <Link to="/" className="nav-link text-white">
          Salir
        </Link>

        </li>
      </ul>
    </div>
  );
}
