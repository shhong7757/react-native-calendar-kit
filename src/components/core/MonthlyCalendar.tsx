import { StyleSheet, View } from 'react-native';
import DefaultDayComponent from '../core/Day';

import { createMonthlyCalendarRows } from '../../utils/calendar';

import type {
  CalendarDate,
  CalendarEvent,
  DayComponentProps,
} from '../../types';

import { useMemo } from 'react';

interface MonthlyCalendarProps<CalendarEventDataType> {
  date: CalendarDate;
  shouldMaintainConsistentRowCount?: boolean;
  showAdjacentDays?: boolean;
  DayComponent?: (
    props: DayComponentProps<CalendarEventDataType>
  ) => React.JSX.Element;
  onDayPress?: (events: CalendarEvent<CalendarEventDataType>[]) => void;
}

function MonthlyCalendar<CalendarEventDataType>({
  date,
  showAdjacentDays = false,
  shouldMaintainConsistentRowCount = false,
  onDayPress,
  DayComponent,
}: MonthlyCalendarProps<CalendarEventDataType>): React.JSX.Element {
  const rows = useMemo(
    () =>
      createMonthlyCalendarRows(
        date,
        showAdjacentDays,
        shouldMaintainConsistentRowCount
      ),
    [date, shouldMaintainConsistentRowCount, showAdjacentDays]
  );

  const Day = DayComponent ?? DefaultDayComponent;

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={`monthly-calendar-row-${rowIndex}`} style={styles.row}>
          {row.map((calendarDate, colIndex) => {
            return (
              <View
                key={`monthly-calendar-row-${rowIndex}-col-${colIndex}`}
                style={styles.cell}
              >
                {calendarDate && (
                  <Day date={calendarDate} onDayPress={onDayPress} />
                )}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'column', flex: 1 },
  row: { flex: 1, flexDirection: 'row' },
  cell: { flex: 1 },
});

export default MonthlyCalendar;
