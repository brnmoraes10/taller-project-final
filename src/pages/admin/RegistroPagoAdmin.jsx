import React, { useState, useEffect } from "react";
import { FaEye, FaPlusCircle, FaCreditCard, FaBan, FaEdit } from "react-icons/fa";
import axios from "axios";


const periodosDummy = ["2025-10-01", "2025-11-01","2025-12-01",];
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

  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tiposPagos, setTiposPagos] = useState([]); 
  const [alumnos, setAlumnos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [observacion, setObservacion] = useState("");
  const [comprobanteSeleccionado, setComprobanteSeleccionado] = useState(null);


  const fetchComprobante = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get(`http://localhost:8000/comprobantes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComprobantes(res.data);
        console.log(res.data);
      } catch (err) {
        setError('Error al cargar el comprobante');
      } finally {
        setLoading(false);
      }
    };

      const fetchAlumnos = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get(`http://localhost:8000/alumnos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAlumnos(res.data);
        console.log(res.data);
      } catch (err) {
        setError('Error al cargar alumnos');
      } finally {
        setLoading(false);
      }
    };



    const fetchTipoPagos = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://localhost:8000/tipos-pagos/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTiposPagos(res.data);
        console.log(res.data);
      }
      catch (err) {
        setError('Error al cargar los tipos de pago');
      }
    };

    useEffect(() => {
    fetchComprobante();
    fetchTipoPagos();
    fetchAlumnos();
    }, []);

 


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

  const abrirEdicion = (c) => {
    // Poner el pago en modo edición
    setEditandoPago(c.id_comprobante);
    setNuevoPago({
      alumnoId: "", // no necesitamos id si editamos
      dni: c.pago.alumno.DNI,
      alumnoNombre: c.pago.alumno.nombre_alumno + " " + c.pago.alumno.apellido_alumno,
      usuario: c.usuario,
      monto: c.importe,
      estado: c.estado,
      metodoPago: c.tipopago.id,
      periodo: c.pago.fecha,
      cuotaId: "", // no lo usamos directamente
      cuotaDesc: c.cuota,
      carrera: c.pago.alumno.carrera,
      pasarelaSeleccionada: c.pasarela || "",
      comprobanteFile: null,
      observacion: c.observacion,
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

   const getEstadoBadge = (estado) => {
    return <span className={`badge bg-${estado.color}`}>{estado.nombre_estado}</span>;
  };

  const comprobanteFiltrados = comprobantes.filter((c) => {
    return (
      (filtroDni ? c.DNI.includes(filtroDni) : true) &&
      (filtroEstado ? c.estado === filtroEstado : true) &&
      (filtroUsuario ? c.usuario === filtroUsuario : true)
    );
  });

  const usuarios = [...new Set(pagos.map((p) => p.usuario))];

    const handdleGuardarEdicion = async (e) => {
    e.preventDefault();
    if (!editandoPago) return;

    const token = localStorage.getItem("access_token");
    const formData = new FormData();

    // Campos que SÍ existen en tu modelo Comprobante:
    formData.append("importe", nuevoPago.monto);
    formData.append("observacion", nuevoPago.observacion);
    formData.append("pasarela", nuevoPago.pasarelaSeleccionada);

    // FK: tipopago (id_tipo_pago en la BD)
    if (nuevoPago.metodoPago) {
      formData.append("tipopago_id", nuevoPago.metodoPago);
    }

    // Archivo (opcional)
    if (nuevoPago.comprobanteFile) {
      formData.append("urlarchivo", nuevoPago.comprobanteFile);
    }

    try {
      await axios.put(
        `http://localhost:8000/comprobantes-update/${editandoPago}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      await fetchComprobante();
      alert("Comprobante editado correctamente ✔");

      resetNuevoPago();
      setEditandoPago(null);

    } catch (err) {
      console.error(err);
      alert("Error guardando la edición");
    }
  };

  const handdleAprobarPago = async(id_comprobante) => {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append("estadopago_id", 1);
    
    try {
      await axios.put("http://localhost:8000/comprobantes-update/" + id_comprobante + "/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      await fetchComprobante();
      alert("Pago aprobado con éxito");
    
    } catch (err) {
      console.error(err);
      alert("Error enviando comprobante");
    }
    };

    const abrirModalRechazo = (id) => {
    setComprobanteSeleccionado(id);
    setShowModal(true);
    };


    const handdleAnularPago = async () => {
      if (!comprobanteSeleccionado) return;

      const token = localStorage.getItem("access_token");
      const formData = new FormData();

      formData.append("estadopago_id", 3);  // Rechazado
      formData.append("observacion", observacion);

      try {
        await axios.put(
          "http://localhost:8000/comprobantes-update/" + comprobanteSeleccionado + "/",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        await fetchComprobante();
        alert("Pago rechazado");

        // reset
        setShowModal(false);
        setObservacion("");
        setComprobanteSeleccionado(null);

      } catch (err) {
        console.error(err);
        alert("Error enviando comprobante");
      }
    };


  if (error) return <p className="text-danger">{error}</p>;

  return (
      <div className="container mt-5">
        <h2 className="text-center mb-4 text-uppercase text-primary fw-bold">
          Registro de Pagos
        </h2>

        {/* FORMULARIO DE NUEVO / EDICIÓN */}
        <div className="card shadow-sm mb-4">
          <div className="card-header fw-bold bg-light">
            <FaPlusCircle className="me-2 text-primary" />
            {editandoPago ? "Editar Pago" : "Nuevo Pago Manual"}
          </div>
          <div className="card-body">
            <form
              className="row g-3"
              onSubmit={editandoPago ? handdleGuardarEdicion : agregarPago}>

              <div className="col-md-3">
                <label className="form-label">DNI del Alumno *</label>
                <input
                  type="text"
                  className="form-control"
                  value={nuevoPago.dni}
                  onChange={(e) => {
                    const dni = e.target.value;
                    const alumno = alumnos.find((a) => a.DNI == dni);
                    if (alumno) {
                      setNuevoPago((p) => ({
                        ...p,
                        dni,
                        alumnoId: alumno.id,
                        alumnoNombre: alumno.nombre_alumno + " " + alumno.apellido_alumno,
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
                  {tiposPagos.map((tp) => (
                    <option key={tp.id} value={tp.id}>
                      {tp.tipopago}
                    </option>
                  ))}
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
                <th>Cupón</th>
                <th>Pasarela</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comprobantes.length > 0 ? (
                comprobantes.map((c) => (
                  <tr key={c.id}>
                    <td>{c.pago.alumno.DNI}</td>
                    <td>{c.pago.alumno.nombre_alumno} {c.pago.alumno.apellido_alumno}</td>
                    <td>{c.pago.alumno.carrera}</td>
                    <td className="text-end">${c.importe.toFixed(2)}</td>
                    <td>{c.tipopago.tipopago}</td>
                    <td>{c.pago.fecha}</td>
                    <td>{c.cupon}</td>
                    <td>{c.pasarela || "—"}</td>
                    <td>{getEstadoBadge(c.estadopago)}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => setVerDetalle(c)}
                        >
                          <FaEye />
                        </button>
                        {c.estadopago.id === 4 && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handdleAprobarPago(c.id_comprobante)}
                          >
                            Aprobar
                          </button>
                        )}
                        {c.estadopago.id != 3 && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => abrirModalRechazo(c.id_comprobante)}
                          >
                            <FaBan />
                          </button>
                        )}
                        {!c.anulado && (
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => abrirEdicion(c)}
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

          {showModal && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              
              <div className="modal-header">
                <h5 className="modal-title">Rechazar comprobante</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body">
                <label>Motivo del rechazo:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                ></textarea>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>

                <button className="btn btn-danger" onClick={handdleAnularPago}>
                  Rechazar Pago
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      </div> 
  );
}

