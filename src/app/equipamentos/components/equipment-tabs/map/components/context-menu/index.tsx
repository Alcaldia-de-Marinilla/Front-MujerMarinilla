'use client'

/* eslint-disable @next/next/no-img-element */
import { type PickingInfo } from 'deck.gl'
import {
  // ChevronLeft,
  ChevronRight,
  Clock,
  Navigation,
  // Plus,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import StatusIndicator from '@/components/StatusIndicator'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent } from '@/components/ui/popover'
import type { Equipment } from '@/data/equipments'

import { EquipmentInfo } from './components/equipment-info'

interface ContextMenuProps {
  pickingInfo: PickingInfo | null
  open: boolean
  onOpenChange: (open: boolean) => void
  equipment: Equipment
  distance: string | null
  duration: string | null
}

export function ContextMenu({
  pickingInfo,
  onOpenChange,
  open,
  equipment,
  distance,
  duration,
}: ContextMenuProps) {
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null)
  if (!pickingInfo || !pickingInfo.object) return null
  console.log('pickingInfo', pickingInfo)
  const adjustedLeft = (window.innerWidth - (cardRef?.clientWidth || 300)) / 2
  const adjustedTop = (window.innerHeight - (cardRef?.clientHeight || 200)) / 2

  const validLayerIds = [
    'defaultPurple',
    'closedPurple',
    'defaultRed',
    'closedRed',
    'defaultYellow',
    'closedYellow',
    'especialCarnavalUnits',
  ]

  const Content = ({ pickingInfo }: { pickingInfo: PickingInfo }) => {
    if (validLayerIds.includes(pickingInfo?.layer?.id || '')) {
      const equipmentId = pickingInfo.object.id // Accede al ID del equipamiento
      return (
        <div className="flex flex-col gap-2 p-2">
          <EquipmentInfo pickingInfo={pickingInfo} />

          <div className="flex items-center gap-1 text-sm">
            <StatusIndicator equipment={equipment} />
          </div>
          {(equipment.id === 1275 || equipment.id === 1276) && (
            <div className="flex h-6 w-full items-center justify-center rounded-full bg-primary p-2 text-xs text-white">
              Especial Carnaval
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-2">
              {duration && distance && (
                <>
                  <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-2 pr-3 text-gray-500">
                    <Clock className="size-4 text-black" />
                    <span className="text-xs">{duration}</span>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-2 pr-3 text-gray-500">
                    <Navigation className="size-4 text-black" />
                    <span className="text-xs">{distance}</span>
                  </div>
                </>
              )}
            </div>

            <Button size="icon" className="size-8 rounded-lg">
              <Link href={`/equipamentos/${equipmentId}`}>
                <ChevronRight className="shrink-0" />
              </Link>
            </Button>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange} modal={false}>
      {pickingInfo.layer?.id &&
        validLayerIds.includes(pickingInfo.layer.id) && (
          <PopoverContent
            ref={(ref) => setCardRef(ref)}
            style={{
              position: 'absolute',
              top: adjustedTop,
              left: adjustedLeft,
              width: '300px', // Reducido para ocupar menos espacio horizontal
            }}
            className="rounded-lg bg-white shadow-lg"
          >
            <Content pickingInfo={pickingInfo} />
          </PopoverContent>
        )}
    </Popover>
  )
}
