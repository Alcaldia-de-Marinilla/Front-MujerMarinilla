import type { PickingInfo } from '@deck.gl/core'

export enum layers {
  equipments = 'equipments',
}

export type ContextMenuLayer = {
  id: string
  component: React.FC<{ pickingInfo: PickingInfo }>
}

export const MARINILLA_VIEWSTATE = {
  longitude: -75.3375,
  latitude: 6.1739,
  zoom: 13,
}
