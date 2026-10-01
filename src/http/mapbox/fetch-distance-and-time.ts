'use server'

import axios from 'axios'

export async function fetchDistanceAndTime(
  userLocation: { lat: number; lng: number },
  destination: { lat: number; lng: number },
) {
  const response = await axios.get(
    'https://maps.googleapis.com/maps/api/distancematrix/json',
    {
      params: {
        origins: `${userLocation.lat},${userLocation.lng}`,
        destinations: `${destination.lat},${destination.lng}`,
        key: `${process.env.GOOGLE_MAPS_API_KEY}`,
        mode: 'driving',
      },
    },
  )

  const data = response.data.rows[0].elements[0]
  return {
    distance: data.distance?.text,
    duration: data.duration?.text,
  }
}
