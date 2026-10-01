import type { PickingInfo } from 'deck.gl'

import type { Equipment } from '@/data/equipments'
import { cn } from '@/lib/utils'

const Label = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => <span className={cn('text-lg font-semibold', className)}>{children}</span>

// const Value = ({
//   children,
//   className,
// }: {
//   children?: React.ReactNode
//   className?: string
// }) => (
//   <span
//     className={cn('text-sm font-semibold text-muted-foreground', className)}
//   >
//     {children}
//   </span>
// )

export function EquipmentInfo({
  pickingInfo,
}: {
  pickingInfo: PickingInfo<Equipment>
}) {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <Label>{pickingInfo.object?.name}</Label>
          </div>
          {/* <Value>{pickingInfo.object?.name}</Value> */}
        </div>

        {/* <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <Label>Tipo</Label>
          </div>
          <Value>{pickingInfo.object?.equipmentType}</Value>
        </div> */}
      </div>
    </div>
  )
}
