import { Pressable, StyleSheet, Text } from 'react-native';

import { useCallback } from 'react';

import type { DayComponentProps } from '../../types';
import { useDailyEvents, useSetCurrentDate } from '../../hooks/useCalendar';

function Day<T>({ date, onDayPress }: DayComponentProps<T>): React.JSX.Element {
  const setCurrentDate = useSetCurrentDate();

  const events = useDailyEvents<T>(date.year, date.month, date.day);

  const handlePress = useCallback(() => {
    setCurrentDate(date);
    onDayPress?.(events);
  }, [events, onDayPress, setCurrentDate, date]);

  const textStyle = {
    color: date.isAdjacentMonth ? 'gray' : 'black',
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Text style={textStyle}>{date.day}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default Day;
