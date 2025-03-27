import { StyleSheet, View } from 'react-native';
import {
  Calendar,
  Navigator,
  SingleMonthlyCalendar,
  WeekdayList,
} from 'react-native-calendar-kit';

function SingleMonthlyCalendarScreen() {
  return (
    <Calendar>
      <View style={styles.container}>
        <Navigator />
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
