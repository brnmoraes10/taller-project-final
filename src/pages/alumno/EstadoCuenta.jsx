import React from 'react';
import PaymentSummary from '../../components/PaymentSummary';
import PaymentTable from '../../components/PaymentTable';
import AlumnoLayout from '../../layouts/AlumnoLayout';

export default function EstadoCuenta() {
  return (
    <AlumnoLayout>
      <div className="container mt-4">
        <h2 className="text-center mb-4 text-danger">Estado de Cuenta del Alumno</h2>

        <PaymentSummary totalDebt={400000} latePayments={4} />

        <div className="card mt-4">
          <div className="card-body">
            <h5>Cuotas Pendientes</h5>
            <PaymentTable />
          </div>
        </div>
      </div>
    </AlumnoLayout>
  );
}
