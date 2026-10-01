'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { EquipmentType } from '@/data/equipmentsTypes'
import { cn } from '@/lib/utils' // Utility for conditional classes

interface EquipmentTypeCardProps {
  equipmentsType: EquipmentType
  isSelected?: boolean // New prop
}

export default function EquipmentTypeCard({
  equipmentsType,
  isSelected,
}: EquipmentTypeCardProps) {
  return (
    <Card className="flex w-full shrink-0 flex-col">
      <CardHeader className="pb-2">
        <CardTitle
          className={cn('shrink-0 pb-1', isSelected && 'text-primary')}
        >
          {equipmentsType.abbreviation}
        </CardTitle>
        <CardDescription className="!m-0 text-base leading-5 text-foreground">
          {equipmentsType.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {equipmentsType.description}
      </CardContent>
    </Card>
  )
}
