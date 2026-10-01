'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import DraggableScroll from '@/components/DraggableScroll'
import { EquipmentCard2 } from '@/components/EquipmentCard2'
import FooterNav from '@/components/FooterNav'
import { Button } from '@/components/ui/button'
import { useMap } from '@/context/MapContext'
import { DetailedFilterTag, type Equipment, FilterTag } from '@/data/equipments'
import { cn } from '@/lib/utils'
import { haversineDistance } from '@/utils/EquipmentsFunctions'

import { SearchBox } from '../map/components/search-address-box'
import { type Tab, TabList } from '../tabs'

interface EquipmentListProps {
  setCurrentTab: (tab: Tab) => void
  equipments: Equipment[]
}

const EquipmentListContent: React.FC<EquipmentListProps> = ({
  equipments,
}) => {
  const { filters, handleCheckFilter, addressHook, detailedFilters } = useMap()
  const {
    layerStates: { addressMarker },
  } = addressHook
  const isFiltersEnabled = Object.values(filters).some((value) => value)
  const isDetailedFiltersEnabled = Object.values(detailedFilters).some(
    (value) => value,
  )

  const router = useRouter()
  const searchParams = useSearchParams()
  const pageParam = searchParams.get('page')
  const [currentPage, setCurrentPage] = useState(
    pageParam ? parseInt(pageParam) : 1,
  )
  const itemsPerPage = 3

  useEffect(() => {
    if (pageParam) {
      setCurrentPage(parseInt(pageParam))
    }
  }, [pageParam])

  const isEquipmentIncluded = (
    equipment: Equipment,
    filtersEnabled: boolean,
    isDetailedFiltersEnabled: boolean,
    filters: Record<FilterTag, boolean>,
    detailedFilters: Record<DetailedFilterTag, boolean>,
  ): boolean => {
    if (
      [DetailedFilterTag.NEAP, DetailedFilterTag.CVM].includes(
        equipment.type as DetailedFilterTag,
      )
    ) {
      return false
    }

    if (filtersEnabled) {
      const macroFilter = !!filters[equipment.equipmentType as FilterTag]
      if (!macroFilter) {
        return false
      }

      if (isDetailedFiltersEnabled) {
        const microFilter =
          !!detailedFilters[equipment.type as DetailedFilterTag]

        return microFilter
      }
    }

    return true
  }

  const filteredAndSortedEquipments: (Equipment & { distanceKm: number })[] =
    equipments
      .filter((equipment) =>
        isEquipmentIncluded(
          equipment,
          isFiltersEnabled,
          isDetailedFiltersEnabled,
          filters,
          detailedFilters,
        ),
      )
      .map((equipment) => {
        const distanceKm =
          addressMarker &&
          addressMarker.latitude &&
          addressMarker.longitude &&
          equipment.latitude &&
          equipment.longitude
            ? haversineDistance(
                [addressMarker.latitude, addressMarker.longitude],
                [equipment.latitude, equipment.longitude],
              )
            : Infinity

        return {
          ...equipment,
          distanceKm,
        }
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)

  const totalPages = Math.ceil(
    filteredAndSortedEquipments.length / itemsPerPage,
  )
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAndSortedEquipments.slice(
    indexOfFirstItem,
    indexOfLastItem,
  )

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    router.push(`/equipamentos?page=${newPage}`)
  }

  // const fixedEquipments: Equipment[] = [
  //   {
  //     id: 1275,
  //     type: DetailedFilterTag.NEAM_CARNAVAL,
  //     name: 'Atendimento na Sapucaí',
  //     description:
  //       'Referência: setor dos órgãos públicos. Atendimento com psicólogas, assistentes sociais e advogadas.',
  //     abbreviation: 'Atendimento na Sapucaí',
  //     openingTime: '19:00:00',
  //     closingTime: '07:00:00',
  //     address: 'R. Marquês de Sapucaí - Santo Cristo, Setor 13',
  //     neighborhood: 'Santo Cristo',
  //     latitude: -22.911215001148058,
  //     longitude: -43.19676108896497,
  //     open_24: 0,
  //     equipmentType: FilterTag.WOMAN_CARNAVAL,
  //     workingDates: [
  //       '2025-02-28',
  //       '2025-03-01',
  //       '2025-03-02',
  //       '2025-03-03',
  //       '2025-03-04',
  //       '2025-03-08',
  //     ],
  //   },
  //   {
  //     id: 1276,
  //     type: DetailedFilterTag.NEAM_CARNAVAL,
  //     name: 'Atendimento Intendente Magalhães',
  //     description:
  //       'Referência: Próximo à quadra da Escola de Samba Tradição. Setor dos órgãos públicos. <br/><br/>Uma sala de atendimento com equipe especializada no acolhimento e atendimento a mulheres em situação de violência, prestando apoio em casos de assédio e/ou violência sexual, além de oferecer atendimento e encaminhamento de forma emergencial.',
  //     abbreviation: 'Atendimento Intendente Magalhães',
  //     openingTime: '18:00:00',
  //     closingTime: '06:00:00',
  //     address: 'Estrada Intendente Magalhães, 188. ',
  //     neighborhood: 'Campinho',
  //     latitude: -22.882099704246322,
  //     longitude: -43.34661343978823,
  //     open_24: 0,
  //     equipmentType: FilterTag.WOMAN_CARNAVAL,
  //     workingDates: [
  //       '2025-03-03',
  //       '2025-03-04',
  //       '2025-03-08',
  //       '2025-03-07',
  //       '2025-03-08',
  //     ],
  //   },
  // ]

  return (
    <div className="flex min-h-screen flex-col p-4">
      <SearchBox
        isVisible={addressHook.layerStates.isVisible}
        setAddressMarker={addressHook.layerStates.setAddressMarker}
        setIsVisible={addressHook.layerStates.setIsVisible}
        defaultValue={addressHook.layerStates.address}
        setAddress={addressHook.layerStates.setAddress}
        setViewport={(viewport) => {
          console.log(viewport)
        }}
        filteredData={filteredAndSortedEquipments}
      />
      <TabList className="mb-4 mt-2.5" />

      <h1>Nuestras unidades de atención</h1>

      <div className="mt-1 flex w-full items-center gap-3 overflow-x-auto pb-2">
        <DraggableScroll>
          {Object.entries(filters).map(([key, value], index) => (
            <Button
              key={index}
              variant={value ? 'default' : 'secondary'}
              className={cn(
                'whitespace-nowrap rounded-full',
                value ? 'border border-primary' : '',
              )}
              onClick={() => handleCheckFilter(key as FilterTag)}
            >
              {key}
            </Button>
          ))}
        </DraggableScroll>
      </div>

      <div className="mt-3 flex flex-col items-center justify-center gap-4 pb-2 sm:flex-row sm:flex-wrap">
        {/* {fixedEquipments.map(
          (equipment) =>
            currentPage === 1 && (
              <EquipmentCard2
                key={equipment.id}
                equipment={equipment}
                currentPage={currentPage}
                isFixed={true}
              />
            ),
        )} */}
        {currentItems.map((equipment) => (
          <EquipmentCard2
            key={equipment.id}
            equipment={equipment}
            currentPage={currentPage}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <Button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() =>
            handlePageChange(Math.min(currentPage + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Siguiente
        </Button>
      </div>

      <div className="relative pt-20">
        <FooterNav />
      </div>
    </div>
  )
}

export const EquipmentList: React.FC<EquipmentListProps> = (props) => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <EquipmentListContent {...props} />
    </Suspense>
  )
}
