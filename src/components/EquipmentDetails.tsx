'use client'

import { Info, Map, Phone } from 'lucide-react'

import { HeaderWithReturnPaginated } from '@/app/components/header-with-return-paginated'
import { Equipment } from '@/data/equipments'

import FooterNav from './FooterNav'
import StatusIndicator from './StatusIndicator'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

interface EquipmentDetailsProps {
  equipment: Equipment
  currentPage: string
  isFixed?: boolean // New prop to indicate if the card is a fixed equipment card
}

export default function EquipmentDetails({
  equipment,
  isFixed,
  currentPage,
}: EquipmentDetailsProps) {
  const RenderStatus = () => {
    const getPopoverContent = () => {
      return [
        {
          day: 'Lunes',
          opening: equipment.openingTime,
          closing: equipment.closingTime,
        },
        {
          day: 'Martes',
          opening: equipment.openingTime,
          closing: equipment.closingTime,
        },
        {
          day: 'Miércoles',
          opening: equipment.openingTime,
          closing: equipment.closingTime,
        },
        {
          day: 'Jueves',
          opening: equipment.openingTime,
          closing: equipment.closingTime,
        },
        {
          day: 'Viernes',
          opening: equipment.openingTime,
          closing: equipment.closingTime,
        },
        {
          day: 'Sábado',
          opening: equipment.openingTimeSaturday,
          closing: equipment.closingTimeSaturday,
        },
        {
          day: 'Domingo',
          opening: equipment.openingTimeSunday,
          closing: equipment.closingTimeSunday,
        },
      ]
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2">
            {equipment.open_24 ? (
              <div className="font-medium text-green-600">Abierto 24h</div>
            ) : (
              <StatusIndicator equipment={equipment} isFixed={isFixed} />
            )}
            <Info className="h-4 w-4 cursor-pointer" />
          </div>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" className="p-4">
          <ul className="space-y-2">
            {getPopoverContent().map(({ day, opening, closing }) => (
              <li
                key={day}
                className="flex justify-between text-sm font-medium text-muted-foreground"
              >
                <span>{day}</span>
                <span>
                  {equipment.open_24
                    ? 'Abierto 24h'
                    : opening && closing
                      ? `${opening.slice(0, 5)} - ${closing.slice(0, 5)}`
                      : 'No funciona'}
                </span>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    )
  }

  // TODO (datos Marinilla): la lógica de formato de teléfono asume el
  // código de área de Río ('21'). Ajustar al formato colombiano.
  const maskPhoneNumber = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 8 || cleaned.length === 9) {
      cleaned = '21' + cleaned
    }
    return cleaned.length === 11
      ? `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
      : cleaned.length === 10
        ? `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
        : phone
  }

  const handleCopyPhone = async (phone: string) => {
    let plainPhone = phone.replace(/\D/g, '')
    if (plainPhone.length === 8 || plainPhone.length === 9) {
      plainPhone = '21' + plainPhone
    }
    try {
      await navigator.clipboard.writeText(plainPhone)
      alert(`¡Número ${plainPhone} copiado al portapapeles!`)
    } catch (error) {
      console.error('Error al copiar', error)
    }
  }

  return (
    <div className="flex min-h-screen flex-col pb-24">
      {/* Encabezado y contenido principal */}
      <div className="flex flex-grow flex-col gap-11 p-8">
        <div className="flex flex-col gap-4">
          <HeaderWithReturnPaginated currentPage={currentPage} />
          <div className="mt-2">
            <h1>{equipment.name || 'Nombre no disponible'}</h1>
            <RenderStatus />
          </div>
          {(equipment.id === 1275 || equipment.id === 1276) && (
            <div className="flex h-8 w-full items-center justify-center rounded-full bg-primary p-2 text-sm text-white">
              Especial Carnaval
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">
              {(equipment.description ?? 'Descripción no disponible')
                .split(/<br\s*\/?>/)
                .map((line, index) => (
                  <span key={index}>
                    {line}
                    {index <
                      (equipment.description ?? '').split(/<br\s*\/?>/).length -
                        1 && <br />}
                  </span>
                ))}
            </p>
          </div>
        </div>
      </div>

      {/* Botones "Contáctanos" y "¿Cómo llegar?" */}
      <div className="flex flex-col gap-5 px-8 pb-4">
        {equipment.phones && equipment.phones.length > 0 && (
          <div>
            <h3 className="pb-1.5 text-sm font-medium text-muted-foreground">
              Contáctanos
            </h3>
            <div className="flex flex-col gap-2">
              {equipment.phones.map((phone, index) => (
                <Button
                  key={index}
                  className="flex h-auto items-center justify-between gap-2 rounded-xl px-6 py-5"
                  onClick={() => handleCopyPhone(phone)}
                >
                  <span className="font-medium">{maskPhoneNumber(phone)}</span>
                  <Phone className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
        )}

        {equipment.latitude != null && equipment.longitude != null && (
          <div>
            <h3 className="pb-1.5 text-sm font-medium text-muted-foreground">
              ¿Cómo llegar?
            </h3>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="flex h-auto justify-between gap-2 rounded-xl px-4 py-3"
            >
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  `${equipment.latitude},${equipment.longitude}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex flex-col">
                  <span className="text-wrap text-sm leading-6">
                    {equipment.address}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {equipment.neighborhood}, Marinilla
                  </span>
                </div>
                <div>
                  <Map className="size-5 text-foreground" />
                </div>
              </a>
            </Button>
          </div>
        )}
      </div>

      <FooterNav />
    </div>
  )
}
