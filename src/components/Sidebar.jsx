import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="d-flex flex-column p-3 bg-dark text-white" style={{width: "250px", minHeight: "100vh"}}>
      <h2 className="mb-4">Instituto del Milagro</h2>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/estado-cuenta" className="nav-link text-white">Estado de Cuenta</Link>
        </li>
        <li>
          <Link to="/registro-pagos" className="nav-link text-white">Registro de Pagos</Link>
        </li>
        <li>
          <Link to="/cupones" className="nav-link text-white">Generación de Cupones</Link>
        </li>
        <li>
          <Link to="/admin/reportes" className="nav-link text-white">Reportes Administrativos</Link>
        </li>
      </ul>
    </div>
  );
}
