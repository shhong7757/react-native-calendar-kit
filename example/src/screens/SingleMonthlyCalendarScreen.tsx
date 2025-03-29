import { StyleSheet, View } from 'react-native';
import {
  Calendar,
  Navigator,
  SingleMonthlyCalendar,
  WeekdayList,
} from 'react-native-calendar-kit';
import { MonthlyCalendarNavigator } from '../components';

function SingleMonthlyCalendarScreen() {
  return (
    <Calendar>
      <View style={styles.container}>
        <Navigator render={MonthlyCalendarNavigator} />
        <WeekdayList />
        <SingleMonthlyCalendar />
      </View>
    </Calendar>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1 },
});

export default SingleMonthlyCalendarScreen;
