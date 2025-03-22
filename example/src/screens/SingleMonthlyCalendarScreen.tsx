import { StyleSheet, View } from 'react-native';
import {
  Calendar,
  Navigator,
  SingleMonthlyCalendar,
  WeekDayList,
} from 'react-native-calendar-kit';

function SingleMonthlyCalendarScreen() {
  return (
    <Calendar>
      <View style={styles.container}>
        <Navigator />
        <WeekDayList />
        <SingleMonthlyCalendar />
      </View>
    </Calendar>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', flex: 1 },
});

export default SingleMonthlyCalendarScreen;
