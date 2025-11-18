// src/api.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; // Cambia si tu backend está en otra URL

// Para login y obtener tokens JWT
export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/token/`, { username, password });
  return response.data; // devuelve { access, refresh }
};

// Para refrescar token
export const refreshToken = async (refresh) => {
  const response = await axios.post(`${API_URL}/token/refresh/`, { refresh });
  return response.data;
};

// Para llamar endpoints protegidos
export const getEstadoCuenta = async (accessToken) => {
  const response = await axios.get(`${API_URL}/estado-cuenta/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
