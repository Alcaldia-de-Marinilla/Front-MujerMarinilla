'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

import { Tab } from '@/app/equipamentos/components/equipment-tabs/tabs'
import { DetailedFilterTag, FilterTag } from '@/data/equipments'
import {
  type UseAddressMarker,
  useAddressMarker,
} from '@/hooks/use-address-marker'

interface MapContextType {
  filters: Record<FilterTag, boolean>
  detailedFilters: Record<DetailedFilterTag, boolean>
  handleCheckFilter: (filterTag: FilterTag) => void
  handleCheckDetailedFilter: (detailedFilterTag: DetailedFilterTag) => void
  addressHook: UseAddressMarker
  currentTab: Tab
  setCurrentTab: (tab: Tab) => void
  clearFilters: () => void // Agregando clearFilters
  clearDetailedFilters: () => void // Agregando clearDetailedFilters
}

const MapContext = createContext<MapContextType>({} as MapContextType)

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const addressHook = useAddressMarker()
  const [currentTab, setCurrentTab] = useState(Tab.LIST)

  // Filtros generales
  const [filters, setFilters] = useState<Record<FilterTag, boolean>>({
    [FilterTag.HEALTH]: false,
    [FilterTag.WOMAN]: false,
    [FilterTag.DEAM]: false,
  })

  // Filtros detallados
  const [detailedFilters, setDetailedFilters] = useState<
    Record<DetailedFilterTag, boolean>
  >(
    Object.values(DetailedFilterTag).reduce<Record<DetailedFilterTag, boolean>>(
      (acc, tag) => {
        acc[tag as DetailedFilterTag] = false
        return acc
      },
      {} as Record<DetailedFilterTag, boolean>,
    ),
  )

  // Alterna el estado de un filtro general
  function handleCheckFilter(filterTag: FilterTag) {
    setFilters((prev) => ({
      ...prev,
      [filterTag]: !prev[filterTag],
    }))
  }

  // Alterna el estado de un filtro detallado
  function handleCheckDetailedFilter(detailedFilterTag: DetailedFilterTag) {
    setDetailedFilters((prev) => ({
      ...prev,
      [detailedFilterTag]: !prev[detailedFilterTag],
    }))
  }

  function clearFilters() {
    setFilters((prev) => {
      const isAlreadyCleared = Object.values(prev).every((value) => !value)
      if (isAlreadyCleared) return prev // Evita un re-renderizado redundante
      return {
        [FilterTag.HEALTH]: false,
        [FilterTag.WOMAN]: false,
        [FilterTag.DEAM]: false,
      }
    })
  }

  function clearDetailedFilters() {
    setDetailedFilters((prev) => {
      const isAlreadyCleared = Object.values(prev).every((value) => !value)
      if (isAlreadyCleared) return prev // Evita un re-renderizado redundante
      return Object.values(DetailedFilterTag).reduce<
        Record<DetailedFilterTag, boolean>
      >(
        (acc, tag) => {
          acc[tag as DetailedFilterTag] = false
          return acc
        },
        {} as Record<DetailedFilterTag, boolean>,
      )
    })
  }

  return (
    <MapContext.Provider
      value={{
        filters,
        detailedFilters,
        handleCheckFilter,
        handleCheckDetailedFilter,
        addressHook,
        currentTab,
        setCurrentTab,
        clearFilters, // Agregando aquí
        clearDetailedFilters, // Agregando aquí
      }}
    >
      {children}
    </MapContext.Provider>
  )
}

export const useMap = () => {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error('useMap must be used within a MapProvider')
  }
  return context
}
