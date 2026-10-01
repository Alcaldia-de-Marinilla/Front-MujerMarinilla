import { useState } from 'react'

export function useAddressSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  // Coordenadas iniciales: Marinilla, Antioquia [lat, lon].
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    6.1739, -75.3375,
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSearch = async (
    onSuccess: (coords: [number, number], shortAddress: string) => void,
  ) => {
    if (searchQuery.trim() === '') return

    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const { lat, lon, display_name: address } = data[0]
        const searchCoords: [number, number] = [
          parseFloat(lat),
          parseFloat(lon),
        ]

        // Extrae el nombre corto con las dos primeras partes (ej.: "Calle X, Barrio Y")
        const addressParts = address.split(',')
        const shortAddress = addressParts.slice(0, 2).join(', ').trim() // Une las dos primeras partes

        setMapCenter(searchCoords)
        onSuccess(searchCoords, shortAddress) // Pasa el nombre corto al callback
      } else {
        setErrorMessage('Ubicación no encontrada.')
      }
    } catch (error) {
      console.error('Error al buscar la ubicación:', error)
      setErrorMessage('Ocurrió un error al buscar la ubicación.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    searchQuery,
    setSearchQuery,
    mapCenter,
    isLoading,
    errorMessage,
    handleSearch,
  }
}
