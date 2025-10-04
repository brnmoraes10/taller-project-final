import React, { useState } from 'react';
import AlumnoLayout from '../../layouts/AlumnoLayout';
import { FaCcPaypal, FaStripe } from 'react-icons/fa';
import { SiMercadopago } from 'react-icons/si';

export default function SubirComprobante() {
  const [periodo, setPeriodo] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [observacion, setObservacion] = useState('');
  const [tipoPago, setTipoPago] = useState('');
  const [pasarela, setPasarela] = useState(''); // Nueva opción para pasarela
  const [cupon, setCupon] = useState(''); // Nº de cupón generado

  const generarCupon = () => {
    // Ejemplo: CUP-20251003-1234
    const random = Math.floor(1000 + Math.random() * 9000);
    return `CUP-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${random}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!periodo || !archivo || !tipoPago) {
      alert('Completa todos los campos obligatorios.');
      return;
    }

    const numeroCupon = generarCupon();
    setCupon(numeroCupon);

    // Aquí podrías enviar los datos a una API
    console.log('Periodo:', periodo);
    console.log('Archivo:', archivo);
    console.log('Observación:', observacion);
    console.log('Tipo de pago:', tipoPago);
    console.log('Pasarela:', pasarela);
    console.log('Cupón generado:', numeroCupon);

    alert(`Comprobante enviado con éxito\nNúmero de cupón: ${numeroCupon}`);

    // Reset del formulario
    setPeriodo('');
    setArchivo(null);
    setObservacion('');
    setTipoPago('');
    setPasarela('');
    document.getElementById('archivo-input').value = null;
  };

  return (
    <AlumnoLayout>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Subir Comprobante de Pago</h2>

        <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '500px' }}>
          {/* PERÍODO */}
          <div className="mb-3">
            <label className="form-label">Período/Cuota *</label>
            <select
              className="form-select"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
            >
              <option value="">-- Selecciona un período --</option>
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

          {/* TIPO DE PAGO */}
          <div className="mb-3">
            <label className="form-label">Tipo de Pago *</label>
            <select
              className="form-select"
              value={tipoPago}
              onChange={(e) => setTipoPago(e.target.value)}
            >
              <option value="">-- Selecciona un tipo de pago --</option>
              <option value="transferencia">Transferencia bancaria</option>
              <option value="tarjeta">Tarjeta de crédito/débito</option>
              <option value="efectivo">Pago en efectivo</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {/* PASARELA DE PAGO */}
          {tipoPago === 'tarjeta' || tipoPago === 'paypal' ? (
            <div className="mb-3">
              <label className="form-label">Pasarela de Pago *</label>
              <div className="input-group">
                <span className="input-group-text">
                  {pasarela === 'mercadopago' && <SiMercadopago />}
                  {pasarela === 'stripe' && <FaStripe />}
                  {pasarela === 'paypal' && <FaCcPaypal />}
                </span>
                <select
                  className="form-select"
                  value={pasarela}
                  onChange={(e) => setPasarela(e.target.value)}
                >
                  <option value="">-- Selecciona una pasarela --</option>
                  <option value="mercadopago">MercadoPago</option>
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
            </div>
          ) : null}

          {/* ARCHIVO */}
          <div className="mb-3">
            <label className="form-label">Comprobante (PDF o Imagen) *</label>
            <input
              id="archivo-input"
              type="file"
              className="form-control"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setArchivo(e.target.files[0])}
            />
          </div>

          {/* OBSERVACIÓN */}
          <div className="mb-3">
            <label className="form-label">Observación (opcional)</label>
            <textarea
              className="form-control"
              rows="3"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              placeholder="Ej: Pago realizado el 10/09/2025 vía transferencia"
            />
          </div>

          {/* CUPÓN GENERADO */}
          {cupon && (
            <div className="alert alert-info text-center">
              <strong>Nº de Cupón:</strong> {cupon}
            </div>
          )}

          {/* BOTÓN ENVIAR */}
          <button type="submit" className="btn btn-success w-100">
            Enviar Comprobante
          </button>
        </form>
      </div>
    </AlumnoLayout>
  );
}
