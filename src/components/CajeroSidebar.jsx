import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function CajeroSidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active bg-primary' : '';

  return (
    <div
      className="d-flex flex-column p-3 bg-dark text-white"
      style={{
        width: '250px',
        minHeight: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflowY: 'auto',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}
    >
      <h4 className="mb-4">Panel de Cajero</h4>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/cajero" className={`nav-link text-white ${isActive('/cajero')}`}>
            Inicio
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/cajero/registro-pagos" className={`nav-link text-white ${isActive('/cajero/registro-pagos')}`}>
            Registro de Pagos
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/cajero/registro-actividades" className={`nav-link text-white ${isActive('/cajero/registro-actividades')}`}>
            Registro de Actividades
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/cajero/revisar-comprobantes" className={`nav-link text-white ${isActive('/cajero/revisar-comprobantes')}`}>
            Revisar Comprobantes
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link text-white">
            Salir
          </Link>
        </li>
      </ul>
    </div>
  );
}
