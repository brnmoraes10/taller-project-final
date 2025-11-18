import React from "react";
import { Link } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaClipboardList,
  FaFileInvoice,
  FaSignOutAlt,
} from "react-icons/fa";
import logo from '../../image/instituto.png'

const CajeroPage = () => {
  const cards = [
    {
      icon: <FaMoneyBillWave className="text-success" style={{ fontSize: '2.5rem' }} />,
      title: "Registrar Pago",
      description: "Realiza y registra pagos de forma rápida y segura.",
      to: "/cajero/registro-pagos",
      borderClass: "border-success",
    },
    {
      icon: <FaClipboardList className="text-primary" style={{ fontSize: '2.5rem' }} />,
      title: "Registrar Actividad",
      description: "Agrega actividades relacionadas con la caja.",
      to: "/cajero/registro-actividades",
      borderClass: "border-primary",
    },
    {
      icon: <FaFileInvoice className="text-warning" style={{ fontSize: '2.5rem' }} />,
      title: "Revisar Comprobantes",
      description: "Consulta y valida los comprobantes emitidos.",
      to: "/cajero/revisar-comprobantes",
      borderClass: "border-warning",
    },
    {
      icon: <FaSignOutAlt className="text-danger" style={{ fontSize: '2.5rem' }} />,
      title: "Cerrar Sesión",
      description: "Finaliza tu sesión de forma segura.",
      to: "/logout",
      borderClass: "border-danger",
    },
  ];

  return (
      <div className="container py-4">
        <div className="text-center mb-5">
          {/* Imagen hero */}
          <img
            src={logo}
            alt="Cajero"
            style={{ width: "220px", marginBottom: "1rem" }}
          />

          <h2 className="fw-bold text-dark mb-2">Bienvenido al Panel del Cajero</h2>
          <p className="text-secondary fs-5">Selecciona una actividad para comenzar</p>
        </div>

        <div className="row g-4">
          {cards.map(({ icon, title, description, to, borderClass }, index) => (
            <div key={index} className="col-12 col-md-6">
              <Link to={to} className="text-decoration-none">
                <div
                  className={`d-flex align-items-start gap-3 p-4 bg-white rounded shadow-sm border-start border-4 ${borderClass} h-100 card-hover`}
                >
                  <div>{icon}</div>
                  <div>
                    <h3 className="h5 text-dark">{title}</h3>
                    <p className="text-muted mb-0">{description}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <style>{`
          .card-hover {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 .125rem .25rem rgba(0,0,0,.075);
          }
          .card-hover:hover {
            transform: translateY(-6px) scale(1.03);
            box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15);
            text-decoration: none;
          }
        `}</style>
      </div>
  );
};

export default CajeroPage;
