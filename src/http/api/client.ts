// src/http/api/client.ts
//
// Cliente único para leer del backend FastAPI. Solo se usa desde
// Server Components (nunca desde el navegador): la URL del backend
// vive en `API_URL` (sin prefijo NEXT_PUBLIC_), así que nunca llega
// al cliente. Ver INTEGRACION-BACKEND.md.

const API_URL = process.env.API_URL

/**
 * Hace GET a `${API_URL}/api/v1${path}` con caché de Next.js
 * (revalidate en segundos). Lanza si la respuesta no es 2xx; quien
 * llama decide el respaldo (ver src/http/api/queries.ts).
 */
export async function apiGet<T>(path: string, revalidate = 300): Promise<T> {
  if (!API_URL) {
    throw new Error('API_URL no está configurada (revisa .env.local)')
  }

  const res = await fetch(`${API_URL}/api/v1${path}`, {
    next: { revalidate },
  })

  if (!res.ok) {
    throw new Error(`La API respondió ${res.status} en ${path}`)
  }

  return res.json() as Promise<T>
}
