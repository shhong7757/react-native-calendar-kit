import {
  CalendarProvider,
  type CalendarProps,
} from '../../context/CalendarContext';

function Calendar<T>({ children, ...props }: CalendarProps<T>) {
  return <CalendarProvider {...props}>{children}</CalendarProvider>;
}

export default Calendar;
