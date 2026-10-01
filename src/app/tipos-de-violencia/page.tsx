// src/app/tipos-de-violencia/page.tsx
// Server Component: consulta la API en el servidor (con respaldo
// estático si falla) y entrega la lista a la vista cliente, que sigue
// usando useSearchParams (por eso va envuelta en Suspense).

import { Suspense } from 'react'

import { getViolenceTypes } from '@/http/api/queries'

import ViolenceTypesPage from './ViolenceTypesPage'

export const revalidate = 300

export default async function PageWithSuspense() {
  const violenceTypes = await getViolenceTypes()

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ViolenceTypesPage violenceTypes={violenceTypes} />
    </Suspense>
  )
}
