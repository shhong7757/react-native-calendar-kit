import {
  Calendar,
  Navigator,
  SwipeableMonthlyCalendar,
  WeekdayList,
} from 'react-native-calendar-kit';
import { StyleSheet, View } from 'react-native';
import MonthlyEventCounter from '../components/MonthlyEventCounter';

import { useState } from 'react';

function SwipeableMonthlyCalendarScreen() {
  const [date] = useState(new Date());

  return (
    <Calendar initialDate={date}>
      <View style={styles.container}>
        <Navigator />
        <MonthlyEventCounter />
        <WeekdayList />
        <SwipeableMonthlyCalendar
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

export default SwipeableMonthlyCalendarScreen;
