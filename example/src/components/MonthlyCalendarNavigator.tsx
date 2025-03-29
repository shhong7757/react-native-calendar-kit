import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NavigatorRenderProps } from 'react-native-calendar-kit';

const MonthlyCalendarNavigator = ({
  monthLabel,
  viewingDate,
  updateViewingDate,
}: NavigatorRenderProps) => {
  const text = `${monthLabel} ${viewingDate.year} ${viewingDate.month}`;

  const handlePrevMonthButtonPress = () => {
    updateViewingDate({ unit: 'm', offset: -1 });
  };

  const handleNextMonthButtonPress = () => {
    updateViewingDate({ unit: 'm', offset: 1 });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.full, styles.header]}>
        <Text style={styles.title}>{text}</Text>
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
};

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

export default MonthlyCalendarNavigator;
