import { z } from 'zod'

const serverEnvSchema = z.object({
  GOOGLE_ANALYTICS_ID: z.string(),
  GOOGLE_TAG_MANAGER_ID: z.string(),
  HOTJAR_ID: z.string(),
  // URL del backend FastAPI. Sin prefijo NEXT_PUBLIC_: solo existe en el
  // servidor de Next.js, el navegador nunca la ve ni llama a la API
  // directamente (ver INTEGRACION-BACKEND.md).
  API_URL: z.string().url(),
})

export async function getEnv() {
  const _env = serverEnvSchema.safeParse(process.env)

  if (_env.success === false) {
    console.error('❌ Invalid environment variables!', _env.error.format())

    throw new Error('Invalid environment variables!')
  }

  return _env.data
}
