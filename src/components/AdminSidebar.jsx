import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active bg-primary' : '';

  return (
    <div
      className="d-flex flex-column p-3 bg-dark text-white"
      style={{
        width: '250px',
        minHeight: '100vh',
        position: 'fixed',      // Fija el sidebar a la izquierda aunque hagas scroll
        top: 0,
        left: 0,
        overflowY: 'auto',      // Para que si hay muchos items, se pueda scrollear
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',  // Sombra sutil para separar del contenido
        zIndex: 1000            // Para que esté encima de otros elementos si hace falta
      }}
    >
      <h4 className="mb-4">Panel Administrativo</h4>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/admin" className={`nav-link text-white ${isActive('/admin')}`}>
            Inicio
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/revisar-comprobantes" className={`nav-link text-white ${isActive('/admin/revisar-comprobantes')}`}>
            Revisar Comprobantes
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/reportes" className={`nav-link text-white ${isActive('/admin/reportes')}`}>
            Reportes
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/registro-actividades" className={`nav-link text-white ${isActive('/admin/registro-actividades')}`}>
            Registro de Actividades
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/admin/registro-pagos" className={`nav-link text-white ${isActive('/admin/registro-pagos')}`}>
            Registro de Pagos
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
