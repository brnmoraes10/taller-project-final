import React, { useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Reportes() {
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroDni, setFiltroDni] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const [pagos, setPagos] = useState([
    { dni: '12345678', nombre: 'Juan Pérez', rol: 'Alumno', estado: 'Aprobado', monto: 100000, fecha: '2025-09-10', hora: '10:00', recargo: false, observacion: 'Pago confirmado' },
    { dni: '87654321', nombre: 'Admin1', rol: 'Administrador', estado: 'Rechazado', monto: 100000, fecha: '2025-08-10', hora: '14:15', recargo: false, observacion: 'Monto incorrecto' },
    { dni: '45678912', nombre: 'María Gómez', rol: 'Alumno', estado: 'En revisión', monto: 100000, fecha: '2025-07-10', hora: '09:30', recargo: false, observacion: '' },
  ]);

  const [nuevoPago, setNuevoPago] = useState({
    dni: '',
    nombre: '',
    rol: 'Alumno',
    estado: 'En revisión',
    monto: '',
    fecha: '',
    hora: '',
    recargo: false,
    observacion: ''
  });
  const [editandoDni, setEditandoDni] = useState(null);

  // Referencia para hacer scroll al formulario CRUD al editar
  const crudRef = useRef(null);

  // Diccionario simulado de personas (DNI → Nombre)
  const personas = {
    '12345678': 'Juan Pérez',
    '87654321': 'Admin1',
    '45678912': 'María Gómez',
  };

  // Autocompletar nombre al escribir DNI
  const handleDniChange = (e) => {
    const dni = e.target.value;
    setNuevoPago({
      ...nuevoPago,
      dni,
      nombre: personas[dni] || ''
    });
  };

  // Período automático
  const handlePeriodoChange = (e) => {
    const value = e.target.value;
    setFiltroPeriodo(value);

    const hoy = new Date();
    let inicio = null;
    let fin = null;

    if (value === '7dias') {
      inicio = new Date(hoy);
      inicio.setDate(hoy.getDate() - 7);
      fin = hoy;
    } else if (value === '30dias') {
      inicio = new Date(hoy);
      inicio.setDate(hoy.getDate() - 30);
      fin = hoy;
    } else if (value === 'mes') {
      inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
    } else if (value === 'anio') {
      inicio = new Date(hoy.getFullYear(), 0, 1);
      fin = new Date(hoy.getFullYear(), 11, 31);
    }

    if (inicio && fin) {
      setFechaDesde(inicio.toISOString().slice(0, 10));
      setFechaHasta(fin.toISOString().slice(0, 10));
    } else {
      setFechaDesde('');
      setFechaHasta('');
    }
  };

  // Filtrar pagos según los filtros
  const pagosFiltrados = pagos.filter((p) => {
    const fecha = new Date(p.fecha);
    const desde = fechaDesde ? new Date(fechaDesde) : null;
    const hasta = fechaHasta ? new Date(fechaHasta) : null;

    const cumpleRol = filtroRol ? p.rol === filtroRol : true;
    const cumpleDni = filtroDni ? p.dni.includes(filtroDni) : true;
    const cumpleEstado = filtroEstado ? p.estado === filtroEstado : true;
    const cumpleDesde = desde ? fecha >= desde : true;
    const cumpleHasta = hasta ? fecha <= hasta : true;

    return cumpleRol && cumpleDni && cumpleEstado && cumpleDesde && cumpleHasta;
  });

  // Total recaudado — actualmente suma solo los pagos con estado "Aprobado"
  const totalRecaudado = pagosFiltrados
    .filter(p => p.estado === 'Aprobado')
    .reduce((sum, p) => sum + p.monto, 0);

  // Estados que siempre mostrar en la gráfica
  const estadosPosibles = ['Aprobado', 'Rechazado', 'En revisión'];

  // Contar pagos por estado dentro de los filtrados
  const pagosPorEstado = estadosPosibles.reduce((acc, estado) => {
    acc[estado] = pagosFiltrados.filter(p => p.estado === estado).length;
    return acc;
  }, {});

  const data = {
    labels: estadosPosibles,
    datasets: [
      {
        label: 'Cantidad de Pagos',
        data: estadosPosibles.map(estado => pagosPorEstado[estado]),
        backgroundColor: ['#198754', '#dc3545', '#ffc107'],
      },
    ],
  };

  // Guardar (crear o actualizar)
  const handleGuardar = () => {
    if (editandoDni) {
      setPagos(pagos.map(p => (p.dni === editandoDni ? { ...nuevoPago } : p)));
      setEditandoDni(null);
    } else {
      setPagos([...pagos, { ...nuevoPago }]);
    }
    // Reset del formulario
    setNuevoPago({
      dni: '',
      nombre: '',
      rol: 'Alumno',
      estado: 'En revisión',
      monto: '',
      fecha: '',
      hora: '',
      recargo: false,
      observacion: ''
    });
  };

  const handleEditar = (pago) => {
    setNuevoPago(pago);
    setEditandoDni(pago.dni);

    // Scroll al formulario
    setTimeout(() => {
      crudRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleEliminar = (dni) => {
    setPagos(pagos.filter(p => p.dni !== dni));
  };

  const handleEstado = (dni, estado) => {
    setPagos(pagos.map(p => (p.dni === dni ? { ...p, estado } : p)));
  };

  return (
      <div className="container mt-5">
        <h2 className="text-center mb-4 text-uppercase text-primary fw-bold">
          Reportes
        </h2>

        {/* FORMULARIO CRUD */}
        <div className="card mb-4" ref={crudRef}>
          <div className="card-body">
            <h5>{editandoDni ? 'Editar Pago' : 'Nuevo Pago'}</h5>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">DNI</label>
                <input
                  type="text"
                  className="form-control"
                  value={nuevoPago.dni}
                  onChange={handleDniChange}
                />
              </div>
              <div className="col-md-5">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={nuevoPago.nombre}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Rol</label>
                <select
                  className="form-select"
                  value={nuevoPago.rol}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, rol: e.target.value })}
                >
                  <option value="Alumno">Alumno</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Monto</label>
                <input
                  type="number"
                  className="form-control"
                  value={nuevoPago.monto}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, monto: Number(e.target.value) })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Fecha</label>
                <input
                  type="date"
                  className="form-control"
                  value={nuevoPago.fecha}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, fecha: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Hora</label>
                <input
                  type="time"
                  className="form-control"
                  value={nuevoPago.hora}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, hora: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Recargo</label>
                <select
                  className="form-select"
                  value={nuevoPago.recargo ? 'Sí' : 'No'}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, recargo: e.target.value === 'Sí' })}
                >
                  <option value="No">No</option>
                  <option value="Sí">Sí</option>
                </select>
              </div>
              <div className="col-md-12">
                <label className="form-label">Observación</label>
                <textarea
                  className="form-control"
                  value={nuevoPago.observacion}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, observacion: e.target.value })}
                />
              </div>
            </div>
            <button className="btn btn-success mt-3" onClick={handleGuardar}>
              {editandoDni ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </div>

        {/* FILTROS */}
        <div className="card mb-4">
          <div className="card-body">
            <h5>Filtros</h5>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Rol</label>
                <select
                  className="form-select"
                  value={filtroRol}
                  onChange={(e) => setFiltroRol(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Alumno">Alumno</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">DNI</label>
                <input
                  type="text"
                  className="form-control"
                  value={filtroDni}
                  onChange={(e) => setFiltroDni(e.target.value)}
                  placeholder="Buscar por DNI"
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Estado</label>
                <select
                  className="form-select"
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Aprobado">Aprobado</option>
                  <option value="Rechazado">Rechazado</option>
                  <option value="En revisión">En revisión</option>
                </select>
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Período</label>
                <select
                  className="form-select"
                  value={filtroPeriodo}
                  onChange={handlePeriodoChange}
                >
                  <option value="">Todos</option>
                  <option value="7dias">Últimos 7 días</option>
                  <option value="30dias">Últimos 30 días</option>
                  <option value="mes">Este mes</option>
                  <option value="anio">Este año</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* TOTAL */}
        <div className="card mb-4">
          <div className="card-body">
            <h5>Total Recaudado:</h5>
            <p className="fs-4">${totalRecaudado.toLocaleString()}</p>
          </div>
        </div>

        {/* GRÁFICO */}
        <div className="card mb-4">
          <div className="card-body">
            <h5>Pagos por Estado</h5>
            <Bar data={data} />
          </div>
        </div>

        {/* TABLA */}
        <div className="card mb-5">
          <div className="card-body">
            <h5 className="mb-3">Detalle de Pagos</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>DNI</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Recargo</th>
                    <th>Observación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pagosFiltrados.map((p) => (
                    <tr key={p.dni}>
                      <td>{p.dni}</td>
                      <td>{p.nombre}</td>
                      <td>{p.rol}</td>
                      <td>{p.fecha}</td>
                      <td>{p.hora}</td>
                      <td>${p.monto.toLocaleString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            p.estado === 'Aprobado'
                              ? 'bg-success'
                              : p.estado === 'Rechazado'
                              ? 'bg-danger'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          {p.estado}
                        </span>
                      </td>
                      <td>{p.recargo ? 'Sí' : 'No'}</td>
                      <td>{p.observacion || '-'}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEditar(p)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-danger me-2"
                          onClick={() => handleEliminar(p.dni)}
                        >
                          Eliminar
                        </button>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleEstado(p.dni, 'Aprobado')}
                        >
                          Aprobar
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleEstado(p.dni, 'Rechazado')}
                        >
                          Rechazar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pagosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan="10" className="text-center">
                        No se encontraron pagos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
}
