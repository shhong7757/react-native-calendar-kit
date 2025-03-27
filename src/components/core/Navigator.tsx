import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as React from 'react';

import { useCalendarContext } from '../../context/CalendarContext';

import { MonthMap } from '../../types';

function Navigator(): React.JSX.Element {
  const { labels, viewingDate, updateViewingDate } = useCalendarContext();

  const handlePrevMonthButtonPress = React.useCallback(() => {
    updateViewingDate({ unit: 'm', offset: -1 });
  }, [updateViewingDate]);

  const handleNextMonthButtonPress = React.useCallback(() => {
    updateViewingDate({ unit: 'm', offset: 1 });
  }, [updateViewingDate]);

  const title = `${viewingDate.year}.${viewingDate.month}`;
  const monthLabel = labels.months[(viewingDate.month - 1) as MonthMap];

  return (
    <View style={styles.container}>
      <View style={[styles.full, styles.header]}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.title}>{monthLabel}</Text>
      </View>
      <View style={styles.buttons}>
        <Pressable onPress={handlePrevMonthButtonPress}>
          <Text style={styles.buttonText}>Prev</Text>
        </Pressable>
        <Pressable onPress={handleNextMonthButtonPress}>
          <Text style={styles.buttonText}>Next</Text>
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
  header: {
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
  },
});

export default Navigator;
