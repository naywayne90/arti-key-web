import { isWeekend, eachDayOfInterval, format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Liste des jours fériés en Côte d'Ivoire pour 2024
const HOLIDAYS_2024 = [
  '2024-01-01', // Jour de l'an
  '2024-04-01', // Lundi de Pâques
  '2024-05-01', // Fête du Travail
  '2024-05-09', // Lendemain de la Korité (estimation)
  '2024-05-20', // Lundi de Pentecôte
  '2024-06-16', // Lendemain de la Tabaski (estimation)
  '2024-08-07', // Fête de l'Indépendance
  '2024-08-15', // Assomption
  '2024-11-01', // Toussaint
  '2024-11-15', // Journée Nationale de la Paix
  '2024-12-25', // Noël
];

export const isHoliday = (date: Date): boolean => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  return HOLIDAYS_2024.includes(formattedDate);
};

export const calculateWorkingDays = (startDate: Date, endDate: Date): number => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  return days.filter(day => !isWeekend(day) && !isHoliday(day)).length;
};

export const formatDateFr = (date: Date): string => {
  return format(date, 'dd MMMM yyyy', { locale: fr });
};

export const formatPeriod = (startDate: Date, endDate: Date): string => {
  const workingDays = calculateWorkingDays(startDate, endDate);
  return `Du ${formatDateFr(startDate)} au ${formatDateFr(endDate)} (${workingDays} jour${workingDays > 1 ? 's' : ''} ouvrable${workingDays > 1 ? 's' : ''})`;
};
