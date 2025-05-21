// lib/api.ts
export async function getUsers() {
  const res = await fetch('http://localhost:3000/users/getUsers', {
    cache: 'no-store', // evita cache en SSR
  });

  if (!res.ok) throw new Error('Error al obtener usuarios');

  return res.json(); // espera que sea un array de usuarios
}
