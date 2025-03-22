import {
  Calendar,
  Navigator,
  WeekDayList,
  SwipeableMonthlyCalendar,
  type CalendarEvent,
  useDailyEvents,
  useSetCurrentDate,
} from 'react-native-calendar-kit';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MonthlyEventCounter from '../components/MonthlyEventCounter';

import { useCallback, useState } from 'react';

import type { DayComponentProps } from '../../../src/types';
import MonthControlButton from '../components/MonthControlButton';

type CustomEventType = { text: string };

function CustomDayComponent({
  date,
  onDayPress,
}: DayComponentProps<CustomEventType>) {
  const setCurrentDate = useSetCurrentDate();

  const events = useDailyEvents<CustomEventType>(
    date.year,
    date.month,
    date.day
  );

  const handlePress = useCallback(() => {
    setCurrentDate(date);
    onDayPress?.(events);
  }, [date, events, onDayPress, setCurrentDate]);

  const textStyle = {
    color: date.isAdjacentMonth ? 'gray' : 'black',
  };

  const dayContainerStyle = {
    backgroundColor: events.length > 0 ? 'red' : undefined,
  };

  return (
    <Pressable style={styles.dayButton} onPress={handlePress}>
      <View style={[styles.dayContainer, dayContainerStyle]}>
        <Text style={textStyle}>{date.day}</Text>
        {events.map((event, index) => {
          return <Text key={index.toString()}>{event.data.text}</Text>;
        })}
      </View>
    </Pressable>
  );
}

function SwipeableMonthlyCalendarScreen() {
  const [date, setDate] = useState(new Date());

  const events: Array<CalendarEvent<CustomEventType>> = [
    {
      date: new Date(2025, 0, 27),
      data: { text: 'one' },
      id: '1',
    },
    {
      date: new Date(2025, 1, 16),
      data: { text: 'two' },
      id: '2',
    },
    {
      date: new Date(2025, 2, 3),
      data: { text: 'three' },
      id: '3',
    },
    {
      date: new Date(2025, 2, 3),
      data: { text: 'four' },
      id: '4',
    },
    {
      date: new Date(2025, 2, 3),
      data: { text: 'five' },
      id: '5',
    },
  ];

  const handleIncrementMonth = (value: number) => () =>
    setDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + value);
      return newDate;
    });

  const handleDecrementMonth = (value: number) => () =>
    setDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - value);
      return newDate;
    });

  return (
    <View>
      <Calendar initialDate={date} events={events}>
        <View style={styles.container}>
          <Navigator />
          <MonthlyEventCounter />
          <WeekDayList />
          <SwipeableMonthlyCalendar
            viewportStyle={styles.calendarViewport}
            showAdjacentDays
            shouldMaintainConsistentRowCount
            DayComponent={CustomDayComponent}
          />
        </View>
      </Calendar>
      <View style={styles.buttonList}>
        <View style={styles.buttonListContent}>
          <MonthControlButton text={'+1'} onPress={handleIncrementMonth(1)} />
        </View>
        <View style={styles.buttonListContent}>
          <MonthControlButton text={'+3'} onPress={handleIncrementMonth(3)} />
        </View>
        <View style={styles.buttonListContent}>
          <MonthControlButton text={'+5'} onPress={handleIncrementMonth(5)} />
        </View>
        <View style={styles.buttonListContent}>
          <MonthControlButton text={'-1'} onPress={handleDecrementMonth(1)} />
        </View>
        <View style={styles.buttonListContent}>
          <MonthControlButton text={'-3'} onPress={handleDecrementMonth(3)} />
        </View>
        <View style={styles.buttonListContent}>
          <MonthControlButton text={'-5'} onPress={handleDecrementMonth(5)} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarViewport: { backgroundColor: 'white' },
  container: { backgroundColor: 'white', height: 460 },
  buttonList: {
    marginTop: 8,
    padding: 16,
    flexDirection: 'row',
    backgroundColor: 'white',
    columnGap: 8,
  },
  buttonListContent: { flex: 1 },
  dayButton: { flex: 1, overflow: 'hidden' },
  dayContainer: { flex: 1 },
});

export default SwipeableMonthlyCalendarScreen;
