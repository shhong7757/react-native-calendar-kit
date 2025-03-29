import {
  Calendar,
  MonthlyEventCounter,
  Navigator,
  MonthlyCalendar,
  WeekdayList,
} from 'react-native-calendar-kit';
import { MonthlyCalendarNavigator } from '../components';
import { StyleSheet, Text, View } from 'react-native';

import { useState } from 'react';

function EventCounter({ count }: { count: number }) {
  return <Text>{`event count: ${count}`}</Text>;
}

function MonthlyCalendarExample() {
  const [date] = useState(new Date());

  return (
    <Calendar initialDate={date}>
      <View style={styles.container}>
        <Navigator render={MonthlyCalendarNavigator} />
        <MonthlyEventCounter render={EventCounter} />
        <WeekdayList />
        <MonthlyCalendar
          monthlyCalendarOptions={{
            showAdjacentDays: true,
            shouldMaintainConsistentRowCount: true,
          }}
        />
      </View>
    </Calendar>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', height: 460 },
});

export default MonthlyCalendarExample;
