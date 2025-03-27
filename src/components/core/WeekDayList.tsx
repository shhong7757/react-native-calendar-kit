import { StyleSheet, View, type ViewStyle } from 'react-native';
import Weekday from './Weekday';

import { WeekdayMap, type WeekdayProps } from '../../types';

interface WeekdayListProps {
  containerStyle?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  WeekDayComponent?: (props: WeekdayProps) => React.JSX.Element;
}

function WeekdayList({
  containerStyle,
  contentContainerStyle,
  WeekDayComponent,
}: WeekdayListProps): React.JSX.Element {
  return (
    <View style={[styles.container, containerStyle]}>
      {[
        WeekdayMap.SUNDAY,
        WeekdayMap.MONDAY,
        WeekdayMap.TUESDAY,
        WeekdayMap.WEDNESDAY,
        WeekdayMap.THURSDAY,
        WeekdayMap.FRIDAY,
        WeekdayMap.SATURDAY,
      ].map((weekday, index) => {
        return (
          <View
            key={`weekday-list-${index}`}
            style={[styles.weekDay, contentContainerStyle]}
          >
            <Weekday component={WeekDayComponent} weekday={weekday} />
          </View>
        );
      })}
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

export default WeekdayList;
