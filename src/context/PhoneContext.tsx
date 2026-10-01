// src/context/PhoneContext.tsx

'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

import { Phone } from '@/data/phones'

interface PhoneContextType {
  selectedPhones: Phone[]
  /**
   * Selecciona teléfonos por `code` (identificador estable de la API,
   * ej. "policia", "emergencias-medicas") en vez de por `id` numérico:
   * el `id` autoincrement de la API cambia cada vez que se re-siembra
   * la base de datos, así que ya no sirve como referencia fija
   * (ver Parte 2, Paso 7 de la revisión técnica del 16-sept).
   */
  setSelectedPhoneCodes: (codes: string[]) => void
}

const PhoneContext = createContext<PhoneContextType | undefined>(undefined)

export const PhoneProvider = ({
  children,
  phones,
}: {
  children: ReactNode
  /** Teléfonos ya resueltos por el servidor (API o respaldo estático). */
  phones: Phone[]
}) => {
  const [selectedPhones, setSelectedPhones] = useState<Phone[]>([])

  const setSelectedPhoneCodes = (codes: string[]) => {
    const filtered = phones.filter(
      (phone) => phone.code && codes.includes(phone.code),
    )
    setSelectedPhones(filtered)
  }

  return (
    <PhoneContext.Provider value={{ selectedPhones, setSelectedPhoneCodes }}>
      {children}
    </PhoneContext.Provider>
  )
}

export const usePhone = () => {
  const context = useContext(PhoneContext)
  if (!context) {
    throw new Error('usePhone must be used within a PhoneProvider')
  }
  return context
}
