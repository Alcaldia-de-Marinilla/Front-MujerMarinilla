import { notFound } from 'next/navigation'

import EquipmentDetails from '@/components/EquipmentDetails'
import { getEquipment } from '@/http/api/queries'

interface EquipmentPageProps {
  params: {
    id: string
  }
  searchParams: {
    page?: string
  }
}

// Nota: `generateStaticParams` se quitó a propósito (Paso 6 de la
// revisión técnica). Con datos estáticos tenía sentido pre-generar
// todas las páginas en el build; con la API, el build de Cloud Build
// necesitaría la API encendida para poder listarlas todas. En su
// lugar, cada unidad se resuelve en tiempo de petición y se
// cachea 5 minutos (`revalidate`).
export const revalidate = 300

export default async function EquipmentPage({
  params,
  searchParams,
}: EquipmentPageProps) {
  const { id } = params
  const equipment = await getEquipment(Number(id))

  if (!equipment) {
    return notFound()
  }

  // Definición de la lógica de isFixed (ajustar según sea necesario)
  const isFixed = equipment.id === 1275 || equipment.id === 1276

  return (
    <div>
      {/* Pasa equipment, currentPage e isFixed al componente */}
      <EquipmentDetails
        equipment={equipment}
        currentPage={searchParams.page || '1'}
        isFixed={isFixed}
      />
    </div>
  )
}
