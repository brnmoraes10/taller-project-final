import React from 'react';

export default function PaymentSummary({ totalDebt, latePayments }) {
  return (
    <div className="d-flex justify-content-around mb-4">
      <div className="card text-center p-3">
        <h6>Deuda Total</h6>
        <h4>${totalDebt.toLocaleString()}</h4>
      </div>
      <div className="card text-center bg-danger text-white p-3">
        <h6>Cuotas Vencidas</h6>
        <h4>{latePayments}</h4>
      </div>
    </div>
  );
}
