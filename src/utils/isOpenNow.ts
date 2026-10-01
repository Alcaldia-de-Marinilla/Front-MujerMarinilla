import { DetailedFilterTag, Equipment, FilterTag } from '@/data/equipments'
import { isHoliday } from '@/utils/holidays'

// Equipamentos que SEMPRE fecham em feriados
const HOLIDAY_CLOSED_EQUIPMENTS = [FilterTag.WOMAN]

// Equipamentos que seguem horários reduzidos no Carnaval
const CARNIVAL_SPECIAL_SCHEDULE = [DetailedFilterTag.CF, DetailedFilterTag.CMS]

export const isOpenNow = (equipment: Equipment): boolean => {
  if (equipment.open_24) return true // Se for 24h, sempre aberto

  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const currentDay = now.getDay() // 0 = Domingo, 6 = Sábado
  const currentHour = now.getHours()

  let openingTime = equipment.openingTime
  let closingTime = equipment.closingTime

  // ✅ Verifica se hoje é feriado
  const isHolidayToday = isHoliday(todayStr)

  // ✅ Se for feriado e o equipamento fecha em feriados, retorna fechado
  if (
    isHolidayToday &&
    HOLIDAY_CLOSED_EQUIPMENTS.includes(equipment.equipmentType)
  ) {
    return false
  }

  // ✅ Ajusta workingDates apenas se existirem e não estiverem vazios
  if (equipment.workingDates && equipment.workingDates.length > 0) {
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    const workedYesterday = equipment.workingDates.includes(yesterdayStr)
    const workedToday = equipment.workingDates.includes(todayStr)

    if (!workedYesterday && !workedToday) {
      return false // Se não trabalhou ontem nem hoje, está fechado
    }

    if (!openingTime) return false
    const [openingHour] = openingTime.split(':').map(Number)

    if (!closingTime) return false
    const [closingHour] = closingTime.split(':').map(Number)

    const openingDate = new Date(now)
    openingDate.setHours(openingHour, 0, 0, 0)

    const closingDate = new Date(now)
    closingDate.setHours(closingHour, 0, 0, 0)
    closingDate.setDate(
      closingDate.getDate() + (closingHour < openingHour ? 1 : 0),
    ) // Ajusta fechamento no dia seguinte

    // ✅ Verifica se ainda está aberto da noite anterior
    if (currentHour < closingHour && workedYesterday && closingHour <= 12) {
      return true // Ainda está aberto do dia anterior
    }

    // ✅ Se hoje é um workingDate, verifica se está dentro do horário normal
    if (workedToday) {
      return now >= openingDate && now <= closingDate
    }
  }

  // ✅ Verifica se equipment.type existe antes de compará-lo
  if (
    todayStr === '2025-02-28' &&
    equipment.type !== undefined &&
    CARNIVAL_SPECIAL_SCHEDULE.includes(equipment.type)
  ) {
    return currentHour >= 8 && currentHour < 12
  }

  // ✅ 01/03 segue horário normal de sábado
  if (
    todayStr === '2025-03-01' &&
    equipment.openingTimeSaturday &&
    equipment.closingTimeSaturday &&
    equipment.type !== undefined &&
    CARNIVAL_SPECIAL_SCHEDULE.includes(equipment.type)
  ) {
    const openingHourSat = parseInt(
      equipment.openingTimeSaturday.split(':')[0],
      10,
    )
    const closingHourSat = parseInt(
      equipment.closingTimeSaturday.split(':')[0],
      10,
    )
    return currentHour >= openingHourSat && currentHour < closingHourSat
  }

  // ✅ 02 a 04 de março → Fechado e abre quarta-feira às 13h
  if (
    (todayStr === '2025-03-02' ||
      todayStr === '2025-03-03' ||
      todayStr === '2025-03-04') &&
    equipment.type !== undefined &&
    CARNIVAL_SPECIAL_SCHEDULE.includes(equipment.type)
  ) {
    return false
  }

  // ✅ 05/03 (Quarta-feira de Cinzas) → Fechado até 13h, depois segue horário normal
  if (todayStr === '2025-03-05') {
    const closingHour = closingTime
      ? parseInt(closingTime.split(':')[0], 10)
      : 0
    return currentHour >= 13 && currentHour < closingHour
  }

  // ✅ Ajusta os horários para sábado e domingo corretamente
  if (currentDay === 6) {
    openingTime = equipment.openingTimeSaturday
    closingTime = equipment.closingTimeSaturday
  } else if (currentDay === 0) {
    openingTime = equipment.openingTimeSunday
    closingTime = equipment.openingTimeSunday
  }

  if (!openingTime || !closingTime) return false

  const [openingHour, openingMinute] = openingTime.split(':').map(Number)
  const [closingHour, closingMinute] = closingTime.split(':').map(Number)

  const openingDate = new Date(now)
  openingDate.setHours(openingHour, openingMinute, 0, 0)

  const closingDate = new Date(now)
  closingDate.setHours(closingHour, closingMinute, 0, 0)

  return now >= openingDate && now <= closingDate
}
