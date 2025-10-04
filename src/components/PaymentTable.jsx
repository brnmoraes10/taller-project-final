import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importar useNavigate

const cuotas = [
  { nro: 3, periodo: 'Mayo 2025', importe: 100000, vencimiento: '2025-05-10', estado: 'Vencida' },
  { nro: 4, periodo: 'Junio 2025', importe: 100000, vencimiento: '2025-06-10', estado: 'Vencida' },
  { nro: 5, periodo: 'Julio 2025', importe: 100000, vencimiento: '2025-07-10', estado: 'Vencida' },
  { nro: 6, periodo: 'Agosto 2025', importe: 100000, vencimiento: '2025-08-10', estado: 'Vencida' },
  { nro: 7, periodo: 'Septiembre 2025', importe: 100000, vencimiento: '2025-09-10', estado: 'Pendiente' },
  { nro: 8, periodo: 'Octubre 2025', importe: 100000, vencimiento: '2025-10-10', estado: 'Pagado' },
];

export default function PaymentTable() {
  const navigate = useNavigate();  // Instanciar navigate

  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroPeriodo, setFiltroPeriodo] = useState('Todos');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const meses = [
    'Todos',
    'Enero 2025', 'Febrero 2025', 'Marzo 2025', 'Abril 2025', 'Mayo 2025',
    'Junio 2025', 'Julio 2025', 'Agosto 2025', 'Septiembre 2025', 'Octubre 2025',
    'Noviembre 2025', 'Diciembre 2025',
  ];

  const cuotasFiltradas = cuotas.filter((c) => {
    if (filtroEstado !== 'Todos' && c.estado !== filtroEstado) {
      return false;
    }
    if (filtroPeriodo !== 'Todos' && c.periodo !== filtroPeriodo) {
      return false;
    }
    if (fechaDesde && new Date(c.vencimiento) < new Date(fechaDesde)) {
      return false;
    }
    if (fechaHasta && new Date(c.vencimiento) > new Date(fechaHasta)) {
      return false;
    }
    return true;
  });

  return (
    <div>
      {/* Filtros */}
      <div className="mb-3 d-flex flex-wrap gap-3 align-items-end">
        <div>
          <label className="form-label">Estado</label>
          <select
            className="form-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Vencida">Vencida</option>
            <option value="Pagado">Pagado</option>
          </select>
        </div>

        <div>
          <label className="form-label">Período</label>
          <select
            className="form-select"
            value={filtroPeriodo}
            onChange={(e) => setFiltroPeriodo(e.target.value)}
          >
            {meses.map((mes) => (
              <option key={mes} value={mes}>{mes}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Vencimiento desde</label>
          <input
            type="date"
            className="form-control"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label">Vencimiento hasta</label>
          <input
            type="date"
            className="form-control"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Nro</th>
            <th>Periodo</th>
            <th>Importe</th>
            <th>Vencimiento</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuotasFiltradas.length > 0 ? (
            cuotasFiltradas.map((cuota) => (
              <tr key={cuota.nro}>
                <td>{cuota.nro}</td>
                <td>{cuota.periodo}</td>
                <td>${cuota.importe.toLocaleString()}</td>
                <td>{cuota.vencimiento}</td>
                <td>
                  <span
                    className={`badge ${
                      cuota.estado === 'Vencida'
                        ? 'bg-danger'
                        : cuota.estado === 'Pendiente'
                        ? 'bg-warning text-dark'
                        : 'bg-success'
                    }`}
                  >
                    {cuota.estado}
                  </span>
                </td>
                <td>
                  {cuota.estado === 'Pendiente' || cuota.estado === 'Vencida' ? (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate('/subir-comprobante')}
                    >
                      💳 Pagar
                    </button>
                  ) : (
                    <span className="text-success">✔️ Pagado</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No hay cuotas que coincidan con los filtros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
