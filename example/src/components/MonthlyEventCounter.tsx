import { StyleSheet, Text, View } from 'react-native';

import { useCalendarContext } from '../../../src/context/CalendarContext';

import { getMonthlyEvents } from '../../../src/utils/event';

function MonthlyEventCounter() {
  const { eventMap, viewingDate } = useCalendarContext();
  const events = getMonthlyEvents(eventMap, viewingDate);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text>{'Event Count: '}</Text>
        <Text style={styles.countText}>{events.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row' },
  container: { backgroundColor: 'white' },
  countText: { fontWeight: 'bold' },
});

export default MonthlyEventCounter;
