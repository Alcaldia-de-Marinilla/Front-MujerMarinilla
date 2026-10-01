import { zodResolver } from '@hookform/resolvers/zod'
import type { MapViewState } from 'deck.gl'
import type { Feature } from 'geojson'
import { Search, X } from 'lucide-react'
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Equipment } from '@/data/equipments'
import { getPlaces } from '@/http/mapbox/get-places'
import { cn } from '@/lib/utils'
import { calculateDistance } from '@/utils/calculateDistance'
import { MARINILLA_VIEWSTATE } from '@/utils/types'

type AddressMarker = {
  longitude: number
  latitude: number
}

const searchFormSchema = z.object({
  address: z.string().min(1),
})

type SearchForm = z.infer<typeof searchFormSchema>

interface SearchBoxProps {
  setAddressMarker: Dispatch<SetStateAction<AddressMarker | null>>
  isVisible: boolean
  setIsVisible: Dispatch<SetStateAction<boolean>>
  setViewport: (props: Partial<MapViewState>) => void
  onSubmit?: (props: SearchForm) => void
  placeHolder?: string
  defaultValue?: string
  setAddress: (address: string) => void
  filteredData: Equipment[]
}

export function SearchBox({
  isVisible,
  setAddressMarker,
  setIsVisible,
  setViewport,
  onSubmit,
  defaultValue,
  setAddress,
  placeHolder = 'Ingresa tu punto de partida',
  filteredData,
}: SearchBoxProps) {
  const [suggestions, setSuggestions] = useState<Feature[]>([])
  const [openSuggestions, setOpenSuggestions] = useState(false)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null) // To store the timeout ID

  const { watch, handleSubmit, register, reset, setValue } =
    useForm<SearchForm>({
      resolver: zodResolver(searchFormSchema),
    })

  const address = watch('address')

  useEffect(() => {
    if (!address) {
      setSuggestions([])
      return
    }

    const getData = async (query: string) => {
      try {
        const data = await getPlaces(query)
        const places = data.features
        setSuggestions(places)
      } catch (error) {
        console.error(error)
        setSuggestions([])
      }
    }

    const encodedQuery = encodeURIComponent(address)

    // Clear the previous timeout if there's one pending
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    // Set a new timeout to call the function after 300ms (or any duration you prefer)
    debounceTimeout.current = setTimeout(() => {
      getData(encodedQuery)
    }, 200) // Debounce time in milliseconds (300ms here)

    // Cleanup the timeout when the component is unmounted or address changes
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }, [address])

  useEffect(() => {
    if (defaultValue) {
      setValue('address', defaultValue)
    }
  }, [defaultValue, setValue])

  return (
    <Card
      className={cn(
        'z-50 w-full',
        suggestions.length === 0 || !openSuggestions ? '' : 'rounded-b-none',
      )}
    >
      <form
        onSubmit={onSubmit ? handleSubmit(onSubmit) : undefined}
        onFocus={() => setOpenSuggestions(true)}
        onBlur={() => setOpenSuggestions(false)}
      >
        <div className="relative flex w-full items-center">
          <Search className="absolute left-2 h-4 w-4" />
          <Input
            {...register('address')}
            placeholder={placeHolder}
            className={cn(
              'pl-8 pr-8 focus-visible:ring-0 focus-visible:ring-offset-0',
              suggestions.length === 0 || !openSuggestions
                ? ''
                : 'rounded-b-none',
            )}
            autoComplete="off"
          />
          {isVisible && (
            <Button
              className="absolute right-2 h-5 w-5 p-0"
              variant="ghost"
              onClick={() => {
                reset()
                setAddress('')
                setIsVisible(false)
                setViewport(MARINILLA_VIEWSTATE)
                setAddressMarker(null) // Reset the address marker
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div
          className={cn(
            'flex flex-col p-1',
            !openSuggestions || suggestions.length === 0 ? 'hidden' : '',
          )}
        >
          {suggestions.map((item, index) => {
            return (
              <div
                key={index}
                className="rounded-lg p-2 hover:cursor-default hover:bg-accent"
                onMouseDown={() => {
                  setValue('address', item.properties?.full_address)
                  const coordinates = item.properties?.coordinates
                  const lon = Number(coordinates?.longitude)
                  const lat = Number(coordinates?.latitude)

                  // Find closest equipment
                  const closestEquipment = filteredData.reduce((prev, curr) => {
                    const prevDistance = calculateDistance(
                      lat,
                      lon,
                      prev.latitude ?? 0,
                      prev.longitude ?? 0,
                    )
                    const currDistance = calculateDistance(
                      lat,
                      lon,
                      curr.latitude ?? 0,
                      curr.longitude ?? 0,
                    )
                    return currDistance < prevDistance ? curr : prev
                  })

                  // Fly to closest equipment
                  if (closestEquipment) {
                    setViewport({
                      zoom: 14.15,
                      longitude: closestEquipment.longitude,
                      latitude: closestEquipment.latitude,
                    })
                  }

                  setAddressMarker({
                    longitude: lon,
                    latitude: lat,
                  })
                  setAddress(item.properties?.full_address)
                  setIsVisible(true)
                  setSuggestions([])
                }}
              >
                <span>{item.properties?.full_address}</span>
              </div>
            )
          })}
        </div>
      </form>
    </Card>
  )
}
