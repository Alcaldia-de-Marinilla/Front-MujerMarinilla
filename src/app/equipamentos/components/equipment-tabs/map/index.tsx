'use client'

import { IconLayer } from '@deck.gl/layers'
import {
  type Deck,
  DeckGL,
  FlyToInterpolator,
  type MapViewState,
  type PickingInfo,
} from 'deck.gl'
import { ChevronLeft, Filter, LocateFixedIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import MapGl, { type MapRef } from 'react-map-gl'

import coloredIcons from '@/assets/coloredIcons.png'
import FooterNav from '@/components/FooterNav'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/custom-popover'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useMap } from '@/context/MapContext'
import { DetailedFilterTag, type Equipment, FilterTag } from '@/data/equipments'
import { fetchDistanceAndTime } from '@/http/mapbox/fetch-distance-and-time'
import { isOpenNow } from '@/utils/isOpenNow'
import { MARINILLA_VIEWSTATE } from '@/utils/types'

import { TabList } from '../tabs'
import { ContextMenu } from './components/context-menu'
import { SearchBox } from './components/search-address-box'

export const INITIAL_VIEW_PORT = {
  longitude: -75.3375,
  latitude: 6.1739,
  zoom: 13,
}

interface MapProps {
  mapboxAccessToken: string
  equipments: Equipment[]
}

export function Map({ mapboxAccessToken, equipments }: MapProps) {
  const deckRef = useRef<Deck | null>(null)
  const mapRef = useRef<MapRef | null>(null)
  const [openContextMenu, setOpenContextMenu] = useState(false)
  const [pickingInfo, setPickingInfo] = useState<PickingInfo<Equipment> | null>(
    null,
  )
  const [distance, setDistance] = useState<string | null>(null)
  const [duration, setDuration] = useState<string | null>(null)
  const { filters, handleCheckFilter, addressHook } = useMap()
  const [viewState, setViewState] = useState<MapViewState>(MARINILLA_VIEWSTATE)
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [isLocationButtonOn, setIsLocationButtonOn] = useState(false)

  const flyTo = useCallback((destination: Partial<MapViewState>) => {
    setViewState((currentViewState) => ({
      ...currentViewState,
      ...destination,
      transitionDuration: 'auto',
      transitionInterpolator: new FlyToInterpolator({ speed: 2 }),
    }))
  }, [])

  const onViewStateChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ viewState }: { viewState: any }) => {
      setViewState(viewState)
    },
    [setViewState],
  )

  useEffect(() => {
    if (!addressHook.layerStates.address) {
      setIsLocationButtonOn(false)
    }
  }, [addressHook.layerStates.address])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsLocationButtonOn(true)
          if (addressHook.layerStates.isVisible) {
            setIsLocationButtonOn(true)
          }
        },
        (error) => {
          console.error('Error getting user location:', error)
        },
      )
    }
  }, [])

  useEffect(() => {
    if (pickingInfo && userLocation) {
      const destination = {
        lat: pickingInfo.coordinate ? pickingInfo.coordinate[1] : 0,
        lng: pickingInfo.coordinate ? pickingInfo.coordinate[0] : 0,
      }

      fetchDistanceAndTime(userLocation, destination).then(
        ({ distance, duration }) => {
          setDistance(distance)
          setDuration(duration)
        },
      )
    }
  }, [pickingInfo, userLocation])

  const filteredData = equipments.filter(
    (e) =>
      // Excluye siempre NEAP y CVM
      ![DetailedFilterTag.NEAP, DetailedFilterTag.CVM].includes(
        e.type as DetailedFilterTag,
      ) &&
      // Aplica los filtros generales solo si hay filtros activos
      (!Object.values(filters).some((value) => value) ||
        filters[e.equipmentType]),
  )

  const defaultPurpleLayer = new IconLayer<Equipment>({
    id: 'defaultPurple',
    data: filteredData.filter(
      (d) =>
        d.equipmentType === FilterTag.WOMAN && isOpenNow(d),
    ),
    pickable: true,
    getSize: 20,
    autoHighlight: false,
    visible: true,
    highlightColor: [0, 0, 0],
    getIcon: () => 'defaultPurple',
    getPosition: (d) =>
      d.longitude && d.latitude ? [d.longitude, d.latitude] : [0, 0],
    iconAtlas: coloredIcons.src,
    iconMapping: {
      defaultPurple: { x: 95, y: 0, width: 21, height: 24, mask: false },
    },
    onClick: (info) => {
      if (!info || !info.object) return
      setPickingInfo(info)
      setOpenContextMenu(true)
    },
  })

  const closedPurpleLayer = new IconLayer<Equipment>({
    id: 'closedPurple',
    data: filteredData.filter(
      (d) =>
        d.equipmentType === FilterTag.WOMAN &&
        !isOpenNow(d),
    ),
    pickable: true,
    getSize: 19,
    autoHighlight: false,
    visible: true,
    highlightColor: [0, 0, 0],
    getIcon: () => 'closedPurple',
    getPosition: (d) =>
      d.longitude && d.latitude ? [d.longitude, d.latitude] : [0, 0],
    iconAtlas: coloredIcons.src,
    iconMapping: {
      closedPurple: { x: 119.8, y: 0, width: 21, height: 24, mask: false },
    },
    onClick: (info) => {
      if (!info || !info.object) return
      setPickingInfo(info)
      setOpenContextMenu(true)
    },
  })

  const defaultRedLayer = new IconLayer<Equipment>({
    id: 'defaultRed',
    data: filteredData.filter(
      (d) => d.equipmentType === FilterTag.HEALTH && isOpenNow(d),
    ),
    pickable: true,
    getSize: 18,
    autoHighlight: false,
    visible: true,
    highlightColor: [0, 0, 0],
    getIcon: () => 'defaultRed',
    getPosition: (d) =>
      d.longitude && d.latitude ? [d.longitude, d.latitude] : [0, 0],
    iconAtlas: coloredIcons.src,
    iconMapping: {
      defaultRed: { x: 0, y: 0, width: 24, height: 24, mask: false },
    },
    onClick: (info) => {
      if (!info || !info.object) return
      setPickingInfo(info)
      setOpenContextMenu(true)
    },
  })

  const closedRedLayer = new IconLayer<Equipment>({
    id: 'closedRed',
    data: filteredData.filter(
      (d) => d.equipmentType === FilterTag.HEALTH && !isOpenNow(d),
    ),
    pickable: true,
    getSize: 18,
    autoHighlight: false,
    visible: true,
    highlightColor: [0, 0, 0],
    getIcon: () => 'closedRed',
    getPosition: (d) =>
      d.longitude && d.latitude ? [d.longitude, d.latitude] : [0, 0],
    iconAtlas: coloredIcons.src,
    iconMapping: {
      closedRed: { x: 24, y: 0, width: 24, height: 24, mask: false },
    },
    onClick: (info) => {
      if (!info || !info.object) return
      setPickingInfo(info)
      setOpenContextMenu(true)
    },
  })

  const defaultYellowLayer = new IconLayer<Equipment>({
    id: 'defaultYellow',
    data: filteredData.filter(
      (d) => d.equipmentType === FilterTag.DEAM && isOpenNow(d),
    ),
    pickable: true,
    getSize: 18,
    autoHighlight: false,
    visible: true,
    highlightColor: [0, 0, 0],
    getIcon: () => 'defaultYellow',
    getPosition: (d) =>
      d.longitude && d.latitude ? [d.longitude, d.latitude] : [0, 0],
    iconAtlas: coloredIcons.src,
    iconMapping: {
      defaultYellow: { x: 48, y: 0, width: 24, height: 24, mask: false },
    },
    onClick: (info) => {
      if (!info || !info.object) return
      setPickingInfo(info)
      setOpenContextMenu(true)
    },
  })

  const closedYellowLayer = new IconLayer<Equipment>({
    id: 'closedYellow',
    data: filteredData.filter(
      (d) => d.equipmentType === FilterTag.DEAM && !isOpenNow(d),
    ),
    pickable: true,
    getSize: 18,
    autoHighlight: false,
    visible: true,
    highlightColor: [0, 0, 0],
    getIcon: () => 'closedYellow',
    getPosition: (d) =>
      d.longitude && d.latitude ? [d.longitude, d.latitude] : [0, 0],
    iconAtlas: coloredIcons.src,
    iconMapping: {
      closedYellow: { x: 72, y: 0, width: 24, height: 24, mask: false },
    },
    onClick: (info) => {
      if (!info || !info.object) return
      setPickingInfo(info)
      setOpenContextMenu(true)
    },
  })
  useEffect(() => {}, [openContextMenu])

  function onLeftClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault()
    const y = e.clientY
    const x = e.clientX

    const info = deckRef.current?.pickObject({ x, y, radius: 0 })

    setPickingInfo(info || null)
    setOpenContextMenu(!!info)
  }

  const router = useRouter()

  const toggleLocationButton = () => {
    if (isLocationButtonOn) {
      // If the button is currently on, turn it off and fly to the default MARINILLA_VIEWSTATE with transition
      setIsLocationButtonOn(false)
      flyTo({
        longitude: MARINILLA_VIEWSTATE.longitude,
        latitude: MARINILLA_VIEWSTATE.latitude,
        zoom: MARINILLA_VIEWSTATE.zoom,
      })
    } else {
      // If the button is currently off, turn it on and fly to the user's location
      if (userLocation) {
        flyTo({
          longitude: userLocation.lng,
          latitude: userLocation.lat,
          zoom: 15,
        })
        setIsLocationButtonOn(true)
      }
    }
  }

  const svg = `
<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Círculo mayor translúcido -->
  <circle cx="150" cy="150" r="100" fill="rgba(110, 46, 173, 0.2)" stroke="none" />

  <!-- Círculo intermedio más oscuro -->
  <circle cx="150" cy="150" r="27" fill="rgba(110, 46, 173, 0.2)" stroke="none" />

  <!-- Anillo blanco pegado al punto -->
  <circle cx="150" cy="150" r="15" fill="none" stroke="white" stroke-width="5"/>

  <!-- Punto al centro -->
  <circle cx="150" cy="150" r="13" fill="#6e2ead" />
</svg>

`
  function svgToDataURL(svg: string | number | boolean) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  }

  const userLocationLayer = new IconLayer({
    id: 'user-location-layer',
    data: userLocation ? [[userLocation.lng, userLocation.lat]] : [],
    getIcon: () => ({
      url: svgToDataURL(svg),
      width: 200,
      height: 200,
    }),
    getSize: 150,
    getPosition: (d) => d,
  })

  const shareLocationText = (
    <span className="text-xs sm:text-sm">
      Concede permiso para compartir tu <br />
      ubicación en la configuración del navegador.
    </span>
  )

  return (
    <div
      className="relative h-screen w-full overflow-hidden"
      onClick={onLeftClick}
    >
      <DeckGL
        ref={deckRef}
        initialViewState={MARINILLA_VIEWSTATE}
        controller
        layers={[
          addressHook.layer,
          closedRedLayer, // Bottom-most layer
          defaultRedLayer,
          closedYellowLayer,
          defaultYellowLayer,
          closedPurpleLayer,
          defaultPurpleLayer, // Top-most layer
          ...(isLocationButtonOn ? [userLocationLayer] : []),
        ]}
        onResize={() => mapRef?.current?.resize()}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        getCursor={({ isDragging, isHovering }) => {
          if (isDragging) return 'grabbing'
          if (isHovering) return 'pointer'
          return 'grab'
        }}
      >
        <MapGl
          ref={mapRef}
          mapStyle={
            'mapbox://styles/escritoriodedados/cm7al4vdb000401qv4kwu71fb'
          }
          mapboxAccessToken={mapboxAccessToken}
          onLoad={() => {
            if (
              addressHook.layerStates.addressMarker &&
              deckRef.current &&
              mapRef.current
            ) {
              flyTo({
                longitude: addressHook.layerStates.addressMarker.longitude,
                latitude: addressHook.layerStates.addressMarker.latitude,
                zoom: 13,
              })
            }
          }}
        />
      </DeckGL>
      {openContextMenu && (
        <ContextMenu
          open={openContextMenu}
          onOpenChange={setOpenContextMenu}
          pickingInfo={pickingInfo}
          equipment={pickingInfo?.object as Equipment}
          distance={distance}
          duration={duration}
        />
      )}
      <div className="absolute-x-center relative top-4 z-10 w-80 sm:w-96">
        <div className="flex gap-2">
          <SearchBox
            isVisible={addressHook.layerStates.isVisible}
            setAddressMarker={addressHook.layerStates.setAddressMarker}
            setIsVisible={addressHook.layerStates.setIsVisible}
            defaultValue={addressHook.layerStates.address}
            setAddress={addressHook.layerStates.setAddress}
            setViewport={flyTo}
            filteredData={filteredData}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="relative shrink-0"
              >
                {Object.values(filters).find((e) => e) && (
                  <div className="absolute right-1 top-1 size-1 rounded-full bg-primary" />
                )}
                <Filter />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="mr-2 flex flex-col gap-1 bg-white text-black">
              {Object.entries(filters).map(([key, value], index) => (
                <div key={index} className="flex items-center gap-2">
                  <Checkbox
                    checked={value}
                    onCheckedChange={() => handleCheckFilter(key as FilterTag)}
                    color={
                      index === 0 ? 'red' : index === 1 ? 'purple' : 'blue'
                    }
                  />
                  <Label
                    onClick={() => handleCheckFilter(key as FilterTag)}
                    className="text-nowrap"
                  >
                    {key}
                  </Label>
                </div>
              ))}
            </PopoverContent>
          </Popover>
          <Button
            variant="secondary"
            size="icon"
            onClick={router.back}
            className="rounded-full p-2"
          >
            <ChevronLeft />
          </Button>
        </div>
        {/* <Search className="absolute-y-center right-14 size-4 text-muted-foreground" /> */}
      </div>
      <div className="fixed bottom-[102px] left-0 right-0 z-50 mx-auto max-w-md">
        <div className="flex justify-end pr-4">
          <div className="block sm:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  className="size-16 rounded-full"
                  onClick={toggleLocationButton}
                >
                  <LocateFixedIcon
                    className={`${isLocationButtonOn ? 'text-black' : 'text-white'} scale-125`}
                  />
                </Button>
              </PopoverTrigger>
              {!userLocation && (
                <PopoverContent side="left" align="center">
                  {shareLocationText}
                </PopoverContent>
              )}
            </Popover>
          </div>
          <div className="hidden sm:block">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="size-16 rounded-full"
                    onClick={toggleLocationButton}
                  >
                    <LocateFixedIcon
                      className={`${isLocationButtonOn ? 'text-black' : 'text-white'} scale-125`}
                    />
                  </Button>
                </TooltipTrigger>
                {!userLocation && (
                  <TooltipContent side="left" align="center">
                    {shareLocationText}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <TabList className="absolute-x-center top-16 w-80 sm:w-96" />
      <FooterNav />
    </div>
  )
}
