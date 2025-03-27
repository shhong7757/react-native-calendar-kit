import MonthlyCalendar from '../core/MonthlyCalendar';

import { useCalendarContext } from '../../context/CalendarContext';
import { useEffect, useState } from 'react';

import { areDatesEqual } from '../../utils/calendarDate';

import type {
  CalendarEvent,
  CalendarDate,
  DayComponentProps,
  MonthlyCalendarOptions,
} from '../../types';

interface SingleMonthlyCalendarProps<T> {
  monthlyCalendarOptions?: MonthlyCalendarOptions;
  onDayPress?: (events: CalendarEvent<T>[]) => void;
  onMonthChange?: (date: Date) => void;
  DayComponent?: (props: DayComponentProps<T>) => React.JSX.Element;
}

function SingleMonthlyCalendar<T>({
  monthlyCalendarOptions,
  onDayPress,
  onMonthChange,
  DayComponent,
}: SingleMonthlyCalendarProps<T>): React.JSX.Element {
  const { viewingDate, selectedDate } = useCalendarContext();

  const [monthlyCalendarData, setMonthlyCalendarData] =
    useState<CalendarDate>(viewingDate);

  useEffect(() => {
    if (areDatesEqual(viewingDate, monthlyCalendarData)) return;
    setMonthlyCalendarData(viewingDate);
  }, [viewingDate, monthlyCalendarData]);

  useEffect(() => {
    onMonthChange?.(
      new Date(monthlyCalendarData.year, monthlyCalendarData.month - 1, 1)
    );
  }, [monthlyCalendarData, onMonthChange]);

  return (
    <MonthlyCalendar
      viewingDate={monthlyCalendarData}
      selectedDate={selectedDate}
      options={monthlyCalendarOptions}
      onDayPress={onDayPress}
      DayComponent={DayComponent}
    />
  );
}

export default SingleMonthlyCalendar;
