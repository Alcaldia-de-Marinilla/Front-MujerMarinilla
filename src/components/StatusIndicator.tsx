import React, { useEffect, useState } from 'react'

import { DetailedFilterTag, Equipment, FilterTag } from '@/data/equipments'
import { isHoliday } from '@/utils/holidays'
import { isOpenNow } from '@/utils/isOpenNow'

const HOLIDAY_CLOSED_EQUIPMENTS = [FilterTag.WOMAN]

const formatTime = (time?: string) => (time ? time.slice(0, 5) : '')

interface StatusIndicatorProps {
  equipment: Equipment
  isFixed?: boolean
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  equipment,
  isFixed,
}) => {
  const [currentHour, setCurrentHour] = useState<number | null>(null)
  const [todayStr, setTodayStr] = useState<string | null>(null)

  useEffect(() => {
    const now = new Date()
    setTodayStr(now.toISOString().split('T')[0])
    setCurrentHour(now.getHours())
  }, [])

  if (todayStr === null || currentHour === null) {
    return <div className="text-gray-500">Cargando...</div>
  }

  const now = new Date()
  const currentDay = now.getDay()
  const isHolidayToday = isHoliday(todayStr)
  const isOpen = isOpenNow(equipment)
  const isCForCMS =
    equipment.type === DetailedFilterTag.CF ||
    equipment.type === DetailedFilterTag.CMS

  if (isFixed) {
    const isWorkingToday = equipment.workingDates
      ? equipment.workingDates.includes(todayStr)
      : true

    return (
      <div className="flex items-center text-base">
        {isWorkingToday ? (
          isOpen ? (
            <>
              <span className="text-base text-green-600">Abierto</span>
              <span className="ml-2 text-muted-foreground">
                • Especial Carnaval
              </span>
            </>
          ) : (
            <>
              <span className="text-base text-red-500">Cerrado</span>
              {equipment.openingTime && (
                <span className="ml-2 text-muted-foreground">
                  • Abre a las {formatTime(equipment.openingTime)}
                </span>
              )}
            </>
          )
        ) : (
          <>
            <span className="text-base text-red-500">Cerrado</span>
            <span className="ml-2 text-muted-foreground">
              • No funciona hoy
            </span>
          </>
        )}
      </div>
    )
  }

  if (equipment.open_24) {
    return <div className="text-base text-green-600">Abierto 24h</div>
  }

  if (
    isHolidayToday &&
    HOLIDAY_CLOSED_EQUIPMENTS.includes(equipment.equipmentType)
  ) {
    return (
      <div className="text-base text-red-500">
        Cerrado<span className="ml-2 text-muted-foreground">• Festivo</span>
      </div>
    )
  }

  // TODO (datos Marinilla): este bloque usa fechas y horarios especiales
  // del Carnaval de Río; revisar/eliminar para Marinilla.
  if (isCForCMS && (todayStr === '2025-02-27' || todayStr === '2025-02-28')) {
    if (currentHour < 8) {
      return (
        <div className="text-base text-red-500">
          Cerrado{' '}
          <span className="ml-2 text-muted-foreground">• Abre a las 08:00</span>
        </div>
      )
    }

    if (currentHour >= 8 && currentHour < 12) {
      return (
        <div className="text-base text-green-600">
          Abierto{' '}
          <span className="ml-2 text-muted-foreground">
            • Horario especial: 08:00 a 12:00
          </span>
        </div>
      )
    }

    return (
      <div className="text-base text-red-500">
        Cerrado{' '}
        <span className="ml-2 text-muted-foreground">
          • Abre{' '}
          {formatTime(equipment.openingTimeSaturday) ||
            'el miércoles a las 13:00'}
        </span>
      </div>
    )
  }

  if (isCForCMS && todayStr === '2025-03-01') {
    return isOpen ? (
      <div className="text-base text-green-600">
        Abierto{' '}
        <span className="ml-2 text-muted-foreground">
          • Cierra a las {formatTime(equipment.closingTimeSaturday)}
        </span>
      </div>
    ) : (
      <div className="text-base text-red-500">
        Cerrado{' '}
        <span className="ml-2 text-muted-foreground">
          • Abre el miércoles a las 13:00
        </span>
      </div>
    )
  }

  if (
    isCForCMS &&
    (todayStr === '2025-03-02' ||
      todayStr === '2025-03-03' ||
      todayStr === '2025-03-04')
  ) {
    return (
      <div className="text-base text-red-500">
        Cerrado{' '}
        <span className="ml-2 text-muted-foreground">
          • Abre el miércoles a las 13:00
        </span>
      </div>
    )
  }

  let nextOpeningTime = ''

  if (!isOpen && equipment.workingDates) {
    const sortedWorkingDates = [...equipment.workingDates].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime(),
    )

    const nextOpeningDate = sortedWorkingDates.find((date) => date > todayStr)

    if (nextOpeningDate) {
      const nextDate = new Date(nextOpeningDate)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      if (
        nextDate.toISOString().split('T')[0] ===
        tomorrow.toISOString().split('T')[0]
      ) {
        nextOpeningTime = equipment.openingTime
          ? `Abre mañana a las ${formatTime(equipment.openingTime)}`
          : ''
      } else {
        nextOpeningTime = `Abre el ${nextDate.getDate()}/${nextDate.getMonth() + 1}`
      }
    }
  }

  if (
    !isOpen &&
    currentDay === 5 &&
    !equipment.openingTimeSaturday &&
    !equipment.workingDates
  ) {
    nextOpeningTime = equipment.openingTime
      ? `Abre el lunes a las ${formatTime(equipment.openingTime)}`
      : ''
  } else if (
    !isOpen &&
    !equipment.workingDates &&
    currentDay === 5 &&
    equipment.openingTimeSaturday
  ) {
    nextOpeningTime = `Abre a las ${formatTime(equipment.openingTimeSaturday)}`
  }

  if (
    !isOpen &&
    !equipment.workingDates &&
    currentDay === 6 &&
    !equipment.openingTimeSunday
  ) {
    nextOpeningTime = equipment.openingTime
      ? `Abre el lunes a las ${formatTime(equipment.openingTime)}`
      : ''
  } else if (
    !isOpen &&
    !equipment.workingDates &&
    currentDay === 6 &&
    equipment.openingTimeSunday
  ) {
    nextOpeningTime = `Abre a las ${formatTime(equipment.openingTimeSunday)}`
  } else nextOpeningTime = `Abre a las ${formatTime(equipment.openingTime)}`

  return (
    <div className="flex flex-col text-base">
      <div
        className={`flex items-center ${isOpen ? 'text-green-600' : 'text-red-500'}`}
      >
        <span>{isOpen ? 'Abierto' : 'Cerrado'}</span>
        {nextOpeningTime && (
          <span className="ml-2 text-muted-foreground">
            • {nextOpeningTime}
          </span>
        )}
      </div>

      {isHolidayToday && isCForCMS && (
        <div className="text-sm text-yellow-500">
          ⚠️ Festivo: los horarios pueden variar
        </div>
      )}
    </div>
  )
}

export default StatusIndicator
