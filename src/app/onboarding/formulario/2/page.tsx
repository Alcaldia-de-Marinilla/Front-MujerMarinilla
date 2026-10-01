'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { HeaderWithReturn } from '@/app/components/header-with-return'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useForm } from '@/context/FormContext'
import { useMap } from '@/context/MapContext'
import { usePhone } from '@/context/PhoneContext'
import { FilterTag } from '@/data/equipments'

const options = [
  {
    id: 1,
    label: 'Ella está triste, asustada y aislada.',
  },
  {
    id: 2,
    label: 'Ella necesita autorización para usar su propio dinero.',
  },
  {
    id: 3,
    label:
      'Vi o ella me contó que la tocaron, acosaron, manosearon o fue objeto de comentarios invasivos.',
  },
  {
    id: 4,
    label: 'Vi marcas de agresión en su cuerpo.',
  },
  {
    id: 5,
    label: 'Ella me contó o sospecho que fue abusada.',
  },
  {
    id: 6,
    label: 'Presencié un intento de asesinato contra una mujer.',
  },
]

const initialCheckedItems = options
  .map((option) => ({ [option.id]: false }))
  .reduce((acc, item) => ({ ...acc, ...item }), {})

export default function Step2() {
  const router = useRouter()
  const { handleCheckFilter, clearFilters, clearDetailedFilters } = useMap()
  const { setSelectedPhoneCodes } = usePhone()
  const { setId } = useForm()
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>(
    initialCheckedItems,
  )

  useEffect(() => {
    clearFilters()
    clearDetailedFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Chama apenas uma vez, na montagem

  const handleClick = (id: number) => {
    setCheckedItems((prev) => {
      return {
        ...prev,
        [id]: !prev[id],
      }
    })
  }

  const handleNextClick = () => {
    if (checkedItems[6] === true) {
      // Configura o ID para 205
      setId(206)
      // Configura os filtros
      handleCheckFilter(FilterTag.DEAM)
      handleCheckFilter(FilterTag.HEALTH)
      handleCheckFilter(FilterTag.WOMAN)

      // Ligar 190
      setSelectedPhoneCodes(['policia', 'emergencias-medicas'])
      router.push('/onboarding/emergencia/2')
    } else if (checkedItems[5] === true) {
      // Configura o ID para 204
      setId(205)

      // Configura o filtro
      handleCheckFilter(FilterTag.HEALTH)
      handleCheckFilter(FilterTag.DEAM)
      handleCheckFilter(FilterTag.WOMAN)

      // Ligar 192
      setSelectedPhoneCodes(['emergencias-medicas'])
      router.push('/onboarding/emergencia/2')
    } else if (checkedItems[4] === true) {
      // Configura o ID para 203
      setId(204)
      handleCheckFilter(FilterTag.HEALTH)
      handleCheckFilter(FilterTag.WOMAN)
      handleCheckFilter(FilterTag.DEAM)
      router.push('/onboarding/encaminhamento/2')
    } else if (checkedItems[3] === true) {
      // Configura o ID para 203
      setId(203)
      handleCheckFilter(FilterTag.WOMAN)
      handleCheckFilter(FilterTag.DEAM)
      router.push('/onboarding/encaminhamento/2')
    } else if (checkedItems[2] === true) {
      // Configura o ID para 202
      setId(202)

      handleCheckFilter(FilterTag.WOMAN)
      handleCheckFilter(FilterTag.DEAM)

      router.push('/onboarding/encaminhamento/2')
    } else if (checkedItems[1] === true) {
      // Configura o ID para 201
      setId(201)

      handleCheckFilter(FilterTag.WOMAN)
      router.push('/onboarding/encaminhamento/2')
    }
  }

  return (
    <div className="flex h-dvh flex-col">
      {/* Encabezado */}
      <div className="flex-shrink-0 px-6">
        <HeaderWithReturn />
      </div>

      {/* Contenido principal desplazable */}
      <div className="flex min-h-0 flex-grow flex-col overflow-auto px-8 pb-6 scrollbar-hide">
        <div className="flex flex-col items-start py-2 text-sm">
          <h1 className="py-4">
            ¿Qué crees que está pasando o qué te contó ella?
          </h1>
          <p className="text-sm leading-5 text-muted-foreground">
            Tranquila, las respuestas son anónimas.
          </p>
          <p className="text-sm leading-5 text-muted-foreground">
            Selecciona las opciones que mejor describen tu caso.
          </p>
        </div>

        {/* Cuestionario */}
        <div className="flex flex-col items-start gap-3 p-4 pl-0">
          {options.map((option) => (
            <div key={option.id} className="flex w-full items-center gap-3">
              <Checkbox
                id={option.id.toString()}
                className="mt-0.5 size-7 rounded-full border-foreground"
                checked={checkedItems[option.id]}
                onCheckedChange={() => handleClick(option.id)}
              />
              <Label htmlFor={option.id.toString()} className="w-full">
                {option.label}
              </Label>
            </div>
          ))}
        </div>

        {/* Botón "¿No sabes qué está pasando?" */}
        <div className="items-left mb-6 mt-10 space-y-2">
          <p className="text-sm leading-5">¿No sabes qué está pasando?</p>
          <Button variant="outline">
            <Link href="/tipos-de-violencia">Haz clic aquí</Link>
          </Button>
        </div>
      </div>

      {/* Botones fijados en la parte inferior */}
      <div className="mt-auto flex flex-col gap-2 px-8 py-4">
        <Button
          className="h-auto w-full p-4"
          onClick={handleNextClick}
          disabled={!Object.values(checkedItems).some((value) => value)}
        >
          Siguiente
        </Button>
        <Button
          className="text-primary underline transition-colors hover:text-primary/80 hover:no-underline"
          variant="link"
          onClick={() => router.push('/infos')}
        >
          Más información
        </Button>
      </div>
    </div>
  )
}
