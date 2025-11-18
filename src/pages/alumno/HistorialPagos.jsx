import React, { useState } from 'react';
import jsPDF from 'jspdf';

export default function HistorialPagos() {
  const pagos = [
    {
      id: 1,
      fecha: '2025-09-10',
      periodo: 'Agosto 2025',
      monto: 100000,
      estado: 'Aprobado',
      tipoPago: 'Transferencia bancaria',
      comprobante: '/comprobantes/comprobante1.pdf',
      observacion: 'Pago recibido correctamente',
    },
    {
      id: 2,
      fecha: '2025-08-10',
      periodo: 'Julio 2025',
      monto: 100000,
      estado: 'Rechazado',
      tipoPago: 'Tarjeta de crédito',
      comprobante: '/comprobantes/comprobante2.pdf',
      observacion: 'Comprobante ilegible',
    },
    {
      id: 3,
      fecha: '2025-07-10',
      periodo: 'Junio 2025',
      monto: 100000,
      estado: 'En revisión',
      tipoPago: 'PayPal',
      comprobante: '/comprobantes/comprobante3.pdf',
      observacion: '',
    },
  ];

  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return <span className="badge bg-success">{estado}</span>;
      case 'Rechazado':
        return <span className="badge bg-danger">{estado}</span>;
      case 'En revisión':
        return <span className="badge bg-warning text-dark">{estado}</span>;
      default:
        return <span className="badge bg-secondary">Desconocido</span>;
    }
  };

  // Filtrar pagos según filtros aplicados
  const pagosFiltrados = pagos.filter((p) => {
    return (
      (filtroPeriodo === '' || p.periodo === filtroPeriodo) &&
      (filtroEstado === '' || p.estado === filtroEstado) &&
      (filtroFecha === '' || p.fecha === filtroFecha)
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
    const filas = pagosFiltrados.map(pago => [
      pago.id.toString(),
      pago.fecha,
      pago.periodo,
      `$${pago.monto.toLocaleString()}`,
      pago.estado,
      pago.tipoPago,
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
              {pagosFiltrados.length > 0 ? (
                pagosFiltrados.map((pago) => (
                  <tr key={pago.id}>
                    <td>{pago.id}</td>
                    <td>{pago.fecha}</td>
                    <td>{pago.periodo}</td>
                    <td>${pago.monto.toLocaleString()}</td>
                    <td>{getEstadoBadge(pago.estado)}</td>
                    <td>{pago.tipoPago}</td>
                    <td>{pago.observacion || '—'}</td>
                    <td>
                      {pago.comprobante ? (
                        <div className="d-flex gap-2">
                          <a
                            href={pago.comprobante}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-info"
                          >
                            Ver
                          </a>
                          <a
                            href={pago.comprobante}
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
