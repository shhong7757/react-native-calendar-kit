import { ExampleListScreen, MonthlyCalendarExample } from './screens';

import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'ExampleList',
  screens: {
    ExampleList: ExampleListScreen,
    MonthlyCalendar: MonthlyCalendarExample,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
