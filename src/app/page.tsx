'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { usePhone } from '@/context/PhoneContext'

import { Footer } from './components/footer'
import { Header } from './components/header'

export default function Onboarding() {
  const router = useRouter()
  const { setSelectedPhoneCodes } = usePhone()

  const handleHelpClick = () => {
    setSelectedPhoneCodes(['policia', 'emergencias-medicas'])
    router.push('/emergencia')
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Encabezado y texto */}
      <div className="flex-shrink-0 px-8 py-2">
        <Header />
        <div className="flex flex-col items-start py-2 text-sm">
          <h1>¿Tienes miedo? ¿Necesitas ayuda?</h1>
          <p className="mb-0 mt-2 text-base text-muted-foreground">
            Si sientes que estás viviendo una situación de violencia, responde
            algunas preguntas y conoce a qué servicios acudir.
          </p>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="flex min-h-0 flex-grow flex-col justify-between">
        {/* Imagen ajustable */}
        <div className="relative min-h-[100px] w-full flex-grow">
          <Image
            src="/SPM_MULHER_TEM_SAIDA.png"
            alt="Imagen de fondo"
            fill
            className="object-contain"
          />
        </div>

        {/* Botones fijados en la parte inferior */}
        <div className="w-full px-8">
          <div className="flex flex-col items-center gap-2">
            <Button className="h-auto w-full p-4" onClick={handleHelpClick}>
              Emergencia
            </Button>

            <Button
              className="h-auto w-full border border-primary p-4 text-primary"
              variant={'secondary'}
              onClick={() => router.push('/onboarding/formulario/1')}
            >
              Necesito ayuda
            </Button>
            <Button
              className="h-auto w-full border border-primary p-4 text-primary"
              variant={'secondary'}
              onClick={() => router.push('/onboarding/formulario/2')}
            >
              Quiero ayudar a alguien
            </Button>

            <div className="flex w-full flex-col text-center">
              <span
                className="flex min-h-10 cursor-pointer flex-col justify-center p-0 text-sm font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80 hover:no-underline"
                onClick={() => router.push('/infos')}
              >
                Más información
              </span>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
