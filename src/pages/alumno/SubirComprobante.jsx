import React, { useState, useEffect } from 'react';
import { FaCcPaypal, FaStripe } from 'react-icons/fa';
import { SiMercadopago } from 'react-icons/si';
import axios from 'axios';

export default function SubirComprobante() {
  const [pago, setPago] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [observacion, setObservacion] = useState('');
  const [tipoPago, setTipoPago] = useState('');
  const [pasarela, setPasarela] = useState(''); // Nueva opción para pasarela
  const [cupon, setCupon] = useState(''); // Nº de cupón generado
  const [pagos, setPagos] = useState([]);
  const [error, setError] = useState('');
  const [tiposPagos, setTiposPagos] = useState([]);

  const generarCupon = () => {
    // Ejemplo: CUP-20251003-1234
    const random = Math.floor(1000 + Math.random() * 9000);
    return `CUP-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${random}`;
  };

  const formatearPeriodo = (fechaString) => {
  const fecha = new Date(`${fechaString}T00:00:00`);

  return fecha.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric"
  });
  };
 
  useEffect(() => {
      const fetchPagos = async () => {
        try {
          const token = localStorage.getItem('access_token');
          const res = await axios.get('http://localhost:8000/estado-cuenta/?id_alumno=1', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setPagos(res.data);
          console.log(res.data);
        }
        catch (err) {
          setError('Error al cargar los pagos');
        }
      };
  
      fetchPagos();

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
  
      fetchTipoPagos();
    }, []);

    useEffect(() => {
    const token = localStorage.getItem('access_token');
  }, []);
  
  const pagosFiltrados = pagos
    
    .map(p => ({
      ...p,
      periodo: formatearPeriodo(p.fecha),
    }))
    .filter(p => !p.aprobado)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  console.log(pagosFiltrados);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    if (!pago || !archivo || !tipoPago) {
      alert("Completa todos los campos obligatorios.");
      return;
    }

    const numeroCupon = generarCupon();
    setCupon(numeroCupon);

    const formData = new FormData();
    formData.append("observacion", observacion);
    formData.append("estado", "Pendiente");
    formData.append("cupon", numeroCupon);
    formData.append("pago", pago.id); 
    formData.append("importe", pago.monto);
    formData.append("id_tipo_pago", tipoPago);
    formData.append("pasarela", pasarela);
    formData.append("urlarchivo", archivo);
    formData.append("fecha_emision", new Date().toISOString().split('T')[0]);


    try {
      await axios.post("http://localhost:8000/comprobantes-create/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Comprobante enviado con éxito");
    } catch (err) {
      console.error(err);
      alert("Error enviando comprobante");
    }

    // Reset del formulario
    setPago('');
    setArchivo(null);
    setObservacion('');
    setTipoPago('');
    setPasarela('');
    document.getElementById('archivo-input').value = null;
  };

  if (error) return <p className="text-danger">{error}</p>;

  return (
      <div className="container mt-5">
        <h2 className="text-center mb-4">Subir Comprobante de Pago</h2>

        <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '500px' }}>
          {/* PERÍODO */}
          <div className="mb-3">
            <label className="form-label">Período/Cuota *</label>
            <select
              className="form-select"
              value={pago.id}
              onChange={(e) => setPago(pagosFiltrados.find(p => p.id == e.target.value))}
            >
              <option value="">-- Selecciona una Cuota --</option>

              {pagosFiltrados.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.periodo}
                </option>
              ))}

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
              {tiposPagos.map((tp) => (
                <option key={tp.id} value={tp.id}>
                  {tp.tipopago}
                </option>
              ))}
            </select>
          </div>

          {/* PASARELA DE PAGO */}
          {tipoPago === '3' || tipoPago === 'paypal' ? (
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
  );
}
