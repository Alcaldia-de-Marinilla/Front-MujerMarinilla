'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import FooterNav from '@/components/FooterNav'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import type { ViolenceType } from '@/data/violenceTypes'

import { HeaderWithReturn } from '../components/header-with-return'

interface ViolenceTypesPageProps {
  violenceTypes: ViolenceType[]
}

const ViolenceTypesPage = ({ violenceTypes }: ViolenceTypesPageProps) => {
  const [api, setApi] = useState<CarouselApi>()
  const searchParams = useSearchParams()
  const index = searchParams.get('index')

  // Estado para evitar renderizado en SSR y prevenir error de clase de Next.js
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true) // Marca que está en el cliente
    if (index && api) {
      api.scrollTo(Number(index))
    }
  }, [api, index])

  if (!isClient) {
    return null // Evita renderizar en SSR
  }

  const processDescription = (text: string) => {
    return text
      .split(/(<highlight>.*?<\/highlight>)/g) // Splitting by <highlight> tags
      .map((part, index) =>
        part.startsWith('<highlight>') ? (
          <span key={index} className="text-[#AD2E30]">
            {part.replace(/<\/?highlight>/g, '')} {/* Removes the tags */}
          </span>
        ) : (
          part
        ),
      )
  }

  return (
    <div className="flex min-h-screen flex-col px-8 py-4 pb-32">
      <HeaderWithReturn />

      <div className="flex flex-col gap-2 pt-0">
        {/* gap-4 reduce el espaciado general */}
        <h1 className="mt-3 text-left">
          ¿Cuáles son los tipos de violencia contra la mujer?
        </h1>
        <Carousel setApi={setApi} className="mt-0">
          {' '}
          <CarouselContent>
            {violenceTypes.map((type, index) => (
              <CarouselItem key={index} className="flex flex-grow flex-col">
                {/* Descripción siempre arriba con altura fija */}
                <div className="flex min-h-[190px] flex-col justify-start text-left">
                  <h1 className="mt-2">{type.name}</h1>
                  <p
                    aria-label="Descripción"
                    className="mt-1 text-sm text-muted-foreground"
                  >
                    {processDescription(type.description)}
                  </p>
                </div>

                {/* Ejemplos con altura fija */}
                <div className="mt-4 flex min-h-[100px] flex-wrap items-center gap-2">
                  {type.examples?.map((example, i) => (
                    <span
                      key={i}
                      className="inline-block rounded-lg bg-white px-3 py-2 text-xs leading-5 text-muted-foreground"
                    >
                      {example}
                    </span>
                  ))}
                </div>

                {/* El contenedor de la imagen ocupa el espacio restante */}
                <div className="mt-6 flex flex-grow items-end justify-center">
                  <div className="flex w-full max-w-xs items-center justify-center overflow-hidden sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
                    <Image
                      src={`/tipos-de-violencia/${type.image}`}
                      alt={type.name}
                      width={800}
                      height={600}
                      className="h-auto max-h-[250px] w-full rounded-lg object-contain"
                      priority
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Botones debajo de la imagen */}
          <div className="mt-4 flex justify-start gap-3">
            <CarouselPrevious className="hover:bg-primary-dark rounded-full bg-primary-foreground p-2 text-primary">
              <ChevronLeft className="h-6 w-6" />
            </CarouselPrevious>

            <CarouselNext className="hover:bg-primary-dark rounded-full bg-primary-foreground p-2 text-primary">
              <ChevronRight className="h-6 w-6" />
            </CarouselNext>
          </div>
        </Carousel>
      </div>

      {/* Footer siempre al final de la página */}
      <div className="mt-auto">
        <FooterNav />
      </div>
    </div>
  )
}

export default ViolenceTypesPage
