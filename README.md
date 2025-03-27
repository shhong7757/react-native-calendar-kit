# React Native Calendar Kit

A customizable calendar component for React Native with swipe gestures and event support.

## Features

- Monthly calendar view
- Swipe gesture support
- Event counter
- Custom day components
- TypeScript support
- Consistent row count option
- Adjacent days display option

## Installation

```bash
npm install react-native-calendar-kit
# or
yarn add react-native-calendar-kit
```

## Basic Usage

```tsx
import {
  Calendar,
  MonthlyEventCounter,
  Navigator,
  SwipeableMonthlyCalendar,
  WeekdayList,
} from 'react-native-calendar-kit';

function App() {
  return (
    <Calendar initialDate={new Date()}>
      <Navigator />
      <MonthlyEventCounter component={EventCountText} />
      <WeekdayList />
      <SwipeableMonthlyCalendar
        monthlyCalendarOptions={{
          showAdjacentDays: true,
          shouldMaintainConsistentRowCount: true,
        }}
      />
    </Calendar>
  );
}
```

## Components

### Calendar

Root component that provides calendar context.

### SwipeableMonthlyCalendar

Monthly calendar view with swipe gesture support.

### Navigator

Navigation component for month traversal.

### MonthlyEventCounter

Component to display event counts for each date.

### WeekdayList

Component to display weekday headers.

## Props

### Calendar

- `initialDate`: Date - Initial date to display

### SwipeableMonthlyCalendar

- `monthlyCalendarOptions`:
  - `showAdjacentDays`: boolean - Show dates from previous/next months
  - `shouldMaintainConsistentRowCount`: boolean - Maintain consistent number of rows
- `DayComponent`: Custom day component
- `onDayPress`: Day selection event handler
- `onMonthChange`: Month change event handler

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

## License

MIT
