import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  adjustCalendarMonth,
  createCalendarDate,
  isSameDay,
} from '../utils/date';
import { createCalendarEventMap } from '../utils/event';

import type {
  CalendarContextType,
  CalendarDate,
  CalendarEvent,
  CalendarEventMap,
} from '../types';

export type CalendarProps<CalendarEventDataType> = {
  children: React.ReactNode;
  events?: Array<CalendarEvent<CalendarEventDataType>>;
  initialDate?: Date;
};

const CalendarContext = createContext<CalendarContextType<unknown> | undefined>(
  undefined
);

export function CalendarProvider<CalendarEventDataType>({
  children,
  events,
  initialDate = new Date(),
}: CalendarProps<CalendarEventDataType>) {
  const [currentDate, setCurrentDate] = useState<CalendarDate>({
    ...createCalendarDate(initialDate),
    isAdjacentMonth: false,
  });
  const [displayedDate, setDisplayedDate] = useState<CalendarDate>(currentDate);

  const [eventMap, setEventMap] = useState<
    CalendarEventMap<CalendarEventDataType>
  >(new Map());
  const [navigatorEnabled, setNavigatorEnabled] = useState(true);

  const prevInitialDate = useRef(initialDate);

  const moveToPrevMonth = useCallback(() => {
    if (!navigatorEnabled) return;
    setCurrentDate((prev) => adjustCalendarMonth(prev, -1));
  }, [navigatorEnabled]);

  const moveToNextMonth = useCallback(() => {
    if (!navigatorEnabled) return;
    setCurrentDate((prev) => adjustCalendarMonth(prev, +1));
  }, [navigatorEnabled]);

  useEffect(() => {
    if (!isSameDay(prevInitialDate.current, initialDate)) {
      setCurrentDate(createCalendarDate(initialDate));
      setDisplayedDate(createCalendarDate(initialDate));
      prevInitialDate.current = initialDate;
    }
  }, [initialDate]);

  useEffect(() => {
    if (events === undefined || events.length === 0) return;
    setEventMap(() => createCalendarEventMap(events));
  }, [events]);

  const value: CalendarContextType<CalendarEventDataType> = useMemo(
    () => ({
      currentDate,
      displayedDate,
      eventMap,
      navigatorEnabled,
      moveToNextMonth,
      moveToPrevMonth,
      setCurrentDate,
      setDisplayedDate,
      setNavigatorEnabled,
    }),
    [
      currentDate,
      displayedDate,
      eventMap,
      navigatorEnabled,
      moveToNextMonth,
      moveToPrevMonth,
    ]
  );

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendarContext<CalendarEventDataType>() {
  const context = useContext(
    CalendarContext as React.Context<
      CalendarContextType<CalendarEventDataType> | undefined
    >
  );
  if (!context) {
    throw new Error(
      'useCalendarContext must be used within a CalendarProvider'
    );
  }

  return context;
}
