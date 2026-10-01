'use server'

import axios from 'axios'
import type { FeatureCollection } from 'geojson'

// bounding box para Marinilla y el Oriente Antioqueño:
// [-75.55, 6.00, -75.20, 6.35] (minLon, minLat, maxLon, maxLat).
export async function getPlaces(query: string) {
  const response = await axios.get<FeatureCollection>(
    `https://api.mapbox.com/search/geocode/v6/forward?q=${query}&proximity=ip&bbox=-75.55,6.00,-75.20,6.35&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
  )

  return response.data
}
