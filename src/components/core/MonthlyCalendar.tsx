import { StyleSheet, View } from 'react-native';
import Day from '../core/Day';

import { useMemo } from 'react';

import { createMonthlyCalendarMatrix } from '../../utils/monthlyCalendar';

import type { MonthlyCalendarProps } from '../../types';

import { MONTHLY_CALENDAR_OPTIONS } from '../../constants';

function MonthlyCalendar<T>({
  viewingDate,
  selectedDate,
  options,
  eventMap,
  onDayPress,
  DayComponent,
}: MonthlyCalendarProps<T>): React.JSX.Element {
  const matrix = useMemo(() => {
    return createMonthlyCalendarMatrix(viewingDate, selectedDate, eventMap, {
      ...MONTHLY_CALENDAR_OPTIONS,
      ...options,
    });
  }, [viewingDate, selectedDate, options, eventMap]);

  return (
    <View style={styles.container}>
      {matrix.map((row, rowIndex) => (
        <View key={`monthly-calendar-row-${rowIndex}`} style={styles.row}>
          {row.map((value, colIndex) => {
            return (
              <View
                key={`monthly-calendar-row-${rowIndex}-col-${colIndex}`}
                style={styles.cell}
              >
                {value && (
                  <Day
                    render={DayComponent}
                    date={value[0]}
                    metadata={value[1]}
                    events={value[2]}
                    onPress={onDayPress}
                  />
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
  cell: { flex: 1 },
  container: { flexDirection: 'column', flex: 1 },
  row: { flex: 1, flexDirection: 'row' },
});

export default MonthlyCalendar;
