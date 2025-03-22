import dayjs from 'dayjs';
import { adjustCalendarMonth, createCalendarDateFromDayjs } from './date';
import type { CalendarDate, CalendarEvent, CalendarEventMap } from '../types';

export const createCalendarEventMap = <CalendarEventDataType>(
  events: Array<CalendarEvent<CalendarEventDataType>>
) => {
  const newData = new Map();

  events.forEach(({ date, data, id }) => {
    const currentDate = dayjs(date);
    if (!currentDate.isValid()) return;

    const { year, month, day } = createCalendarDateFromDayjs(currentDate);

    const yearMap = newData.get(year) ?? new Map();
    newData.set(year, yearMap);

    const monthMap = yearMap.get(month) ?? new Map();
    yearMap.set(month, monthMap);

    const dayList = monthMap.get(day) ?? [];
    monthMap.set(day, [...dayList, { date: currentDate, data, id }]);
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

export const getDailyEvents = <CalendarEventDataType>(
  eventMap: CalendarEventMap<CalendarEventDataType>,
  year: number,
  month: number,
  day: number
): Array<CalendarEvent<CalendarEventDataType>> => {
  return getNestedMapData(eventMap, year, month, day);
};

export const getMonthlyEvents = <T>(
  eventMap: CalendarEventMap<T>,
  year: number,
  month: number
): Array<CalendarEvent<T>> => {
  return getNestedMapData(eventMap, year, month);
};

export function createMonthBuffer(date: CalendarDate, bufferSize: number) {
  const totalLength = bufferSize * 2 + 1;
  const dateArray: CalendarDate[] = new Array(totalLength);

  const centerIndex = bufferSize;
  dateArray[centerIndex] = date;

  for (let i = 1; i <= bufferSize; i++) {
    dateArray[centerIndex - i] = adjustCalendarMonth(date, -1 * i);
  }

  for (let i = 1; i <= bufferSize; i++) {
    dateArray[centerIndex + i] = adjustCalendarMonth(date, i);
  }

  return dateArray;
}
