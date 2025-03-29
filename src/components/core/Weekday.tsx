import { StyleSheet, Text } from 'react-native';

import { useCalendarContext } from '../../context/CalendarContext';

import { WeekdayMap, type WeekdayProps } from '../../types';

function Weekday({ render, weekday }: WeekdayProps) {
  const { labels } = useCalendarContext();

  if (render) {
    return render({ weekday });
  }

  return (
    <Text
      style={[
        styles.text,
        weekday === WeekdayMap.SUNDAY && styles.sundayText,
        weekday === WeekdayMap.SATURDAY && styles.saturdayText,
      ]}
    >
      {labels.weekdays[weekday]}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  sundayText: {
    color: '#ff4444',
  },
  saturdayText: {
    color: '#4444ff',
  },
});

export default Weekday;
