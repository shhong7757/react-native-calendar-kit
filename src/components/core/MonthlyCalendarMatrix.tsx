import { StyleSheet, View } from 'react-native';
import Day from '../core/Day';
import * as React from 'react';
import { createMonthlyCalendarMatrix } from '../../utils/monthlyCalendar';
import type { MonthlyCalendarMatrixProps, CalendarCell } from '../../types';
import { MONTHLY_CALENDAR_OPTIONS } from '../../constants';

interface MonthlyCalendarRowProps<T> {
  row: CalendarCell<T>[];
  rowIndex: number;
  DayComponent?: MonthlyCalendarMatrixProps<T>['DayComponent'];
  onDayPress?: MonthlyCalendarMatrixProps<T>['onDayPress'];
}

const MonthlyCalendarRow = React.memo(
  <T,>({
    row,
    rowIndex,
    DayComponent,
    onDayPress,
  }: MonthlyCalendarRowProps<T>) => (
    <View key={`monthly-calendar-row-${rowIndex}`} style={styles.row}>
      {row.map((cell, colIndex) => (
        <View
          key={`monthly-calendar-row-${rowIndex}-col-${colIndex}`}
          style={styles.cell}
        >
          {cell && (
            <Day
              render={DayComponent}
              date={cell[0]}
              metadata={cell[1]}
              events={cell[2]}
              onPress={onDayPress}
            />
          )}
        </View>
      ))}
    </View>
  ),
  (prev, next) => prev.row === next.row
);

const MonthlyCalendarMatrix = <T,>({
  viewingDate,
  selectedDate,
  options,
  eventMap,
  onDayPress,
  DayComponent,
}: MonthlyCalendarMatrixProps<T>): React.JSX.Element => {
  const matrix = React.useMemo(() => {
    return createMonthlyCalendarMatrix(viewingDate, selectedDate, eventMap, {
      ...MONTHLY_CALENDAR_OPTIONS,
      ...options,
    });
  }, [viewingDate, selectedDate, options, eventMap]);

  return (
    <View style={styles.container}>
      {matrix.map((row, rowIndex) => (
        <MonthlyCalendarRow
          key={`monthly-calendar-row-${rowIndex}`}
          row={row}
          rowIndex={rowIndex}
          // TODO: Any를 사용하지 않는 방법 찾기
          DayComponent={DayComponent as any}
          onDayPress={onDayPress as any}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  cell: { flex: 1 },
  container: { flexDirection: 'column', flex: 1 },
  row: { flex: 1, flexDirection: 'row' },
});

const areEqual = <T,>(
  prevProps: MonthlyCalendarMatrixProps<T>,
  nextProps: MonthlyCalendarMatrixProps<T>
) => {
  return (
    prevProps.viewingDate.year === nextProps.viewingDate.year &&
    prevProps.viewingDate.month === nextProps.viewingDate.month &&
    prevProps.viewingDate.day === nextProps.viewingDate.day &&
    prevProps.selectedDate.year === nextProps.selectedDate.year &&
    prevProps.selectedDate.month === nextProps.selectedDate.month &&
    prevProps.selectedDate.day === nextProps.selectedDate.day &&
    prevProps.DayComponent === nextProps.DayComponent &&
    prevProps.onDayPress === nextProps.onDayPress &&
    JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options)
  );
};

export default React.memo(MonthlyCalendarMatrix, areEqual);
