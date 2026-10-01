// src/http/api/queries.ts
//
// Una función por entidad. Si el backend falla o está apagado, se
// registra el error en la consola del servidor y se devuelven los
// datos estáticos de respaldo (src/data/*.ts), para que la app nunca
// se quede en blanco — crítico en una herramienta de apoyo a víctimas
// de violencia (ver Parte 2, sección 2.1 de la revisión técnica).

import { equipmentTypes as staticEquipmentTypes, type EquipmentType } from '@/data/equipmentsTypes'
import { equipments as staticEquipments, type Equipment } from '@/data/equipments'
import { phones as staticPhones, type Phone } from '@/data/phones'
import { violenceTypes as staticViolenceTypes, type ViolenceType } from '@/data/violenceTypes'

import {
  type ApiEquipment,
  type ApiEquipmentType,
  type ApiPhone,
  type ApiViolenceType,
  toEquipment,
  toEquipmentType,
  toPhone,
  toViolenceType,
} from './adapters'
import { apiGet } from './client'

export async function getPhones(): Promise<Phone[]> {
  try {
    const data = await apiGet<ApiPhone[]>('/phones')
    return data.map(toPhone)
  } catch (error) {
    console.error('[api] usando teléfonos estáticos:', error)
    return staticPhones
  }
}

export async function getViolenceTypes(): Promise<ViolenceType[]> {
  try {
    const data = await apiGet<ApiViolenceType[]>('/violence-types')
    return data.map(toViolenceType)
  } catch (error) {
    console.error('[api] usando tipos de violencia estáticos:', error)
    return staticViolenceTypes
  }
}

export async function getEquipmentTypes(): Promise<EquipmentType[]> {
  try {
    const data = await apiGet<ApiEquipmentType[]>('/equipment-types')
    return data.map(toEquipmentType)
  } catch (error) {
    console.error('[api] usando tipos de unidad estáticos:', error)
    return staticEquipmentTypes
  }
}

export async function getEquipments(): Promise<Equipment[]> {
  try {
    const data = await apiGet<ApiEquipment[]>('/equipments')
    return data.map(toEquipment)
  } catch (error) {
    console.error('[api] usando unidades estáticas:', error)
    return staticEquipments
  }
}

export async function getEquipment(id: number): Promise<Equipment | undefined> {
  try {
    const data = await apiGet<ApiEquipment>(`/equipments/${id}`)
    return toEquipment(data)
  } catch (error) {
    console.error(`[api] usando unidad estática para id=${id}:`, error)
    return staticEquipments.find((e) => e.id === id)
  }
}
