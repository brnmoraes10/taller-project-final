export async function getEstadoCuenta(token) {
  const res = await fetch('http://localhost:8000/api/estado-cuenta/', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Error al obtener estado de cuenta');
  return await res.json();
}
