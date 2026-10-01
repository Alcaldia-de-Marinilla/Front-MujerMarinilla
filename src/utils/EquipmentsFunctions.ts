// utils/locationHelpers.ts

export const haversineDistance = (
  coords1: [number, number],
  coords2: [number, number],
) => {
  const toRad = (value: number) => (value * Math.PI) / 180
  const R = 6371

  const dLat = toRad(coords2[0] - coords1[0])
  const dLon = toRad(coords2[1] - coords1[1])
  const lat1 = toRad(coords1[0])
  const lat2 = toRad(coords2[0])

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

export const isOpen = (openingTime: string, closingTime: string) => {
  const currentTime = new Date()
  const [openHour, openMinute] = openingTime.split(':').map(Number)
  const [closeHour, closeMinute] = closingTime.split(':').map(Number)

  const openTime = new Date(currentTime)
  openTime.setHours(openHour, openMinute, 0, 0)

  const closeTime = new Date(currentTime)
  closeTime.setHours(closeHour, closeMinute, 0, 0)

  return currentTime >= openTime && currentTime <= closeTime
}
