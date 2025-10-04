import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigate = useNavigate();

  // Simulación simple de login y rol
  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí podrías validar contra un backend o un mock
    if (usuario === 'alumno' && contrasena === '1234') {
      navigate('/estado-cuenta');
    } else if (usuario === 'admin' && contrasena === '1234') {
      navigate('/admin/revisar-comprobantes');
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center">Iniciar Sesión</h2>
      <form className="mt-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ingrese su usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            placeholder="Ingrese su contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">Ingresar</button>
      </form>
    </div>
  );
}
