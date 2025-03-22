import { StyleSheet, View, type ViewStyle } from 'react-native';
import type { WeekDayProps } from '../../types';
import DefaultWeekDayComponent from './WeekDay';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface WeekDaysProps {
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  WeekDayComponent?: (props: WeekDayProps) => React.JSX.Element;
}

function WeekDays({
  containerStyle,
  contentContainerStyle,
  WeekDayComponent,
}: WeekDaysProps): React.JSX.Element {
  const WeekDay = WeekDayComponent ?? DefaultWeekDayComponent;

  return (
    <View style={[styles.container, containerStyle]}>
      {WEEKDAYS.map((value) => (
        <View key={value} style={[styles.weekDay, contentContainerStyle]}>
          <WeekDay text={value} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  weekDay: {
    flex: 1,
  },
});

export default WeekDays;
