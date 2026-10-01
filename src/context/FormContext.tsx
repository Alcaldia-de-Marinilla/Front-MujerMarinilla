'use client'

import React, { createContext, useContext, useState } from 'react'

interface FormContextProps {
  id: number | null // ID almacenado (puede ser null inicialmente)
  setId: (id: number) => void // Función para actualizar el ID
}

const FormContext = createContext<FormContextProps | null>(null)

export const FormProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [id, setId] = useState<number | null>(null)

  return (
    <FormContext.Provider value={{ id, setId }}>
      {children}
    </FormContext.Provider>
  )
}

export const useForm = () => {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useForm must be used within FormProvider')
  }
  return context
}
