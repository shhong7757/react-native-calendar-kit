export type CalendarDate = {
  year: number;
  month: number;
  day: number;
  isAdjacentMonth: boolean;
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

export type CalendarContextType<T> = {
  currentDate: CalendarDate;
  displayedDate: CalendarDate;
  eventMap: CalendarEventMap<T>;
  navigatorEnabled: boolean;
  moveToNextMonth: () => void;
  moveToPrevMonth: () => void;
  setCurrentDate: (day: CalendarDate) => void;
  setDisplayedDate: (day: CalendarDate) => void;
  setNavigatorEnabled: (enabled: boolean) => void;
};

export type DayComponentProps<T> = {
  date: CalendarDate;
  onDayPress?: (events: CalendarEvent<T>[]) => void;
};

export type WeekDayProps = {
  text: string;
};
