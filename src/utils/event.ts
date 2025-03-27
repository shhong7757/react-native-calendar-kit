import { createCalendarDate } from './calendarDate';

import type { CalendarEvent, CalendarEventMap, CalendarDate } from '../types';

export const createCalendarEventMap = <CalendarEventDataType>(
  events: Array<CalendarEvent<CalendarEventDataType>>
) => {
  const newData = new Map();

  events.forEach(({ date, data, id }) => {
    const { year, month, day } = createCalendarDate(date);

    const yearMap = newData.get(year) ?? new Map();
    newData.set(year, yearMap);

    const monthMap = yearMap.get(month) ?? new Map();
    yearMap.set(month, monthMap);

    const dayList = monthMap.get(day) ?? [];
    monthMap.set(day, [...dayList, { date, data, id }]);
  });

  return newData;
};

const flattenCalendarEventMap = <CalendarEventDataType>(
  eventMap: Map<any, any> | Array<CalendarEvent<CalendarEventDataType>> | any
): Array<CalendarEvent<CalendarEventDataType>> => {
  if (Array.isArray(eventMap)) {
    return eventMap;
  }

  if (!(eventMap instanceof Map)) {
    return [];
  }

  let result: Array<CalendarEvent<CalendarEventDataType>> = [];

  for (const collection of eventMap.values()) {
    if (Array.isArray(collection)) {
      result = result.concat(collection);
    } else if (collection instanceof Map) {
      result = result.concat(flattenCalendarEventMap(collection));
    }
  }

  return result;
};

export const getNestedMapData = <CalendarEventDataType>(
  eventMap: CalendarEventMap<CalendarEventDataType>,
  ...keys: number[]
): Array<CalendarEvent<CalendarEventDataType>> => {
  if (!eventMap || eventMap.size === 0) return [];

  let currentMap: any = eventMap;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (!currentMap || !(currentMap instanceof Map) || !currentMap.has(key)) {
      return [];
    }

    currentMap = currentMap.get(key);

    if (i === keys.length - 1) {
      return Array.isArray(currentMap)
        ? currentMap
        : flattenCalendarEventMap(currentMap);
    }
  }
  return flattenCalendarEventMap(currentMap);
};

export const getDailyEvents = <T>(
  eventMap: CalendarEventMap<T>,
  { year, month, day }: CalendarDate
): Array<CalendarEvent<T>> => {
  return getNestedMapData(eventMap, year, month, day);
};

export const getMonthlyEvents = <T>(
  eventMap: CalendarEventMap<T>,
  { year, month }: CalendarDate
): Array<CalendarEvent<T>> => {
  return getNestedMapData(eventMap, year, month);
};
