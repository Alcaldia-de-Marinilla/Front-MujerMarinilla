'use client'

import { ChevronRight, Clock, Navigation } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Equipment } from '@/data/equipments'

import StatusIndicator from './StatusIndicator'

interface EquipmentCardProps {
  equipment: Equipment & { distanceKm?: number }
  currentPage: number
  isFixed?: boolean // New prop to indicate if the card is a fixed equipment card
}

export function EquipmentCard2({
  equipment,
  currentPage,
  isFixed,
}: EquipmentCardProps) {
  function getTimeDistance(distance: number) {
    const distanceInMinutes = (distance / 40) * 60
    if (distanceInMinutes < 60) return `${distanceInMinutes.toFixed(0)} min`
    const distanceInHoures = (distance / 40).toFixed(0)
    return `${distanceInHoures} h ${(distanceInMinutes % 60).toFixed(0)} min`
  }

  return (
    <Card
      className={`relative flex w-80 shrink-0 flex-col justify-between bg-white ${isFixed ? 'rainbow-border border-3' : ''}`}
    >
      <Link href={`/equipamentos/${equipment.id}?page=${currentPage}`}>
        <CardHeader>
          <CardTitle className="shrink-0">
            {equipment.name || equipment.abbreviation}
          </CardTitle>
          {/* Estado de Abierto/Cerrado y horarios */}
          <StatusIndicator equipment={equipment} isFixed={isFixed} />
        </CardHeader>
      </Link>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {equipment.distanceKm !== undefined &&
            equipment.distanceKm !== Infinity && (
              <>
                <div className="flex items-center gap-2 rounded-lg bg-muted px-2 py-1">
                  <Clock className="size-3.5" />
                  <span>{getTimeDistance(equipment.distanceKm)}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted px-2 py-1">
                  <Navigation className="size-3.5" />
                  <span>{equipment.distanceKm.toFixed(2)} km</span>
                </div>
              </>
            )}
        </div>
        <Button size="icon" className="size-6 rounded-lg">
          <Link href={`/equipamentos/${equipment.id}?page=${currentPage}`}>
            <ChevronRight className="shrink-0" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
