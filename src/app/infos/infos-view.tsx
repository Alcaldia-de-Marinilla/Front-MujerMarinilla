'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import DraggableScroll from '@/components/DraggableScroll'
import FooterNav from '@/components/FooterNav'
import InfoCard from '@/components/InfoCard'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { usePhone } from '@/context/PhoneContext'
import type { EquipmentType } from '@/data/equipmentsTypes'
import type { ViolenceType } from '@/data/violenceTypes'

import { Header } from '../components/header'

interface InfosViewProps {
  equipmentTypes: EquipmentType[]
  violenceTypes: ViolenceType[]
}

export default function InfosView({
  equipmentTypes,
  violenceTypes,
}: InfosViewProps) {
  const router = useRouter()
  const { setSelectedPhoneCodes } = usePhone()

  const handleHelpClick = () => {
    setSelectedPhoneCodes(['policia', 'emergencias-medicas'])
    router.push('/emergencia')
  }

  return (
    <div className="flex min-h-dvh flex-col px-8 py-4 pb-28">
      <Header />

      {/* Tarjeta de emergencia fuera del scroll */}
      <div className="mt-6 flex justify-start pb-2">
        <Card className="flex min-h-44 w-[290px] shrink-0 flex-col bg-primary">
          <CardHeader>
            <CardTitle className="text-white">
              ¿Necesitas ayuda urgente?
            </CardTitle>
          </CardHeader>
          <CardFooter>
            <Button
              className="bg-background/20 px-4 py-2"
              size="sm"
              onClick={handleHelpClick}
            >
              Haz clic aquí
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Sección: Unidades de Atención */}
      <section className="mt-8">
        <Link href="/tipos-de-unidades" className="block w-full">
          <h1 className="break-words text-lg font-semibold leading-tight">
            Conoce qué hace cada unidad de atención
          </h1>
        </Link>
        <div className="-mx-8">
          <DraggableScroll>
            <div className="flex gap-4 px-8">
              {equipmentTypes.map((equipment, index) => (
                <Card
                  key={index}
                  className="flex min-h-44 w-[290px] shrink-0 flex-col justify-between"
                >
                  <CardHeader className="pb-3">
                    <CardTitle>{equipment.abbreviation}</CardTitle>
                    <CardDescription className="m-0 text-base leading-5 text-foreground">
                      {equipment.name}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className="bg-primary px-4 py-2" size="sm">
                      <Link
                        key={index}
                        href={`/tipos-de-unidades?id=${index}`}
                        passHref
                      >
                        Más información
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </DraggableScroll>
        </div>
      </section>

      {/* Sección: Tipos de Violencia */}
      <section className="mt-8">
        <Link href="/tipos-de-violencia" className="block w-full">
          <h1 className="break-words text-lg font-semibold leading-tight">
            Tipos de violencia contra la mujer
          </h1>
        </Link>
        <div className="-mx-8">
          <DraggableScroll>
            <div className="flex gap-4 px-8">
              {violenceTypes.map((type, index) => (
                <InfoCard
                  key={index}
                  index={index}
                  title={type.name}
                  description={type.description}
                />
              ))}
            </div>
          </DraggableScroll>
        </div>
      </section>

      <FooterNav />
    </div>
  )
}
