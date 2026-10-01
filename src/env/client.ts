import { z } from 'zod'

const clientEnvSchema = z.object({
  // GOOGLE_ANALYTICS_ID: z.string(),
  // GOOGLE_TAG_MANAGER_ID: z.string(),
})
const _env = clientEnvSchema.safeParse({
  // GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
  // GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
})

if (_env.success === false) {
  console.error('❌ Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables!')
}

export const env = _env.data
