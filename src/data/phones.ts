// src/data/phones.ts
// TODO (datos Marinilla): reemplazar números, títulos e ids por el
// inventario real de líneas de Colombia/Marinilla (123, 155, 122, 141,
// Comisaría de Familia local, etc.). El texto ya está traducido a español.

export interface Phone {
  id: number
  /**
   * Identificador estable (D1 de la revisión técnica). La API lo trae
   * siempre; en los datos estáticos de respaldo lo fijamos a mano para
   * que `setSelectedPhoneCodes` funcione igual con o sin backend.
   */
  code?: string
  number: string
  title: string
  description: string
}

export const phones: Phone[] = [
  {
    id: 190,
    code: 'policia',
    number: '190',
    title: 'Emergencias - Policía',
    description:
      'Si estás viviendo o presenciando una situación de violencia contra una mujer, llama ahora. La atención es las 24 horas.',
  },
  {
    id: 192,
    code: 'emergencias-medicas',
    number: '192',
    title: 'Emergencias Médicas',
    description:
      'Si estás muy lastimada o ves a una mujer que se encuentra en esta situación, llama ahora. La atención es las 24 horas.',
  },
  {
    id: 197,
    code: 'policia-denuncias',
    number: '197',
    title: 'Denuncias - Policía',
    description:
      'Registra casos y denuncias ante la policía. La atención es gratuita y las 24 horas.',
  },
  {
    id: 180,
    code: 'linea-orientacion-mujer',
    number: '180',
    title: 'Violencia contra la Mujer - Línea de orientación',
    description:
      'Ofrece acompañamiento a mujeres en situación de violencia. Atención gratuita y las 24 horas.',
  },
  {
    id: 2122531177,
    code: 'linea-denuncia-anonima',
    number: '(21) 2253-1177',
    title: 'Línea de Denuncia Anónima',
    description:
      'Canal anónimo para denunciar delitos e irregularidades. El servicio es las 24 horas. Protege a las víctimas y colabora con las autoridades. Garantía de confidencialidad.',
  },
  {
    id: 1746,
    code: 'linea-atencion-municipio',
    number: '1746',
    title: 'Línea de Atención del Municipio',
    description:
      'Denuncia casos de acoso y agresiones en el municipio.',
  },
]
