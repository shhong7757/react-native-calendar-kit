import type { SWIPE_DIRECTION } from './constants';

export type CalendarContextType<T> = {
  eventMap: CalendarEventMap<T>;
  labels: CalendarLabels;
  navigateEnabled: boolean;
  selectedDate: CalendarDate;
  viewingDate: CalendarDate;
  addEvent: (event: CalendarEvent<T> | CalendarEvent<T>[]) => void;
  setNavigateEnabled: (enabled: boolean) => void;
  setSelectedDate: (date: CalendarDate) => void;
  setViewingDate: (date: CalendarDate) => void;
  updateViewingDate: (param: UpdateViewingDateParam) => void;
};

export type CalendarEvent<T> = {
  id: string;
  date: Date;
  data: T;
};

export type CalendarEventMap<T> = Map<
  number,
  Map<number, Map<number, Array<CalendarEvent<T>>>>
>;

export type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

export type CalendarLabels = {
  months: Record<MonthMap, string>;
  weekdays: Record<WeekdayMap, string>;
};

export type DayComponentProps<T> = {
  component?: (props: {
    date: CalendarDate;
    events: CalendarEvent<T>[];
    metadata?: Partial<DayMetadata>;
  }) => React.ReactNode;
  date: CalendarDate;
  events: CalendarEvent<T>[];
  metadata?: Partial<DayMetadata>;
  onPress?: (events: CalendarEvent<T>[]) => void;
};

export type DayMetadata = {
  isAdjacentMonth: boolean;
  isSelectedDay: boolean;
  isSunday: boolean;
  isToday: boolean;
};

export enum MonthMap {
  JANUARY = 0,
  FEBRUARY = 1,
  MARCH = 2,
  APRIL = 3,
  MAY = 4,
  JUNE = 5,
  JULY = 6,
  AUGUST = 7,
  SEPTEMBER = 8,
  OCTOBER = 9,
  NOVEMBER = 10,
  DECEMBER = 11,
}

export type MonthlyCalendarCell = [
  CalendarDate,
  Partial<DayMetadata>,
  CalendarEvent<any>[],
];

export type MonthlyCalendarOptions = {
  shouldMaintainConsistentRowCount: boolean;
  showAdjacentDays: boolean;
};

export type MonthlyCalendarMatrix = Array<MonthlyCalendarRow>;

export type MonthlyCalendarRow = Array<MonthlyCalendarCell | null>;

export type MonthlyCalendarProps<T> = {
  eventMap: CalendarEventMap<T>;
  options?: Partial<MonthlyCalendarOptions>;
  selectedDate: CalendarDate;
  viewingDate: CalendarDate;
  onDayPress?: (events: CalendarEvent<T>[]) => void;
  DayComponent?: (props: DayComponentProps<T>) => React.JSX.Element;
};

export type MonthlyEventCounterProps = {
  component: (props: { count: number }) => React.ReactNode;
};

export type NavigatorRenderProps = {
  monthLabel: string;
  viewingDate: CalendarDate;
  updateViewingDate: (param: UpdateViewingDateParam) => void;
};

export type SwipeableContainerRef = {
  swipe: (direction: SwipeDirectionType) => void;
};

export type SwipeDirectionType =
  (typeof SWIPE_DIRECTION)[keyof typeof SWIPE_DIRECTION];

export type UpdateViewingDateParam =
  | CalendarDate
  | { unit: 'y' | 'm' | 'd'; offset: number };

export enum WeekdayMap {
  MONDAY = 0,
  TUESDAY = 1,
  WEDNESDAY = 2,
  THURSDAY = 3,
  FRIDAY = 4,
  SATURDAY = 5,
  SUNDAY = 6,
}

export type WeekdayProps = {
  component?: (props: { weekday: WeekdayMap }) => React.ReactNode;
  weekday: WeekdayMap;
};
