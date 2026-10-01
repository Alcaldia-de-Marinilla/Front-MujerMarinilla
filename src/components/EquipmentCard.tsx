'use client'

import Link from 'next/link'

import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Equipment } from '@/data/equipments'

import StatusIndicator from './StatusIndicator'

interface EquipmentCardProps {
  equipment: Equipment
  latitude?: number | null
  longitude?: number | null
  style?: React.CSSProperties
  handleSelectEquipment?: (equipment: Equipment) => void
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
  return (
    <Link href={`/equipamentos/${equipment.id}`} className="block">
      <Card className="flex h-36 w-80 shrink-0 flex-col justify-between">
        <CardHeader>
          <CardTitle className="shrink-0">
            {equipment.abbreviation || equipment.name}
          </CardTitle>
          <StatusIndicator equipment={equipment} />
        </CardHeader>
      </Card>
    </Link>
  )
}
