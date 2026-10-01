import { getEquipments } from '@/http/api/queries'

import EquipmentTabs from './components/equipment-tabs'

export const revalidate = 300

export default async function Equipments() {
  const equipments = await getEquipments()

  return (
    <EquipmentTabs
      mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN || ''}
      equipments={equipments}
    />
  )
}
