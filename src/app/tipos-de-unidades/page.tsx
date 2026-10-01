// src/app/tipos-de-unidades/page.tsx
// Server Component: consulta la API en el servidor (con respaldo
// estático si falla) y entrega la lista a la vista cliente, que sigue
// usando useSearchParams (por eso va envuelta en Suspense).

import { Suspense } from 'react'

import { getEquipmentTypes } from '@/http/api/queries'

import UnitsTypesPageContent from './UnitsTypesPage'

export const revalidate = 300

export default async function UnitsTypesPage() {
  const equipmentTypes = await getEquipmentTypes()

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <UnitsTypesPageContent equipmentTypes={equipmentTypes} />
    </Suspense>
  )
}
