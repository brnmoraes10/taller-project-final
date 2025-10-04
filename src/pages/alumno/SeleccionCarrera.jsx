import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SeleccionCarrera() {
  const navigate = useNavigate();
  const [carreraSeleccionada, setCarreraSeleccionada] = useState('');

  const carreras = [
    'Psicopedagogía',
    'Profesorado de Educación Inicial',
    'Profesorado de Educación Primaria',
    'Profesorado de Ingles',
    'Profesorado de Educación Especial',
    'Analista de Sistemas',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!carreraSeleccionada) {
      alert('Por favor selecciona una carrera');
      return;
    }

    // Aquí podrías guardar la carrera seleccionada en contexto, localStorage, etc.
    console.log('Carrera seleccionada:', carreraSeleccionada);

    // Redirigir al estado de cuenta
    navigate('/estado-cuenta');
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Selecciona tu Carrera</h2>

      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <select
            className="form-select"
            value={carreraSeleccionada}
            onChange={(e) => setCarreraSeleccionada(e.target.value)}
          >
            <option value="">-- Selecciona una carrera --</option>
            {carreras.map((carrera, index) => (
              <option key={index} value={carrera}>
                {carrera}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Continuar
        </button>
      </form>
    </div>
  );
}
