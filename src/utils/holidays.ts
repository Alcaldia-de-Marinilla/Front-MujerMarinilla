const CARNIVAL_DATES = [
  '2025-02-28',
  '2025-03-01',
  '2025-03-02',
  '2025-03-03',
  '2025-03-04',
  '2025-03-05',
]

// TODO (datos Marinilla): reemplazar por los festivos de Colombia y los
// festivos municipales de Marinilla; el carnaval de abajo es de Río.
// Lista fija de festivos municipales y estatales de RJ + nacionales
const RJ_HOLIDAYS: Record<string, string> = {
  '2025-01-01': 'Confraternização Universal', // Feriado nacional
  '2025-01-20': 'Dia de São Sebastião (RJ)', // Feriado municipal RJ
  '2025-03-04': 'Carnaval (RJ)', // Feriado estadual RJ
  '2025-03-05': 'Quarta-feira de Cinzas (pós 12h)', // Ponto facultativo RJ
  '2025-04-18': 'Sexta-feira Santa', // Feriado nacional
  '2025-04-21': 'Tiradentes', // Feriado nacional
  '2025-04-23': 'Dia de São Jorge (RJ)', // Feriado estadual RJ
  '2025-05-01': 'Dia do Trabalho', // Feriado nacional
  '2025-06-19': 'Corpus Christi', // Feriado nacional (observado no RJ)
  '2025-09-07': 'Independência do Brasil', // Feriado nacional
  '2025-10-12': 'Nossa Senhora Aparecida', // Feriado nacional
  '2025-11-02': 'Finados', // Feriado nacional
  '2025-11-15': 'Proclamação da República', // Feriado nacional
  '2025-11-20': 'Dia da Consciência Negra (RJ)', // Feriado estadual RJ
  '2025-12-25': 'Natal', // Feriado nacional
}

// ✅ Función para verificar si hoy es festivo (sin API)
export const isHoliday = (dateStr: string): boolean => {
  return !!RJ_HOLIDAYS[dateStr] || CARNIVAL_DATES.includes(dateStr)
}
