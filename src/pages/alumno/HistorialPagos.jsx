import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';

export default function HistorialPagos() {
  const [comprobantes, setComprobantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchComprobante();
  }, []);

  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  const getEstadoBadge = (estado) => {
    return <span className={`badge bg-${estado.color}`}>{estado.nombre_estado}</span>;
  };

  // Filtrar pagos según filtros aplicados
  const comprobanteFiltrados = comprobantes.filter((c) => {
    return (
      (filtroPeriodo === '' || c.periodo === filtroPeriodo) &&
      (filtroEstado === '' || c.estado === filtroEstado) &&
      (filtroFecha === '' || c.fecha_emision === filtroFecha)
    );
  });

  // Generar PDF solo de lo filtrado
  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Historial de Pagos (Filtrado)', 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);

    const columnas = ["#", "Fecha", "Período", "Monto", "Estado", "Tipo de Pago"];
    const filas = comprobanteFiltrados.map(c => [
      c.id.toString(),
      c.fecha,
      c.periodo,
      `$${c.monto.toLocaleString()}`,
      c.estado,
      c.tipoPago,
    ]);

    let startY = 30;

    // Encabezados
    columnas.forEach((col, index) => {
      doc.text(col, 14 + index * 30, startY);
    });

    startY += 10;

    // Filas
    filas.forEach(row => {
      row.forEach((text, i) => {
        doc.text(text, 14 + i * 30, startY);
      });
      startY += 10;
    });

    doc.save('historial-pagos-filtrado.pdf');
  };

  if (error) return <p className="text-danger">{error}</p>;

  const formatearPeriodo = (fechaString) => {
  const fecha = new Date(`${fechaString}T00:00:00`);

  return fecha.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric"
  });
  };

  return (
      <div className="container mt-5">
        <h2 className="text-center mb-4">Historial de Pagos</h2>

        {/* FILTROS */}
        <div className="row mb-4">
          <div className="col-md-4">
            <label className="form-label">Período</label>
            <select
              className="form-select"
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
            >
              <option value="">Todos</option>
                  <option value="Enero 2025">Enero 2025</option>
                  <option value="Febrero 2025">Febrero 2025</option>
                  <option value="Marzo 2025">Marzo 2025</option>
                  <option value="Abril 2025">Abril 2025</option>
                  <option value="Mayo 2025">Mayo 2025</option>
                  <option value="Junio 2025">Junio 2025</option>
                  <option value="Julio 2025">Julio 2025</option>
                  <option value="Agosto 2025">Agosto 2025</option>
                  <option value="Septiembre 2025">Septiembre 2025</option>
                  <option value="Octubre 2025">Octubre 2025</option>
                  <option value="Noviembre 2025">Noviembre 2025</option>
                  <option value="Diciembre 2025">Diciembre 2025</option>
            </select>
          </div>
          <div className="col-md-4">
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
          <div className="col-md-4">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Fecha de Envío</th>
                <th>Período</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Tipo de Pago</th>
                <th>Observaciones</th>
                <th>Comprobante</th>
              </tr>
            </thead>
            <tbody>
              {comprobantes.length > 0 ? (
                comprobantes.map((c) => (
                  <tr key={c.id_comprobante}>
                    <td>{c.id_comprobante}</td>
                    <td>{c.fecha_emision}</td>
                    <td>{formatearPeriodo(c.pago.fecha)}</td>
                    <td>${c.importe.toLocaleString()}</td>
                    <td>{getEstadoBadge(c.estadopago)}</td>
                    <td>{c.tipopago.tipopago}</td>
                    <td>{c.observacion || '—'}</td>
                    <td>
                      {c.urlarchivo ? (
                        <div className="d-flex gap-2">
                          <a
                            href={c.urlarchivo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-info"
                          >
                            Ver
                          </a>
                          <a
                            href={c.urlarchivo}
                            download
                            className="btn btn-sm btn-secondary"
                          >
                            Descargar
                          </a>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No hay pagos que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button className="btn btn-primary mb-3" onClick={generarPDF}>
          Descargar PDF (Filtrado)
        </button>

      </div>
  );
}
