import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { createCalendarEventMap, getAllEvents } from '../utils/event';
import { createCalendarDate } from '../utils/calendarDate';

import { DEFAULT_CALENDAR_LABELS } from '../constants';

import type {
  CalendarContextType,
  CalendarDate,
  CalendarEvent,
  CalendarEventMap,
  CalendarLabels,
  UpdateViewingDateParam,
} from '../types';

export type CalendarProps<T> = {
  children: React.ReactNode;
  initialDate?: Date;
  initialEvents?: Array<CalendarEvent<T>>;
  labels?: CalendarLabels;
  onEventChange?: (events: CalendarEvent<T>[]) => void;
};

const CalendarContext = createContext<CalendarContextType<any> | undefined>(
  undefined
);

export function CalendarProvider<T>({
  children,
  initialEvents = [],
  initialDate = new Date(),
  labels: inputLabels,
  onEventChange,
}: CalendarProps<T>) {
  const [eventMap, setEventMap] = useState<CalendarEventMap<T>>(
    createCalendarEventMap(initialEvents)
  );
  const [navigateEnabled, setNavigateEnabled] = useState(true);
  const [selectedDate, setSelectedDate] = useState<CalendarDate>(
    createCalendarDate(initialDate)
  );
  const [viewingDate, setViewingDate] = useState<CalendarDate>(
    createCalendarDate(initialDate)
  );

  const labels = useMemo<CalendarLabels>(
    () => ({
      ...DEFAULT_CALENDAR_LABELS,
      ...inputLabels,
    }),
    [inputLabels]
  );

  const addEvent = useCallback(
    (event: CalendarEvent<T> | CalendarEvent<T>[]) => {
      const events = Array.isArray(event) ? event : [event];

      setEventMap((prevEventMap) => {
        const newEventMap = new Map(prevEventMap);

        events.forEach((e) => {
          const { date, data, id } = e;
          const { year, month, day } = createCalendarDate(date);

          const yearMap = newEventMap.get(year) ?? new Map();
          newEventMap.set(year, yearMap);

          const monthMap = yearMap.get(month) ?? new Map();
          yearMap.set(month, monthMap);

          const dayList = monthMap.get(day) ?? [];
          if (dayList.find((ev: CalendarEvent<T>) => ev.id === id)) return;
          monthMap.set(day, [...dayList, { date, data, id }]);
        });

        onEventChange?.(getAllEvents(newEventMap));

        return newEventMap;
      });
    },
    [onEventChange]
  );

  const updateViewingDate = useCallback(
    (param: UpdateViewingDateParam) => {
      if ('unit' in param) {
        const { year, month, day } = viewingDate;
        const oldDate = new Date(year, month - 1, day);
        let newDate: Date;
        switch (param.unit) {
          case 'y':
            newDate = new Date(
              oldDate.getFullYear() + param.offset,
              oldDate.getMonth(),
              1
            );
            break;
          case 'm':
            newDate = new Date(
              oldDate.getFullYear(),
              oldDate.getMonth() + param.offset,
              1
            );
            break;
          case 'd':
            newDate = new Date(
              oldDate.getFullYear(),
              oldDate.getMonth(),
              oldDate.getDate() + param.offset
            );
            break;
        }

        if (!isNaN(newDate.getTime())) {
          setViewingDate(createCalendarDate(newDate));
        } else {
          console.error('Invalid date calculation');
        }
      } else {
        setViewingDate(param);
      }
    },
    [viewingDate]
  );

  const value: CalendarContextType<T> = useMemo(
    () => ({
      labels,
      eventMap,
      navigateEnabled,
      selectedDate,
      viewingDate,
      addEvent,
      setNavigateEnabled,
      setSelectedDate,
      setViewingDate,
      updateViewingDate,
    }),
    [
      labels,
      eventMap,
      navigateEnabled,
      selectedDate,
      viewingDate,
      addEvent,
      updateViewingDate,
    ]
  );

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendarContext<T>() {
  const context = useContext(
    CalendarContext as React.Context<CalendarContextType<T> | undefined>
  );
  if (!context) {
    throw new Error(
      'useCalendarContext must be used within a CalendarProvider'
    );
  }

  return context;
}
