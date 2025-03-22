import { ExampleListScreen, SingleMonthlyCalendarScreen } from './screens';

import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SwipeableMonthlyCalendarScreen from './screens/SwipeableMonthlyCalendarScreen';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'ExampleList',
  screens: {
    ExampleList: ExampleListScreen,
    SwipeableMonthlyCalendar: SwipeableMonthlyCalendarScreen,
    SingleMonthlyCalendar: SingleMonthlyCalendarScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
