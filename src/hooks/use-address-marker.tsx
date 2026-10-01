import { IconLayer } from '@deck.gl/layers'
import { type Dispatch, type SetStateAction, useState } from 'react'

type AddressMarker = {
  longitude: number
  latitude: number
}

export interface UseAddressMarker {
  layer: IconLayer<AddressMarker, object>
  layerStates: {
    isVisible: boolean
    setIsVisible: Dispatch<SetStateAction<boolean>>
    addressMarker: AddressMarker | null
    setAddressMarker: Dispatch<SetStateAction<AddressMarker | null>>
    address: string
    setAddress: (address: string) => void
  }
}

export function useAddressMarker(): UseAddressMarker {
  const [addressMarker, setAddressMarker] = useState<AddressMarker | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [address, setAddress] = useState('')

  const layer = new IconLayer<AddressMarker>({
    id: 'address-marker-layer',
    data: addressMarker ? [addressMarker] : [],
    getPosition: (info) => [info.longitude, info.latitude],
    pickable: true,
    getColor: [245, 158, 11, 255],
    getSize: 60,
    getIcon: () => ({
      url: '/icons/black-pin.svg',
      width: 100,
      height: 100,
      mask: false,
    }),
    visible: isVisible,
  })

  return {
    layer,
    layerStates: {
      isVisible,
      setIsVisible,
      addressMarker,
      setAddressMarker,
      address,
      setAddress,
    },
  }
}
