import { areDatesEqual, createCalendarDate, shiftMonth } from './calendarDate';

import type {
  CalendarDate,
  MonthlyCalendarCell,
  MonthlyCalendarMatrix,
  MonthlyCalendarOptions,
  MonthlyCalendarRow,
} from '../types';

const WEEK_DAY_COUNT = 7;

const getFirstDayOfMonth = ({ year, month }: CalendarDate): number => {
  return new Date(year, month - 1, 1).getDay();
};

const getDaysInMonth = ({ year, month }: CalendarDate): number[] => {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    return i + 1;
  });
};

const createMonthlyCalendarCellDate = (
  { year, month }: CalendarDate,
  day: number
) => {
  return { year, month, day };
};

const createMonthlyCalendarCellMetadata = (
  viewingDate: CalendarDate,
  selectedDate: CalendarDate,
  day: number,
  weekDay: number
) => {
  const isSelectedDay = areDatesEqual({ ...viewingDate, day }, selectedDate);
  const isToday = areDatesEqual(
    { ...viewingDate, day },
    createCalendarDate(new Date())
  );

  return {
    isAdjacentMonth: false,
    isSelectedDay,
    isSunday: weekDay % 7 === 0,
    isToday,
  };
};

const createBaseMonthMatrix = (
  viewingDate: CalendarDate,
  selectedDate: CalendarDate
) => {
  const days = getDaysInMonth(viewingDate);
  const firstDayOfMonth = getFirstDayOfMonth(viewingDate);
  const matrix: Array<Array<MonthlyCalendarCell | null>> = [];

  let row = Array(WEEK_DAY_COUNT).fill(null);
  let indexOfDays = 0;

  for (let i = firstDayOfMonth; i < firstDayOfMonth + days.length; i++) {
    const day = days[indexOfDays];
    const indexOfRow = i % WEEK_DAY_COUNT;
    if (day) {
      const date = createMonthlyCalendarCellDate(viewingDate, day);
      const metadata = createMonthlyCalendarCellMetadata(
        viewingDate,
        selectedDate,
        day,
        i % WEEK_DAY_COUNT
      );
      row[indexOfRow] = [date, metadata];
    }

    indexOfDays++;

    if ((i + 1) % WEEK_DAY_COUNT === 0) {
      matrix.push([...row]);
      row = Array(WEEK_DAY_COUNT).fill(null);
    } else if (indexOfDays === days.length) {
      matrix.push([...row]);
    }
  }

  return matrix;
};

const fillPrevMonthDays = (
  row: MonthlyCalendarRow | undefined,
  viewingDate: CalendarDate
) => {
  if (row === undefined) return;

  const lastDayOfPreviousMonth = new Date(
    viewingDate.year,
    viewingDate.month - 1,
    0
  ).getDate();
  const firstDayPosition = row.findIndex((item) => item != null);

  let prevMonthDayStart = lastDayOfPreviousMonth - firstDayPosition + 1;
  for (let i = 0; i < firstDayPosition; i++) {
    const day = prevMonthDayStart + i;
    const viewData = {
      ...shiftMonth(viewingDate, -1),
      day,
    };
    const metadata = { isAdjacentMonth: true };
    row[i] = [viewData, metadata];
  }
};

const fillNextMonthDays = (
  row: MonthlyCalendarRow | undefined,
  viewingDate: CalendarDate
): void => {
  if (row === undefined || row.length === 0) return;

  const { year, month } = shiftMonth(viewingDate, 1);
  const emptySlots = row.filter((cell) => cell === null).length;

  let day = 1;
  for (let i = row.length - emptySlots; i < row.length; i++) {
    const viewData = {
      year,
      month,
      day: day++,
    };
    const metadata = { isAdjacentMonth: true };
    row[i] = [viewData, metadata];
  }
};

export const createMonthlyCalendarMatrix = (
  viewingDate: CalendarDate,
  selectedDate: CalendarDate,
  options: MonthlyCalendarOptions
): MonthlyCalendarMatrix => {
  const { shouldMaintainConsistentRowCount, showAdjacentDays } = options;

  const matrix = createBaseMonthMatrix(viewingDate, selectedDate);

  if (showAdjacentDays) {
    fillPrevMonthDays(matrix[0], viewingDate);
    fillNextMonthDays(matrix[matrix.length - 1], viewingDate);
  }

  if (shouldMaintainConsistentRowCount && matrix.length === 5) {
    matrix.push(Array(7).fill(null));
  }

  return matrix;
};
