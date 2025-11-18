import axios from 'axios';

const API_URL = 'http://localhost:8000/api/estado-cuenta/'; // tu endpoint Django

export async function getPagos() {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('No hay token disponible');

  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data; // debería ser un array de pagos
  } catch (error) {
    throw new Error('Error al obtener los pagos');
  }
}
