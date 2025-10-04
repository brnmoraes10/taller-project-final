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
          <Link to="/estado-cuenta" className={`nav-link text-white ${isActive('/estado-cuenta')}`}>
            Estado de Cuenta
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/subir-comprobante" className={`nav-link text-white ${isActive('/subir-comprobante')}`}>
            Subir Comprobante
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/historial-pagos" className={`nav-link text-white ${isActive('/historial-pagos')}`}>
            Historial de Pagos
          </Link>
        </li>
      </ul>
    </div>
  );
}
