import { Pressable, StyleSheet, Text } from 'react-native';

import { useCalendarContext } from '../../context/CalendarContext';
import { useCallback } from 'react';

import { getDailyEvents } from '../../utils/event';

import type { DayComponentProps } from '../../types';

function Day<T>({
  component,
  date,
  metadata,
  onPress,
}: DayComponentProps<T>): React.JSX.Element {
  const { eventMap, setSelectedDate } = useCalendarContext<T>();

  const events = getDailyEvents(eventMap, date);

  const handlePress = useCallback(() => {
    setSelectedDate(date);
    onPress?.(events);
  }, [events, onPress, date, setSelectedDate]);

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
      {component ? (
        component({ date, events })
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
