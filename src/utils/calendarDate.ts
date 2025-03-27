import type { CalendarDate } from '../types';

export const createCalendarDate = (date: Date): CalendarDate => {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

export const areDatesEqual = (target: CalendarDate, compare: CalendarDate) =>
  target.year === compare.year &&
  target.month === compare.month &&
  target.day === compare.day;

export const isDateBefore = (target: CalendarDate, compare: CalendarDate) =>
  target.year < compare.year ||
  (target.year === compare.year && target.month < compare.month) ||
  (target.year === compare.year &&
    target.month === compare.month &&
    target.day < compare.day);

export const isDateAfter = (target: CalendarDate, compare: CalendarDate) =>
  target.year > compare.year ||
  (target.year === compare.year && target.month > compare.month) ||
  (target.year === compare.year &&
    target.month === compare.month &&
    target.day > compare.day);

export const calculateMonthDifference = (
  target: CalendarDate,
  compare: CalendarDate
) => {
  const compareMonth = compare.month;
  const compareYear = compare.year;
  const targetMonth = target.month;
  const targetYear = target.year;

  return (targetYear - compareYear) * 12 + (targetMonth - compareMonth);
};

export const shiftMonth = (
  { year, month }: CalendarDate,
  monthOffset: number
) => {
  const newMonth = month + monthOffset;
  const newYear = year + Math.floor((newMonth - 1) / 12);

  const adjustedMonth = ((((newMonth - 1) % 12) + 12) % 12) + 1;

  return {
    year: newYear,
    month: adjustedMonth,
    day: 1,
  };
};
