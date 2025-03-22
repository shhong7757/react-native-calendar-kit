import type { CalendarDate } from '../types';

export const getFirstDayOfMonth = ({ year, month }: CalendarDate): number => {
  return new Date(year, month - 1, 1).getDay();
};

export const getDaysInMonth = ({ year, month }: CalendarDate): number[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

export const createCalendarDate = (date: Date) =>
  ({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }) as CalendarDate;

export const getMonthDifference = (
  date1: CalendarDate,
  date2: CalendarDate
) => {
  const d1Year = date1.year;
  const d2Year = date2.year;
  const d1Month = date1.month;
  const d2Month = date2.month;

  return (d1Year - d2Year) * 12 + (d1Month - d2Month);
};

export function adjustCalendarMonth(
  date: CalendarDate,
  monthOffset: number
): CalendarDate {
  const newMonth = date.month + monthOffset;
  const newYear = date.year + Math.floor((newMonth - 1) / 12);

  return {
    ...date,
    year: newYear,
    month: ((((newMonth - 1) % 12) + 12) % 12) + 1, // 1~12 범위 유지
  };
}

export function isBefore(date1: CalendarDate, date2: CalendarDate): boolean {
  if (date1.year !== date2.year) {
    return date1.year < date2.year;
  }
  if (date1.month !== date2.month) {
    return date1.month < date2.month;
  }
  return date1.day < date2.day;
}

export function isAfter(date1: CalendarDate, date2: CalendarDate): boolean {
  if (date1.year !== date2.year) {
    return date1.year > date2.year;
  }
  if (date1.month !== date2.month) {
    return date1.month > date2.month;
  }
  return date1.day > date2.day;
}

export function isSame(date1: CalendarDate, date2: CalendarDate): boolean {
  return (
    date1.year === date2.year &&
    date1.month === date2.month &&
    date1.day === date2.day
  );
}

export function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
