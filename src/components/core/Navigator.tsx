import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as React from 'react';

import { useCalendarContext } from '../../context/CalendarContext';

import { adjustCalendarMonth } from '../../utils/date';

function Navigator(): React.JSX.Element {
  const { displayedDate, setDisplayedDate } = useCalendarContext();

  const handlePrevMonthButtonPress = React.useCallback(() => {
    setDisplayedDate(adjustCalendarMonth(displayedDate, -1));
  }, [displayedDate, setDisplayedDate]);

  const handleNextMonthButtonPress = React.useCallback(() => {
    setDisplayedDate(adjustCalendarMonth(displayedDate, +1));
  }, [displayedDate, setDisplayedDate]);

  const title = displayedDate.year + '.' + displayedDate.month;

  return (
    <View style={styles.container}>
      <View style={styles.full}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.buttons}>
        <Pressable onPress={handlePrevMonthButtonPress}>
          <Text style={styles.buttonText}>이전</Text>
        </Pressable>
        <Pressable onPress={handleNextMonthButtonPress}>
          <Text style={styles.buttonText}>다음</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  buttons: {
    flexDirection: 'row',
  },
  buttonText: { color: 'black' },
  full: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
});

export default Navigator;
