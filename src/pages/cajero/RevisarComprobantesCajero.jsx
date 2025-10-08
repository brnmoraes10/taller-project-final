import React, { useState } from "react";
import CajeroLayout from "../../layouts/CajeroLayout";

// Íconos administrativos
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

export default function CrudGenerico() {
  const [registros, setRegistros] = useState([
    {
      id: 1,
      dni: "12345678",
      alumno: "Juan Pérez",
      fecha: "2025-09-25",
      periodo: "Agosto 2025",
      monto: 20000,
      estado: "En revisión",
      observacion: "Esperando validación",
      carrera: "Analista de sistemas",  // <-- agregado
    },
    {
      id: 2,
      dni: "87654321",
      alumno: "María Gómez",
      fecha: "2025-08-15",
      periodo: "Julio 2025",
      monto: 18000,
      estado: "Pagado",
      observacion: "Pago confirmado",
      carrera: "Ingeniería en Sistemas", // <-- agregado
    },
  ]);

  const [form, setForm] = useState({
    id: null,
    dni: "",
    alumno: "",
    fecha: "",
    periodo: "",
    monto: "",
    estado: "En revisión",
    observacion: "",
    carrera: "",  // <-- agregado
  });

  const [editando, setEditando] = useState(false);
  const [filtroDni, setFiltroDni] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const guardar = () => {
    if (editando) {
      setRegistros(registros.map((r) => (r.id === form.id ? form : r)));
      setEditando(false);
    } else {
      setRegistros([...registros, { ...form, id: Date.now() }]);
    }
    limpiarForm();
  };

  const editar = (reg) => {
    setForm(reg);
    setEditando(true);
  };

  const eliminar = (id) => {
    const registro = registros.find((r) => r.id === id);

    if (!registro) return;

    if (window.confirm("¿Seguro que deseas eliminar este registro?")) {
      let motivo = "";

      if (registro.estado === "Pagado" || registro.estado === "En revisión") {
        motivo = window.prompt(
          "Por favor, ingresa el motivo para la nota de crédito:",
          ""
        );

        if (motivo === null || motivo.trim() === "") {
          alert("Debe ingresar un motivo para generar la nota de crédito.");
          return; // Cancelar eliminación si no se ingresa motivo válido
        }

        const notaCredito = {
          id: Date.now(),
          alumno: registro.alumno,
          dni: registro.dni,
          monto: registro.monto,
          periodo: registro.periodo,
          fecha: new Date().toISOString().slice(0, 10),
          motivo: motivo.trim(),
        };

        alert(
          `📄 Nota de Crédito Generada:\n\n` +
            `Alumno: ${notaCredito.alumno}\n` +
            `DNI: ${notaCredito.dni}\n` +
            `Monto: $${notaCredito.monto}\n` +
            `Período: ${notaCredito.periodo}\n` +
            `Fecha: ${notaCredito.fecha}\n` +
            `Motivo: ${notaCredito.motivo}`
        );
      }

      // Eliminar el registro
      setRegistros(registros.filter((r) => r.id !== id));
    }
  };

  const limpiarForm = () => {
    setForm({
      id: null,
      dni: "",
      alumno: "",
      fecha: "",
      periodo: "",
      monto: "",
      estado: "En revisión",
      observacion: "",
      carrera: "",  // <-- agregado
    });
  };

  const meses = [
    "Enero 2025",
    "Febrero 2025",
    "Marzo 2025",
    "Abril 2025",
    "Mayo 2025",
    "Junio 2025",
    "Julio 2025",
    "Agosto 2025",
    "Septiembre 2025",
    "Octubre 2025",
    "Noviembre 2025",
    "Diciembre 2025",
  ];

  const estados = ["En revisión", "Aprobado", "Rechazado", "Pagado"];

  const registrosFiltrados = registros.filter((r) => {
    return (
      (filtroDni ? r.dni.includes(filtroDni) : true) &&
      (filtroPeriodo ? r.periodo === filtroPeriodo : true) &&
      (filtroEstado ? r.estado === filtroEstado : true)
    );
  });

  // Función para botón "Ver"
  const verComprobante = (registro) => {
    alert(
      `Ver comprobante para:\n\n` +
        `Alumno: ${registro.alumno}\n` +
        `DNI: ${registro.dni}\n` +
        `Período: ${registro.periodo}\n` +
        `Monto: $${registro.monto}\n` +
        `Carrera: ${registro.carrera || "—"}`
    );
  };

  return (
    <CajeroLayout>
      <div className="container mt-4">
        <h2 className="text-center mb-4 text-uppercase fw-bold text-primary">
          Gestión de Comprobantes
        </h2>

        {/* FORMULARIO */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              {editando ? "Editar Registro" : "Nuevo Registro"}
            </h5>
            <div className="row">
              <div className="col-md-3">
                <label className="form-label">DNI</label>
                <input
                  type="text"
                  placeholder="DNI"
                  className="form-control mb-2"
                  value={form.dni}
                  onChange={(e) => setForm({ ...form, dni: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Alumno</label>
                <input
                  type="text"
                  placeholder="Alumno"
                  className="form-control mb-2"
                  value={form.alumno}
                  onChange={(e) => setForm({ ...form, alumno: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Fecha</label>
                <input
                  type="date"
                  className="form-control mb-2"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Período</label>
                <select
                  className="form-select mb-2"
                  value={form.periodo}
                  onChange={(e) => setForm({ ...form, periodo: e.target.value })}
                >
                  <option value="">Seleccionar período</option>
                  {meses.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Monto</label>
                <input
                  type="number"
                  placeholder="Monto"
                  className="form-control mb-2"
                  value={form.monto}
                  onChange={(e) => setForm({ ...form, monto: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Estado</label>
                <select
                  className="form-select mb-2"
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                >
                  {estados.map((est) => (
                    <option key={est} value={est}>
                      {est}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Observación</label>
                <input
                  type="text"
                  placeholder="Observación"
                  className="form-control mb-2"
                  value={form.observacion}
                  onChange={(e) =>
                    setForm({ ...form, observacion: e.target.value })
                  }
                />
              </div>

              {/* NUEVO CAMPO CARRERA */}
              <div className="col-md-6">
                <label className="form-label">Carrera</label>
                <input
                  type="text"
                  placeholder="Carrera"
                  className="form-control mb-2"
                  value={form.carrera}
                  onChange={(e) => setForm({ ...form, carrera: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-3">
              <button className="btn btn-success me-2" onClick={guardar}>
                <FaSave className="me-1" />
                {editando ? "Actualizar" : "Guardar"}
              </button>
              {editando && (
                <button className="btn btn-secondary" onClick={limpiarForm}>
                  <FaTimes className="me-1" />
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="card shadow-sm mb-4">
          <div className="card-body row">
            <div className="col-md-3">
              <label className="form-label">Filtrar por DNI</label>
              <input
                type="text"
                placeholder="Buscar DNI"
                className="form-control"
                value={filtroDni}
                onChange={(e) => setFiltroDni(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Filtrar por Período</label>
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
              <label className="form-label">Filtrar por Estado</label>
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
          </div>
        </div>

        {/* TABLA */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark text-center">
              <tr>
                <th>ID</th>
                <th>DNI</th>
                <th>Alumno</th>
                <th>Fecha</th>
                <th>Período</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Observación</th>
                <th>Carrera</th> {/* <-- Nueva columna */}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.map((r) => (
                <tr key={r.id}>
                  <td className="text-center">{r.id}</td>
                  <td>{r.dni}</td>
                  <td>{r.alumno}</td>
                  <td>{r.fecha}</td>
                  <td>{r.periodo}</td>
                  <td>${r.monto}</td>
                  <td>
                    <span
                      className={`badge px-3 py-2 text-uppercase ${
                        r.estado === "Aprobado"
                          ? "bg-success"
                          : r.estado === "Pagado"
                          ? "bg-primary"
                          : r.estado === "Rechazado"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {r.estado}
                    </span>
                  </td>
                  <td>{r.observacion || "—"}</td>
                  <td>{r.carrera || "—"}</td> {/* <-- Nueva celda */}
                  <td className="text-center">
                    <button
                      className="btn btn-outline-info btn-sm me-2"
                      onClick={() => verComprobante(r)}
                      title="Ver comprobante"
                    >
                      Ver
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => editar(r)}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => eliminar(r.id)}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {registrosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="10" className="text-center text-muted">
                    No hay registros que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CajeroLayout>
  );
}
