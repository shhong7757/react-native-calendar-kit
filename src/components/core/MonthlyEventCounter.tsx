import { useCalendarContext } from '../../../src/context/CalendarContext';

import { getMonthlyEvents } from '../../../src/utils/event';

import type { MonthlyEventCounterProps } from '../../types';

function MonthlyEventCounter({ render }: MonthlyEventCounterProps) {
  const { eventMap, viewingDate } = useCalendarContext();
  const events = getMonthlyEvents(eventMap, viewingDate);

  return render({ count: events.length });
}

export default MonthlyEventCounter;
