export async function getEstadoCuenta(token) {
  const res = await fetch('http://localhost:8000/estado-cuenta/?id_alumno=1', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Error al obtener estado de cuenta');
  return await res.json();
}
