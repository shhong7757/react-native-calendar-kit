import { getDailyEvents, getMonthlyEvents } from '../utils/event';

import { useCalendarContext } from '../context/CalendarContext';

export function useCurrentDate<T>() {
  return useCalendarContext<T>().currentDate;
}

export function useDailyEvents<T>(year: number, month: number, day: number) {
  const eventMap = useCalendarContext<T>().eventMap;
  return getDailyEvents(eventMap, year, month, day);
}

export function useMonthlyEvents<T>(year: number, month: number) {
  const eventMap = useCalendarContext<T>().eventMap;
  return getMonthlyEvents(eventMap, year, month);
}

export function useSetNavigatorEnabled<T>() {
  return useCalendarContext<T>().setNavigatorEnabled;
}

export function useSetCurrentDate<T>() {
  return useCalendarContext<T>().setCurrentDate;
}
