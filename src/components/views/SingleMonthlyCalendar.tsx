import MonthlyCalendar from '../core/MonthlyCalendar';

import { useCalendarContext } from '../../context/CalendarContext';
import { useEffect, useRef, useState } from 'react';

import { areDatesEqual } from '../../utils/calendarDate';

import type {
  CalendarEvent,
  CalendarDate,
  DayComponentProps,
  MonthlyCalendarOptions,
} from '../../types';

interface SingleMonthlyCalendarProps<T> {
  events?: CalendarEvent<T>[];
  monthlyCalendarOptions?: MonthlyCalendarOptions;
  onDayPress?: (events: CalendarEvent<T>[]) => void;
  onViewingMonthChange?: (date: Date) => void;
  DayComponent?: (props: DayComponentProps<T>) => React.JSX.Element;
}

function SingleMonthlyCalendar<T>({
  events,
  monthlyCalendarOptions,
  onDayPress,
  onViewingMonthChange,
  DayComponent,
}: SingleMonthlyCalendarProps<T>): React.JSX.Element {
  const { addEvent, eventMap, viewingDate, selectedDate } =
    useCalendarContext<T>();

  const [monthlyCalendarData, setMonthlyCalendarData] =
    useState<CalendarDate>(viewingDate);

  const prevEvents = useRef<CalendarEvent<T>[]>();

  useEffect(() => {
    if (events) {
      const prevEventIds = new Set(prevEvents.current?.map((e) => e.id));
      const currentEventIds = new Set(events.map((e) => e.id));

      if (
        prevEventIds.size === currentEventIds.size &&
        [...prevEventIds].every((id) => currentEventIds.has(id))
      ) {
        return;
      }

      addEvent(events);
    }

    prevEvents.current = events;
  }, [events, addEvent]);

  useEffect(() => {
    if (!areDatesEqual(viewingDate, monthlyCalendarData)) {
      setMonthlyCalendarData(viewingDate);
    }
  }, [viewingDate, monthlyCalendarData]);

  useEffect(() => {
    onViewingMonthChange?.(
      new Date(monthlyCalendarData.year, monthlyCalendarData.month - 1, 1)
    );
  }, [monthlyCalendarData, onViewingMonthChange]);

  return (
    <MonthlyCalendar
      eventMap={eventMap}
      viewingDate={monthlyCalendarData}
      selectedDate={selectedDate}
      options={monthlyCalendarOptions}
      onDayPress={onDayPress}
      DayComponent={DayComponent}
    />
  );
}

export default SingleMonthlyCalendar;
