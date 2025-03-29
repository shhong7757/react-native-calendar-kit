import { areDatesEqual, createCalendarDate, shiftMonth } from './calendarDate';

import type {
  CalendarCell,
  CalendarDate,
  CalendarEventMap,
  MonthlyCalendarOptions,
} from '../types';
import { getDailyEvents } from './event';

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

const createBaseMonthMatrix = <T extends null>(
  viewingDate: CalendarDate,
  selectedDate: CalendarDate,
  eventMap: CalendarEventMap<T>
) => {
  const days = getDaysInMonth(viewingDate);
  const firstDayOfMonth = getFirstDayOfMonth(viewingDate);
  const matrix: Array<Array<CalendarCell | null>> = [];

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
      const events = getDailyEvents(eventMap, date);
      row[indexOfRow] = [date, metadata, events];
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
  row: (CalendarCell | null)[] | undefined,
  viewingDate: CalendarDate,
  eventMap: CalendarEventMap<any>
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
    const events = getDailyEvents(eventMap, viewData);
    row[i] = [viewData, metadata, events];
  }
};

const fillNextMonthDays = (
  row: (CalendarCell | null)[] | undefined,
  viewingDate: CalendarDate,
  eventMap: CalendarEventMap<any>
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
    const events = getDailyEvents(eventMap, viewData);
    row[i] = [viewData, metadata, events];
  }
};

export const createMonthlyCalendarMatrix = (
  viewingDate: CalendarDate,
  selectedDate: CalendarDate,
  eventMap: CalendarEventMap<any>,
  options: MonthlyCalendarOptions
): (CalendarCell | null)[][] => {
  const { shouldMaintainConsistentRowCount, showAdjacentDays } = options;

  const matrix = createBaseMonthMatrix(viewingDate, selectedDate, eventMap);

  if (showAdjacentDays) {
    fillPrevMonthDays(matrix[0], viewingDate, eventMap);
    fillNextMonthDays(matrix[matrix.length - 1], viewingDate, eventMap);
  }

  if (shouldMaintainConsistentRowCount && matrix.length === 5) {
    matrix.push(Array(7).fill(null));
  }

  return matrix;
};
