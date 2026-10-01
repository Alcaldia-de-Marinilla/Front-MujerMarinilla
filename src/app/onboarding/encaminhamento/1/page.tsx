'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { HeaderWithReturn } from '@/app/components/header-with-return'
import { Button } from '@/components/ui/button'
import { useForm } from '@/context/FormContext'
import { encaminhamentoTexts } from '@/data/encaminhamento'

export default function Step3() {
  const router = useRouter()
  const { id } = useForm()
  const currentData = encaminhamentoTexts.find((item) => item.id === id)

  return (
    <div className="flex h-dvh flex-col px-8 py-4">
      {/* Encabezado */}
      <HeaderWithReturn />

      {/* Contenido principal desplazable con scrollbar oculta */}
      <div className="flex min-h-0 flex-grow flex-col overflow-auto pb-6">
        {/* Renderiza el encabezado y el texto según el ID */}
        <h1 className="mt-4">{currentData?.header || 'Información'}</h1>
        <p className="mt-4 text-base text-muted-foreground">
          {currentData?.text ||
            'Detalles no encontrados para el ID proporcionado.'}
        </p>

        {/* Renderiza la imagen solo si existe `currentData.image` */}
        {currentData?.image && (
          <div className="mt-6 flex justify-center p-4">
            <div className="relative h-[200px] w-full max-w-lg md:h-[300px] lg:h-[400px]">
              <Image
                src={`/tipos-de-violencia/${currentData.image}`}
                alt={currentData.name || 'Imagen'}
                layout="fill" // Corregido para garantizar la responsividad
                className="rounded-lg object-contain"
                priority
              />
            </div>
          </div>
        )}
      </div>

      {/* Botones principales posicionados al fondo */}
      <div className="mt-auto flex flex-col gap-2">
        <Button variant="secondary" className="h-auto p-4">
          <Link href="/equipamentos">Encuentra la unidad más cercana</Link>
        </Button>

        <Button variant="secondary" className="h-auto p-4">
          <Link
            href={`/tipos-de-violencia?index=${currentData?.idTipoViolencia ?? ''}`}
          >
            Conoce mejor los tipos de violencia
          </Link>
        </Button>
      </div>

      <div className="w-full text-center">
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
