import React, { useState } from "react";
import { FaEye, FaPlusCircle, FaEdit } from "react-icons/fa";

export default function RegistroActividades() {
  const [actividades, setActividades] = useState([
    {
      id: 1,
      dni: "12345678",
      usuario: "Admin1",
      estado: "Aprobado",
      detalles: "Pago ID 123",
      fecha: "2025-09-20 10:15",
      observacion: "",
      periodo: "Septiembre 2025",
      notaCredito: "NC-001",
    },
    {
      id: 2,
      dni: "87654321",
      usuario: "Cajero2",
      estado: "Rechazado",
      detalles: "Comprobante ID 456 - Ilegible",
      fecha: "2025-09-19 16:50",
      observacion: "Imagen borrosa",
      periodo: "Agosto 2025",
      notaCredito: "",
    },
  ]);

  const [filtroDni, setFiltroDni] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");

  const [verObservacion, setVerObservacion] = useState(null);

  // Estado para nuevo o edición
  const [nuevo, setNuevo] = useState({
    dni: "",
    usuario: "",
    detalles: "",
    periodo: "",
    notaCredito: "",
  });

  // Para saber si estamos editando (id de la actividad) o creando (null)
  const [editandoId, setEditandoId] = useState(null);

  const meses = [
    "Enero 2025", "Febrero 2025", "Marzo 2025", "Abril 2025", "Mayo 2025", "Junio 2025",
    "Julio 2025", "Agosto 2025", "Septiembre 2025", "Octubre 2025", "Noviembre 2025", "Diciembre 2025",
  ];

  const estados = ["Aprobado", "Rechazado", "Pendiente"];
  const usuarios = [...new Set(actividades.map((a) => a.usuario))];

  const agregarActividad = (e) => {
    e.preventDefault();
    if (!nuevo.dni || !nuevo.usuario || !nuevo.detalles || !nuevo.periodo) {
      alert("Completa todos los campos obligatorios ❗");
      return;
    }

    if (editandoId !== null) {
      // Editar actividad existente
      setActividades(actividades.map((a) =>
        a.id === editandoId
          ? { ...a, ...nuevo }
          : a
      ));
      alert("Actividad actualizada ✅");
    } else {
      // Agregar nueva actividad
      const nuevaActividad = {
        id: actividades.length > 0 ? Math.max(...actividades.map(a => a.id)) + 1 : 1,
        ...nuevo,
        estado: "Pendiente",
        fecha: new Date().toISOString().slice(0, 16).replace("T", " "),
        observacion: "",
      };
      setActividades([...actividades, nuevaActividad]);
      alert("Actividad registrada ✅");
    }

    // Reset formulario y estado edición
    setNuevo({ dni: "", usuario: "", detalles: "", periodo: "", notaCredito: "" });
    setEditandoId(null);
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "Aprobado":
        return <span className="badge bg-success px-3 py-2">{estado}</span>;
      case "Rechazado":
        return <span className="badge bg-danger px-3 py-2">{estado}</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2">{estado}</span>;
    }
  };

  const actividadesFiltradas = actividades.filter((a) => {
    return (
      (filtroDni ? a.dni.includes(filtroDni) : true) &&
      (filtroPeriodo ? a.periodo === filtroPeriodo : true) &&
      (filtroEstado ? a.estado === filtroEstado : true) &&
      (filtroUsuario ? a.usuario === filtroUsuario : true)
    );
  });

  // Función para cargar la actividad a editar
  const editarActividad = (actividad) => {
    setNuevo({
      dni: actividad.dni,
      usuario: actividad.usuario,
      detalles: actividad.detalles,
      periodo: actividad.periodo,
      notaCredito: actividad.notaCredito,
    });
    setEditandoId(actividad.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll arriba para ver formulario
  };

  return (
      <div className="container mt-5">
        <h2 className="text-center mb-4 text-uppercase text-primary fw-bold">
          Registro de Actividades
        </h2>

        {/* FORMULARIO NUEVA / EDITAR ACTIVIDAD */}
        <div className="card shadow-sm mb-4">
          <div className="card-header fw-bold bg-light">
            {editandoId !== null ? (
              <>Editar Actividad (ID: {editandoId})</>
            ) : (
              <>
                <FaPlusCircle className="me-2 text-primary" />
                Nueva Actividad
              </>
            )}
          </div>
          <div className="card-body">
            <form className="row g-3" onSubmit={agregarActividad}>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="DNI"
                  value={nuevo.dni}
                  onChange={(e) => setNuevo({ ...nuevo, dni: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Usuario"
                  value={nuevo.usuario}
                  onChange={(e) => setNuevo({ ...nuevo, usuario: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Detalles"
                  value={nuevo.detalles}
                  onChange={(e) => setNuevo({ ...nuevo, detalles: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={nuevo.periodo}
                  onChange={(e) => setNuevo({ ...nuevo, periodo: e.target.value })}
                  required
                >
                  <option value="">Periodo</option>
                  {meses.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nota de Crédito"
                  value={nuevo.notaCredito}
                  onChange={(e) => setNuevo({ ...nuevo, notaCredito: e.target.value })}
                />
              </div>
              <div className="col-md-12 text-end">
                <button className="btn btn-primary" type="submit">
                  {editandoId !== null ? (
                    <>
                      <FaEdit className="me-1" />
                      Guardar Cambios
                    </>
                  ) : (
                    <>
                      <FaPlusCircle className="me-1" />
                      Agregar
                    </>
                  )}
                </button>
                {editandoId !== null && (
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => {
                      setNuevo({ dni: "", usuario: "", detalles: "", periodo: "", notaCredito: "" });
                      setEditandoId(null);
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* FILTROS */}
        <div className="card shadow-sm mb-4">
          <div className="card-header fw-bold bg-light">Filtros</div>
          <div className="card-body row">
            <div className="col-md-3">
              <input
                type="text"
                placeholder="Buscar por DNI"
                className="form-control"
                value={filtroDni}
                onChange={(e) => setFiltroDni(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filtroPeriodo}
                onChange={(e) => setFiltroPeriodo(e.target.value)}
              >
                <option value="">Todos los meses</option>
                {meses.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                {estados.map((est) => (
                  <option key={est} value={est}>
                    {est}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
              >
                <option value="">Todos los usuarios</option>
                {usuarios.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* TABLA DE ACTIVIDADES */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>DNI</th>
                <th>Usuario</th>
                <th>Detalles</th>
                <th>Fecha</th>
                <th>Período</th>
                <th>Nota de Crédito</th>
                <th>Observación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {actividadesFiltradas.map((a) => (
                <tr key={a.id}>
                  <td>{a.dni}</td>
                  <td>{a.usuario}</td>
                  <td>{a.detalles}</td>
                  <td>{a.fecha}</td>
                  <td>{a.periodo}</td>
                  <td>{a.notaCredito || "—"}</td>
                  <td>{a.observacion || "—"}</td>
                  <td className="text-center">
                    {getEstadoBadge(a.estado)}
                    <div className="mt-2 d-flex flex-column align-items-center gap-1">
                      {a.estado === "Rechazado" && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setVerObservacion(a)}
                          title="Ver observación"
                        >
                          <FaEye />
                          <span className="ms-1">Ver</span>
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => editarActividad(a)}
                        title="Editar actividad"
                      >
                        <FaEdit />
                        <span className="ms-1">Editar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {actividadesFiltradas.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    No hay actividades que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL DE OBSERVACIÓN */}
        {verObservacion && (
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Observación</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setVerObservacion(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>Observación:</strong> {verObservacion.observacion}</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setVerObservacion(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
