import type { CalendarDate } from '../types';
import {
  adjustCalendarMonth,
  getDaysInMonth,
  getFirstDayOfMonth,
} from './date';
import dayjs from 'dayjs';

export const createMonthlyCalendarRows = (
  date: CalendarDate,
  showAdjacentDays: boolean
) => {
  const days = getDaysInMonth(date);

  const firstDay = getFirstDayOfMonth(date);
  const calendarRows = createCurrentMonthRows(
    date.year,
    date.month,
    days,
    firstDay
  );

  if (showAdjacentDays) {
    fillPrevMonthDays(calendarRows[0], date.year, date.month);
    fillNextMonthDays(calendarRows[calendarRows.length - 1], date);
  }

  return calendarRows;
};

const createCurrentMonthRows = (
  year: number,
  month: number,
  days: number[],
  firstDay: number
) => {
  const rows: Array<Array<CalendarDate | null>> = [];
  let currentRow = Array(7).fill(null) as Array<CalendarDate | null>;
  let dayIndex = 0;

  for (let i = firstDay; i < firstDay + days.length; i++) {
    currentRow[i % 7] = days[dayIndex]
      ? ({
          day: days[dayIndex++],
          isAdjacentMonth: false,
          month,
          year,
        } as CalendarDate)
      : null;

    if ((i + 1) % 7 === 0 || dayIndex === days.length) {
      if ((i + 1) % 7 === 0) {
        rows.push([...currentRow]);
        currentRow = Array(7).fill(null);
      } else if (dayIndex === days.length) {
        rows.push([...currentRow]);
      }
    }
  }

  return rows;
};

const fillPrevMonthDays = (
  firstRow: (CalendarDate | null)[] | undefined,
  year: number,
  month: number
) => {
  if (firstRow === undefined) return;

  const prevMonthDays = dayjs(`${year}-${month}-01`)
    .subtract(1, 'month')
    .daysInMonth();

  const firstNumberIndex = firstRow.findIndex((item) => item != null);

  let prevMonthDayStart = prevMonthDays - firstNumberIndex + 1;
  for (let i = 0; i < firstNumberIndex; i++) {
    const day = prevMonthDayStart + i;
    firstRow[i] = {
      year,
      month: month - 1, // 이전 달
      day,
      isAdjacentMonth: true,
    } as CalendarDate;
  }
};

const fillNextMonthDays = (
  row: (CalendarDate | null)[] | undefined,
  date: CalendarDate
): void => {
  if (row === undefined || row.length === 0) return;

  const { month, year } = adjustCalendarMonth(date, +1);
  let nextMonthDay = 1;

  for (let colIndex = 0; colIndex < row.length; colIndex++) {
    if (row[colIndex] === null) {
      row[colIndex] = {
        day: nextMonthDay++,
        isAdjacentMonth: true,
        month,
        year,
      };
    }
  }
};
