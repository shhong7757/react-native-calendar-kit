import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { createCalendarEventMap } from '../utils/event';
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
  labels?: CalendarLabels;
  children: React.ReactNode;
  events?: Array<CalendarEvent<T>>;
  initialDate?: Date;
};

const CalendarContext = createContext<CalendarContextType<unknown> | undefined>(
  undefined
);

export function CalendarProvider<T>({
  children,
  events,
  initialDate = new Date(),
  labels: inputLabels,
}: CalendarProps<T>) {
  const [eventMap, setEventMap] = useState<CalendarEventMap<T>>(new Map());
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

  useEffect(() => {
    if (events === undefined || events.length === 0) return;
    setEventMap(() => createCalendarEventMap(events));
  }, [events]);

  useEffect(() => {
    setViewingDate(selectedDate);
  }, [selectedDate]);

  const value: CalendarContextType<T> = useMemo(
    () => ({
      labels,
      eventMap,
      navigateEnabled,
      selectedDate,
      viewingDate,
      setNavigateEnabled,
      setSelectedDate,
      updateViewingDate,
    }),
    [
      labels,
      eventMap,
      navigateEnabled,
      selectedDate,
      viewingDate,
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
