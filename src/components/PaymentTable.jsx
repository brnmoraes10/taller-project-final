import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PaymentTable() {
  const navigate = useNavigate();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroPeriodo, setFiltroPeriodo] = useState('Todos');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://localhost:8000/pagos/?id_alumno=1', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPagos(res.data);
      } catch (err) {
        setError('Error al cargar los pagos');
      } finally {
        setLoading(false);
      }
    };
    fetchPagos();
  }, []);

  // Adaptar campos
  const cuotasFiltradas = pagos.map((c, index) => ({
    periodo: c.fecha,
    importe: Number(c.monto || 0),
    vencimiento: c.fecha_ven,
    estado: c.estado_pago.nombre_estado,
    estado_pago_id: c.estado_pago.id,
    ...c
  })).sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
 .filter((c) => {
    if (filtroEstado !== 'Todos' && c.estado !== filtroEstado) return false;
    if (filtroPeriodo !== 'Todos' && c.periodo !== filtroPeriodo) return false;
    if (fechaDesde && new Date(c.vencimiento) < new Date(fechaDesde)) return false;
    if (fechaHasta && new Date(c.vencimiento) > new Date(fechaHasta)) return false;
    return true;
  });

  if (loading) return <p>Cargando pagos...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  const periodosUnicos = ['Todos', ...new Set(pagos.map(p => p.fecha))];

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
            <option value="Pagado">Pagado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>

        <div>
          <label className="form-label">Período</label>
          <select
            className="form-select"
            value={filtroPeriodo}
            onChange={(e) => setFiltroPeriodo(e.target.value)}
          >
            {periodosUnicos.map((p) => (
              <option key={p} value={p}>{p}</option>
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
            <th>Periodo</th>
            <th>Importe</th>
            <th>Vencimiento</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuotasFiltradas.length > 0 ? (
            cuotasFiltradas.map((c) => (
              <tr key={c.id}>
                <td>{c.fecha}</td>
                <td>${c.importe.toLocaleString("es-ES")}</td>
                <td>{c.vencimiento}</td>
                <td>
                  <span
                    className={`badge bg-${c.estado_pago.color} 

                    `}
                  >
                    {c.estado}
                  </span>
                </td>
                <td>
                  {!c.aprobado ? (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate('/alumno/subir-comprobante')}
                      disabled={c.estado_pago_id === 4}
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
