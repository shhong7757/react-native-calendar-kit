import {
  MonthMap,
  WeekdayMap,
  type CalendarLabels,
  type MonthlyCalendarOptions,
} from './types';

export const DEFAULT_MONTH_LABELS: Record<MonthMap, string> = {
  [MonthMap.JANUARY]: 'Jan',
  [MonthMap.FEBRUARY]: 'Feb',
  [MonthMap.MARCH]: 'Mar',
  [MonthMap.APRIL]: 'Apr',
  [MonthMap.MAY]: 'May',
  [MonthMap.JUNE]: 'Jun',
  [MonthMap.JULY]: 'Jul',
  [MonthMap.AUGUST]: 'Aug',
  [MonthMap.SEPTEMBER]: 'Sep',
  [MonthMap.OCTOBER]: 'Oct',
  [MonthMap.NOVEMBER]: 'Nov',
  [MonthMap.DECEMBER]: 'Dec',
};

export const DEFAULT_WEEKDAY_LABELS: Record<WeekdayMap, string> = {
  [WeekdayMap.MONDAY]: 'Mon',
  [WeekdayMap.TUESDAY]: 'Tue',
  [WeekdayMap.WEDNESDAY]: 'Wed',
  [WeekdayMap.THURSDAY]: 'Thu',
  [WeekdayMap.FRIDAY]: 'Fri',
  [WeekdayMap.SATURDAY]: 'Sat',
  [WeekdayMap.SUNDAY]: 'Sun',
};

export const DEFAULT_CALENDAR_LABELS: CalendarLabels = {
  months: DEFAULT_MONTH_LABELS,
  weekdays: DEFAULT_WEEKDAY_LABELS,
};

export const MONTHLY_CALENDAR_OPTIONS: MonthlyCalendarOptions = {
  showAdjacentDays: false,
  shouldMaintainConsistentRowCount: false,
};

export const DEFAULT_SWIPE_CONFIG = {
  animationDuration: 300,
  threshold: 0.4,
};

export const SWIPE_DIRECTION = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  NONE: 'NONE',
} as const;
