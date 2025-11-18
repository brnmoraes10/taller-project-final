import React, { useEffect, useState } from 'react';
import PaymentSummary from '../../components/PaymentSummary';
import PaymentTable from '../../components/PaymentTable';
import AlumnoLayout from '../../layouts/AlumnoLayout';
import axios from 'axios';

export default function EstadoCuenta() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://localhost:8000/pagos/', {
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

  // Resumen dinámico
  const totalDebt = pagos.reduce((sum, p) => sum + p.importe, 0);
  const latePayments = pagos.filter(p => p.estado === 'Vencida').length;

  return (
    <AlumnoLayout>
      <div className="container mt-4">
        <h2 className="text-center mb-4 text-danger">Estado de Cuenta del Alumno</h2>

        {loading ? (
          <div className="text-center">Cargando pagos...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <PaymentSummary totalDebt={totalDebt} latePayments={latePayments} />

            <div className="card mt-4">
              <div className="card-body">
                <h5>Cuotas Pendientes</h5>
                <PaymentTable pagos={pagos} />
              </div>
            </div>
          </>
        )}
      </div>
    </AlumnoLayout>
  );
}
