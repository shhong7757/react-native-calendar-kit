import MonthlyCalendar from '../core/MonthlyCalendar';

import type { CalendarEvent, DayComponentProps } from '../../types';
import { useCalendarContext } from '../../context/CalendarContext';

interface SingleMonthlyCalendarProps<CalendarEventDataType> {
  onDayPress?: (events: CalendarEvent<CalendarEventDataType>[]) => void;
  DayComponent?: (
    props: DayComponentProps<CalendarEventDataType>
  ) => React.JSX.Element;
}

function SingleMonthlyCalendar<CalendarEventDataType>({
  onDayPress,
  DayComponent,
}: SingleMonthlyCalendarProps<CalendarEventDataType>): React.JSX.Element {
  const { displayedDate } = useCalendarContext();

  return (
    <MonthlyCalendar
      date={displayedDate}
      shouldMaintainConsistentRowCount
      showAdjacentDays
      onDayPress={onDayPress}
      DayComponent={DayComponent}
    />
  );
}

export default SingleMonthlyCalendar;
