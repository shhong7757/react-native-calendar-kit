import { Pressable, StyleSheet, Text } from 'react-native';

import { useCalendarContext } from '../../context/CalendarContext';
import { useCallback } from 'react';

import type { DayComponentProps } from '../../types';

function Day<T>({
  render,
  date,
  metadata,
  events,
  onPress,
}: DayComponentProps<T>): React.JSX.Element {
  const { setSelectedDate, setViewingDate } = useCalendarContext<T>();

  const handlePress = useCallback(() => {
    setSelectedDate(date);
    setViewingDate(date);
    onPress?.(events);
  }, [events, onPress, date, setSelectedDate, setViewingDate]);

  const getTextColor = () => {
    if (metadata?.isSelectedDay) return 'blue';
    if (metadata?.isAdjacentMonth) return 'gray';
    if (metadata?.isSunday) return 'red';
    if (metadata?.isToday) return 'red';
    return 'black';
  };

  const textStyle = {
    color: getTextColor(),
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      {render ? (
        render({ date, events, metadata })
      ) : (
        <Text style={textStyle}>{date.day}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default Day;
