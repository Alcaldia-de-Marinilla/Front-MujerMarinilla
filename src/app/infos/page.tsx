// src/app/infos/page.tsx
// Server Component: consulta la API en el servidor (con respaldo
// estático si falla) y entrega la página ya armada a la vista cliente.

import { getEquipmentTypes, getViolenceTypes } from '@/http/api/queries'

import InfosView from './infos-view'

export const revalidate = 300

export default async function InfosPage() {
  const [equipmentTypes, violenceTypes] = await Promise.all([
    getEquipmentTypes(),
    getViolenceTypes(),
  ])

  return (
    <InfosView equipmentTypes={equipmentTypes} violenceTypes={violenceTypes} />
  )
}
