import axios from 'axios';

// Endpoint base de tu API Django
const API_URL = 'http://localhost:8000/';

// Función de login JWT
export async function login(usuario, contrasena) {
  try {
    const res = await axios.post(`${API_URL}/token/`, {
      username: usuario,
      password: contrasena,
    });

    // res.data = { access, refresh }
    return res.data;

  } catch (error) {
    // Puedes revisar error.response para mensajes más específicos
    throw new Error('Usuario o contraseña incorrectos');
  }
}

// Función opcional para obtener info del usuario logueado
export async function getCurrentUser(accessToken) {
  try {
    const res = await axios.get(`${API_URL}/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.data; // { username, rol, ... }
  } catch (error) {
    throw new Error('No se pudo obtener la información del usuario');
  }
}
