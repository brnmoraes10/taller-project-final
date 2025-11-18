import React, { useState } from "react";
import { FaEye, FaPlusCircle, FaCreditCard, FaBan, FaEdit } from "react-icons/fa";
import Hero from "../../components/Hero";
import logo from '../../image/instituto.png'

const alumnosDummy = [
  { id: 1, nombre: "Juan Pérez", dni: "12345678" },
  { id: 2, nombre: "María Gómez", dni: "87654321" },
  { id: 3, nombre: "Luis Fernández", dni: "23456789" },
];

const periodosDummy = ["2025-1", "2025-2", "2026-1"];
const cuotasDummy = [
  { id: 1, descripcion: "Cuota 1", importe: 1000 },
  { id: 2, descripcion: "Cuota 2", importe: 1200 },
  { id: 3, descripcion: "Cuota 3", importe: 1100 },
];

const carrerasDummy = ["Analista de Sistemas", "Psicopedagogía", "Ingles", "Maestra de Inclucion"];
const pasarelasDisponibles = ["MercadoPago", "PayPal", "Stripe"];

export default function RegistroPagos() {
  const [pagos, setPagos] = useState([
    {
      id: 1,
      dni: "12345678",
      alumno: "Juan Pérez",
      usuario: "Admin1",
      monto: 1500.0,
      estado: "Completado",
      fecha: "2025-09-20 10:15",
      observacion: "",
      metodoPago: "Tarjeta",
      comprobanteUrl: "", // almacena url / nombre archivo
      periodo: "2025-1",
      cuota: "Cuota 1",
      carrera: "Analista de Sistemas",
      cupón: "CP0001",
      pasarela: "MercadoPago",
      anulado: false,
      notaCredito: null,
    },
    {
      id: 2,
      dni: "87654321",
      alumno: "María Gómez",
      usuario: "Cajero2",
      monto: 500.5,
      estado: "Pendiente",
      fecha: "2025-09-19 16:50",
      observacion: "Pago pendiente de confirmación",
      metodoPago: "Efectivo",
      comprobanteUrl: "",
      periodo: "2025-2",
      cuota: "Cuota 2",
      carrera: "Derecho",
      cupón: "CP0002",
      pasarela: "",
      anulado: false,
      notaCredito: null,
    },
  ]);

  const [filtroDni, setFiltroDni] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");

  const estados = ["Completado", "Pendiente", "Cancelado"];

  const [verDetalle, setVerDetalle] = useState(null);
  const [showPasarelaModal, setShowPasarelaModal] = useState(false);
  const [editandoPago, setEditandoPago] = useState(null);

  const [nuevoPago, setNuevoPago] = useState({
    alumnoId: "",
    dni: "",
    alumnoNombre: "",
    usuario: "Admin1",
    monto: 0,
    estado: "Pendiente",
    metodoPago: "",
    periodo: "",
    cuotaId: "",
    cuotaDesc: "",
    carrera: "",
    pasarelaSeleccionada: "",
    comprobanteFile: null, // archivo seleccionado
    observacion: "",
  });

  // Función para generar número de cupón (simple)
  const generarCupon = () => {
    const next = pagos.length + 1;
    return `CP${String(next).padStart(4, "0")}`;
  };

  const actualizarMontoPorCuota = (cuotaId) => {
    const cuota = cuotasDummy.find((c) => c.id.toString() === cuotaId);
    if (cuota) {
      setNuevoPago((p) => ({
        ...p,
        cuotaId,
        cuotaDesc: cuota.descripcion,
        monto: cuota.importe,
      }));
    } else {
      setNuevoPago((p) => ({
        ...p,
        cuotaId: "",
        cuotaDesc: "",
        monto: 0,
      }));
    }
  };

  const abrirEdicion = (pago) => {
    // Poner el pago en modo edición
    setEditandoPago(pago.id);
    setNuevoPago({
      alumnoId: "", // no necesitamos id si editamos
      dni: pago.dni,
      alumnoNombre: pago.alumno,
      usuario: pago.usuario,
      monto: pago.monto,
      estado: pago.estado,
      metodoPago: pago.metodoPago,
      periodo: pago.periodo,
      cuotaId: "", // no lo usamos directamente
      cuotaDesc: pago.cuota,
      carrera: pago.carrera,
      pasarelaSeleccionada: pago.pasarela || "",
      comprobanteFile: null,
      observacion: pago.observacion,
    });
  };

  const guardarEdicion = (e) => {
    e.preventDefault();
    if (!nuevoPago.dni || !nuevoPago.alumnoNombre) {
      alert("DNI y nombre requeridos");
      return;
    }
    setPagos((prev) =>
      prev.map((p) =>
        p.id === editandoPago
          ? {
              ...p,
              dni: nuevoPago.dni,
              alumno: nuevoPago.alumnoNombre,
              monto: nuevoPago.monto,
              metodoPago: nuevoPago.metodoPago,
              periodo: nuevoPago.periodo,
              cuota: nuevoPago.cuotaDesc,
              carrera: nuevoPago.carrera,
              pasarela: nuevoPago.pasarelaSeleccionada,
              observacion: nuevoPago.observacion,
              // si subió comprobante nuevo, podrías actualizar comprobanteUrl
            }
          : p
      )
    );
    setEditandoPago(null);
    resetNuevoPago();
  };

  const agregarPago = (e) => {
    e.preventDefault();

    if (
      !nuevoPago.dni ||
      !nuevoPago.alumnoNombre ||
      !nuevoPago.usuario ||
      !nuevoPago.monto ||
      !nuevoPago.metodoPago ||
      !nuevoPago.periodo ||
      !nuevoPago.cuotaDesc ||
      !nuevoPago.carrera
    ) {
      alert("Completa todos los campos obligatorios ❗");
      return;
    }

    const nuevo = {
      id: pagos.length + 1,
      dni: nuevoPago.dni,
      alumno: nuevoPago.alumnoNombre,
      usuario: nuevoPago.usuario,
      monto: parseFloat(nuevoPago.monto),
      estado: "Completado",
      fecha: new Date().toISOString().slice(0, 16).replace("T", " "),
      observacion: nuevoPago.observacion || "",
      metodoPago: nuevoPago.metodoPago,
      comprobanteUrl: nuevoPago.comprobanteFile
        ? nuevoPago.comprobanteFile.name
        : "",
      periodo: nuevoPago.periodo,
      cuota: nuevoPago.cuotaDesc,
      carrera: nuevoPago.carrera,
      cupón: generarCupon(),
      pasarela: nuevoPago.pasarelaSeleccionada,
      anulado: false,
      notaCredito: null,
    };

    setPagos([...pagos, nuevo]);
    resetNuevoPago();
    alert("Pago registrado exitosamente ✅");
  };

  const resetNuevoPago = () => {
    setNuevoPago({
      alumnoId: "",
      dni: "",
      alumnoNombre: "",
      usuario: "Admin1",
      monto: 0,
      estado: "Pendiente",
      metodoPago: "",
      periodo: "",
      cuotaId: "",
      cuotaDesc: "",
      carrera: "",
      pasarelaSeleccionada: "",
      comprobanteFile: null,
      observacion: "",
    });
    setEditandoPago(null);
  };

  // Abrir modal de elección de pasarela
  const abrirModalPasarela = () => {
    setShowPasarelaModal(true);
  };

  const elegirPasarela = (pasarela) => {
    setNuevoPago((p) => ({ ...p, pasarelaSeleccionada: pasarela }));
    setShowPasarelaModal(false);
  };

  const anularPago = (pago) => {
    const motivo = prompt(`Ingrese motivo de la nota de crédito para anular el pago #${pago.id}:`);
    if (!motivo) {
      alert("Anulación cancelada. Motivo es obligatorio.");
      return;
    }
    setPagos(
      pagos.map((p) =>
        p.id === pago.id
          ? {
              ...p,
              estado: "Cancelado",
              anulado: true,
              notaCredito: {
                fecha: new Date().toISOString().slice(0, 10),
                motivo,
              },
              observacion: (p.observacion ? p.observacion + " | " : "") + `Anulado: ${motivo}`,
            }
          : p
      )
    );
    alert("Pago anulado y nota de crédito generada ✅");
  };

  const getEstadoBadge = (estado, anulado) => {
    if (anulado)
      return (
        <span className="badge bg-danger px-3 py-2" title="Pago anulado con nota de crédito">
          Anulado
        </span>
      );
    switch (estado) {
      case "Completado":
        return <span className="badge bg-success px-3 py-2">{estado}</span>;
      case "Pendiente":
        return <span className="badge bg-warning text-dark px-3 py-2">{estado}</span>;
      case "Cancelado":
        return <span className="badge bg-danger px-3 py-2">{estado}</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2">{estado}</span>;
    }
  };

  const pagosFiltrados = pagos.filter((p) => {
    return (
      (filtroDni ? p.dni.includes(filtroDni) : true) &&
      (filtroEstado ? p.estado === filtroEstado : true) &&
      (filtroUsuario ? p.usuario === filtroUsuario : true)
    );
  });

  const usuarios = [...new Set(pagos.map((p) => p.usuario))];

  return (
      <div className="container mt-4">
            <Hero
              image={logo}
              imageAlt="Registro de Pago"
              title="Registro de Pago"
              subtitle="Registra Pago y controla las actividades registradas fácilmente"
            />

        {/* FORMULARIO DE NUEVO / EDICIÓN */}
        <div className="card shadow-sm mb-4">
          <div className="card-header fw-bold bg-light">
            <FaPlusCircle className="me-2 text-primary" />
            {editandoPago ? "Editar Pago" : "Nuevo Pago Manual"}
          </div>
          <div className="card-body">
            <form
              className="row g-3"
              onSubmit={editandoPago ? guardarEdicion : agregarPago}
            >
              <div className="col-md-3">
                <label className="form-label">DNI del Alumno *</label>
                <input
                  type="text"
                  className="form-control"
                  value={nuevoPago.dni}
                  onChange={(e) => {
                    const dni = e.target.value;
                    const alumno = alumnosDummy.find((a) => a.dni === dni);
                    if (alumno) {
                      setNuevoPago((p) => ({
                        ...p,
                        dni,
                        alumnoId: alumno.id,
                        alumnoNombre: alumno.nombre,
                      }));
                    } else {
                      setNuevoPago((p) => ({
                        ...p,
                        dni,
                        alumnoId: "",
                        alumnoNombre: "",
                      }));
                    }
                  }}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Nombre del Alumno</label>
                <input
                  type="text"
                  className="form-control"
                  value={nuevoPago.alumnoNombre}
                  readOnly
                  placeholder="Nombre aparecerá aquí"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Carrera *</label>
                <select
                  className="form-select"
                  value={nuevoPago.carrera}
                  onChange={(e) =>
                    setNuevoPago((p) => ({ ...p, carrera: e.target.value }))
                  }
                  required
                >
                  <option value="">Selecciona carrera</option>
                  {carrerasDummy.map((c, idx) => (
                    <option key={idx} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Periodo *</label>
                <select
                  className="form-select"
                  value={nuevoPago.periodo}
                  onChange={(e) =>
                    setNuevoPago((p) => ({ ...p, periodo: e.target.value }))
                  }
                  required
                >
                  <option value="">Selecciona periodo</option>
                  {periodosDummy.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Cuota *</label>
                <select
                  className="form-select"
                  value={nuevoPago.cuotaId}
                  onChange={(e) => actualizarMontoPorCuota(e.target.value)}
                  required
                >
                  <option value="">Selecciona cuota</option>
                  {cuotasDummy.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.descripcion} - ${c.importe}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">Monto *</label>
                <input
                  type="number"
                  className="form-control"
                  value={nuevoPago.monto}
                  onChange={(e) =>
                    setNuevoPago((p) => ({
                      ...p,
                      monto: parseFloat(e.target.value),
                    }))
                  }
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Método de Pago *</label>
                <select
                  className="form-select"
                  value={nuevoPago.metodoPago}
                  onChange={(e) =>
                    setNuevoPago((p) => ({ ...p, metodoPago: e.target.value }))
                  }
                  required
                >
                  <option value="">Selecciona método</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Comprobante (PDF / imagen)</label>
                <input
                  type="file"
                  accept="application/pdf, image/*"
                  className="form-control"
                  onChange={(e) =>
                    setNuevoPago((p) => ({
                      ...p,
                      comprobanteFile: e.target.files[0] || null,
                    }))
                  }
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Observación</label>
                <textarea
                  className="form-control"
                  value={nuevoPago.observacion}
                  onChange={(e) =>
                    setNuevoPago((p) => ({ ...p, observacion: e.target.value }))
                  }
                />
              </div>

              <div className="col-12 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={abrirModalPasarela}
                  disabled={
                    !nuevoPago.dni ||
                    !nuevoPago.alumnoNombre ||
                    !nuevoPago.periodo ||
                    !nuevoPago.cuotaId ||
                    !nuevoPago.metodoPago ||
                    nuevoPago.monto <= 0 ||
                    !nuevoPago.carrera
                  }
                >
                  <FaCreditCard className="me-1" />
                  Seleccionar Pasarela
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    !nuevoPago.dni ||
                    !nuevoPago.alumnoNombre ||
                    !nuevoPago.periodo ||
                    !nuevoPago.cuotaId ||
                    !nuevoPago.metodoPago ||
                    nuevoPago.monto <= 0 ||
                    !nuevoPago.carrera
                  }
                >
                  {editandoPago ? "Guardar Edición" : "Registrar Pago"}
                </button>
                {editandoPago && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      resetNuevoPago();
                      setEditandoPago(null);
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
            <div className="col-md-4">
              <input
                type="text"
                placeholder="Buscar por DNI"
                className="form-control"
                value={filtroDni}
                onChange={(e) => setFiltroDni(e.target.value)}
              />
            </div>
            <div className="col-md-4">
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
            <div className="col-md-4">
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

        {/* TABLA DE PAGOS */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>DNI</th>
                <th>Alumno</th>
                <th>Carrera</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Periodo</th>
                <th>Cuota</th>
                <th>Cupón</th>
                <th>Pasarela</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.length > 0 ? (
                pagosFiltrados.map((p) => (
                  <tr key={p.id} className={p.anulado ? "table-danger" : ""}>
                    <td>{p.dni}</td>
                    <td>{p.alumno}</td>
                    <td>{p.carrera}</td>
                    <td className="text-end">${p.monto.toFixed(2)}</td>
                    <td>{p.metodoPago}</td>
                    <td>{p.periodo}</td>
                    <td>{p.cuota}</td>
                    <td>{p.cupón}</td>
                    <td>{p.pasarela || "—"}</td>
                    <td>{getEstadoBadge(p.estado, p.anulado)}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => setVerDetalle(p)}
                        >
                          <FaEye />
                        </button>
                        {!p.anulado && p.estado === "Pendiente" && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() =>
                              setPagos((prev) =>
                                prev.map((item) =>
                                  item.id === p.id
                                    ? { ...item, estado: "Completado" }
                                    : item
                                )
                              )
                            }
                          >
                            Aprobar
                          </button>
                        )}
                        {!p.anulado && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => anularPago(p)}
                          >
                            <FaBan />
                          </button>
                        )}
                        {!p.anulado && (
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => abrirEdicion(p)}
                          >
                            <FaEdit />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center text-muted">
                    No hay pagos que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL DETALLE */}
        {verDetalle && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detalle del Pago #{verDetalle.id}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setVerDetalle(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p><strong>DNI:</strong> {verDetalle.dni}</p>
                  <p><strong>Alumno:</strong> {verDetalle.alumno}</p>
                  <p><strong>Carrera:</strong> {verDetalle.carrera}</p>
                  <p><strong>Monto:</strong> ${verDetalle.monto.toFixed(2)}</p>
                  <p><strong>Método de Pago:</strong> {verDetalle.metodoPago}</p>
                  <p><strong>Periodo:</strong> {verDetalle.periodo}</p>
                  <p><strong>Cuota:</strong> {verDetalle.cuota}</p>
                  <p><strong>Nº Cupón:</strong> {verDetalle.cupón}</p>
                  <p><strong>Pasarela:</strong> {verDetalle.pasarela || "—"}</p>
                  <p><strong>Fecha:</strong> {verDetalle.fecha}</p>
                  <p><strong>Comprobante:</strong> {verDetalle.comprobanteUrl || "—"}</p>
                  <p><strong>Observación:</strong> {verDetalle.observacion || "—"}</p>
                  <p><strong>Estado:</strong> {getEstadoBadge(verDetalle.estado, verDetalle.anulado)}</p>
                  {verDetalle.anulado && verDetalle.notaCredito && (
                    <div className="alert alert-danger">
                      <strong>Nota de crédito:</strong> <br />
                      Fecha: {verDetalle.notaCredito.fecha} <br />
                      Motivo: {verDetalle.notaCredito.motivo}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setVerDetalle(null)}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PARA ELEGIR PASARELA */}
        {showPasarelaModal && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Seleccionar Pasarela de Pago</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPasarelaModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {pasarelasDisponibles.map((p, idx) => (
                    <button
                      key={idx}
                      className="btn btn-outline-primary w-100 mb-2"
                      onClick={() => elegirPasarela(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowPasarelaModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
