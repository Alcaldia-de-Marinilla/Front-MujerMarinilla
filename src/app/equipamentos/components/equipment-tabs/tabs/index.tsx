import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export enum Tab {
  LIST = 'Lista',
  MAP = 'Mapa',
}

export function TabList({ className }: { className?: string }) {
  return (
    <TabsList
      defaultValue={Tab.LIST}
      className={cn('z-0 h-10 w-full bg-white', className)}
    >
      <TabsTrigger value={Tab.LIST} className="h-full w-full">
        {Tab.LIST}
      </TabsTrigger>
      <TabsTrigger value={Tab.MAP} className="h-full w-full">
        {Tab.MAP}
      </TabsTrigger>
    </TabsList>
  )
}
