'use client'

import { useEffect } from 'react'

import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useMap } from '@/context/MapContext'
import type { Equipment } from '@/data/equipments'

import { EquipmentList } from './list'
import { Map } from './map'
import { Tab } from './tabs'

interface EquipmentTabsProps {
  mapboxAccessToken: string
  equipments: Equipment[]
}

export default function EquipmentTabs({
  mapboxAccessToken,
  equipments,
}: EquipmentTabsProps) {
  const { currentTab, setCurrentTab, addressHook } = useMap()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxAccessToken}`,
            )
            const data = await response.json()
            if (data.features.length > 0) {
              const address = data.features[0].place_name
              addressHook.layerStates.setAddress(address)
              addressHook.layerStates.setAddressMarker({
                latitude,
                longitude,
              })
              addressHook.layerStates.setIsVisible(true)
            }
          } catch (error) {
            console.error('Error al buscar la dirección:', error)
          }
        },
        (error) => {
          console.error('Error getting user location:', error)
        },
      )
    }
  }, [])

  return (
    <Tabs
      className="h-dvh w-full"
      defaultValue={Tab.LIST}
      value={currentTab}
      onValueChange={(e) => setCurrentTab(e as Tab)}
    >
      <TabsContent value={Tab.LIST} className="m-0">
        <EquipmentList setCurrentTab={setCurrentTab} equipments={equipments} />
      </TabsContent>
      <TabsContent value={Tab.MAP} className="m-0">
        <Map mapboxAccessToken={mapboxAccessToken} equipments={equipments} />
      </TabsContent>
    </Tabs>
  )
}
