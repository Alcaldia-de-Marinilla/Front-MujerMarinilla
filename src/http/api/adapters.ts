// src/http/api/adapters.ts
//
// Traduce la forma de la API (camelCase, `null` explícito) a las
// interfaces que ya usa el resto del frontend (que usan `undefined`
// para "no hay valor"). Así los componentes existentes no cambian:
// siguen recibiendo Equipment, Phone, ViolenceType, etc.

import type { Equipment, FilterTag, DetailedFilterTag } from '@/data/equipments'
import type { EquipmentType } from '@/data/equipmentsTypes'
import type { Phone } from '@/data/phones'
import type { ViolenceType } from '@/data/violenceTypes'

// null -> undefined (la API usa null para "sin valor"; el frontend usa
// campos opcionales/undefined)
const opt = <T>(value: T | null | undefined): T | undefined =>
  value === null ? undefined : value

// ---------------------------------------------------------------------
// Phone
// ---------------------------------------------------------------------

export interface ApiPhone {
  id: number
  code: string
  number: string
  title: string
  description: string | null
}

export function toPhone(p: ApiPhone): Phone {
  return {
    id: p.id,
    code: p.code,
    number: p.number,
    title: p.title,
    description: p.description ?? '',
  }
}

// ---------------------------------------------------------------------
// ViolenceType
// ---------------------------------------------------------------------

export interface ApiViolenceType {
  id: number
  code: string
  name: string
  description: string | null
  examples: string[] | null
  image: string | null
}

export function toViolenceType(v: ApiViolenceType): ViolenceType {
  return {
    id: v.id,
    name: v.name,
    description: v.description ?? '',
    examples: opt(v.examples),
    image: opt(v.image),
  }
}

// ---------------------------------------------------------------------
// EquipmentType (unit_types en el backend)
// ---------------------------------------------------------------------

export interface ApiEquipmentType {
  id: number
  abbreviation: string
  name: string
  description: string | null
}

export function toEquipmentType(e: ApiEquipmentType): EquipmentType {
  return {
    id: e.id,
    abbreviation: e.abbreviation,
    name: e.name,
    description: e.description ?? '',
  }
}

// ---------------------------------------------------------------------
// Equipment
// ---------------------------------------------------------------------

export interface ApiEquipment {
  id: number
  equipmentType: string
  equipmentCategorySlug: string | null
  type: string | null
  name: string
  abbreviation: string | null
  openingTime: string | null
  closingTime: string | null
  phones: string[]
  description: string | null
  function: string | null
  violenceTypes: string[]
  address: string | null
  neighborhood: string | null
  notes: string | null
  latitude: number | null
  longitude: number | null
  openingTimeSaturday: string | null
  closingTimeSaturday: string | null
  openingTimeSunday: string | null
  closingTimeSunday: string | null
  workingDates: string[]
  open24: boolean
}

export function toEquipment(e: ApiEquipment): Equipment {
  return {
    id: e.id,
    equipmentType: e.equipmentType as FilterTag,
    type: opt(e.type) as DetailedFilterTag | undefined,
    name: e.name,
    abbreviation: opt(e.abbreviation),
    openingTime: opt(e.openingTime),
    closingTime: opt(e.closingTime),
    phones: e.phones,
    description: opt(e.description),
    function: opt(e.function),
    // El frontend guarda violenceTypes como un string libre (histórico);
    // la API ya la modela como lista N:M, así que la unimos.
    violenceTypes: e.violenceTypes.length ? e.violenceTypes.join('; ') : undefined,
    address: opt(e.address),
    neighborhood: opt(e.neighborhood),
    notes: opt(e.notes),
    latitude: opt(e.latitude),
    longitude: opt(e.longitude),
    openingTimeSaturday: opt(e.openingTimeSaturday),
    closingTimeSaturday: opt(e.closingTimeSaturday),
    openingTimeSunday: opt(e.openingTimeSunday),
    closingTimeSunday: opt(e.closingTimeSunday),
    workingDates: e.workingDates,
    open_24: e.open24 ? 1 : 0,
  }
}
