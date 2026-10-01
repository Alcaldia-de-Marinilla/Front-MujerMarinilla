'use client'

import { useSearchParams } from 'next/navigation'

import EquipmentTypeCard from '@/components/EquipmentTypeCard'
import FooterNav from '@/components/FooterNav'
import type { EquipmentType } from '@/data/equipmentsTypes'

import { HeaderWithReturn } from '../components/header-with-return'

interface UnitsTypesPageContentProps {
  equipmentTypes: EquipmentType[]
}

export default function UnitsTypesPageContent({
  equipmentTypes,
}: UnitsTypesPageContentProps) {
  const searchParams = useSearchParams()
  const selectedId = searchParams.get('id')
    ? Number(searchParams.get('id'))
    : null

  const sortedEquipmentTypes =
    selectedId !== null
      ? [
          equipmentTypes[selectedId],
          ...equipmentTypes.filter((_, i) => i !== selectedId),
        ]
      : equipmentTypes

  return (
    <div className="flex flex-col gap-5 p-8 pb-28">
      <HeaderWithReturn />
      <div className="mt-2">
        <h1>Conoce qué hace cada unidad de atención</h1>
      </div>
      <section className="mt-4 flex flex-col gap-4">
        {sortedEquipmentTypes.map((equipment, index) => {
          const isSelected =
            selectedId !== null && equipment === equipmentTypes[selectedId]

          return (
            <EquipmentTypeCard
              key={index}
              equipmentsType={equipment}
              isSelected={isSelected}
            />
          )
        })}
      </section>
      <FooterNav />
    </div>
  )
}
