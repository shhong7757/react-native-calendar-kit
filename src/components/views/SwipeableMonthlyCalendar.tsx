import MonthlyCalendar from '../core/MonthlyCalendar';
import React, { useEffect, useState, useRef, useCallback } from 'react';

import { useCalendarContext } from '../../context/CalendarContext';

import {
  areDatesEqual,
  calculateMonthDifference,
  isDateAfter,
  isDateBefore,
  shiftMonth,
} from '../../utils/calendarDate';

import type {
  CalendarEvent,
  CalendarDate,
  DayComponentProps,
  MonthlyCalendarOptions,
  SwipeDirectionType,
  SwipeableContainerRef,
  MonthlyCalendarProps,
  CalendarEventMap,
} from '../../types';

import { SWIPE_DIRECTION } from '../../constants';
import SwipeableContainer from '../core/SwipeableContainer';

const arePropsEqual = (
  prevProps: MonthlyCalendarProps<any>,
  nextProps: MonthlyCalendarProps<any>
) => {
  return (
    areDatesEqual(prevProps.viewingDate, nextProps.viewingDate) &&
    prevProps.DayComponent === nextProps.DayComponent &&
    JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options)
  );
};

const MemoizedMonthlyCalendar = React.memo<{
  viewingDate: CalendarDate;
  selectedDate: CalendarDate;
  options: MonthlyCalendarOptions;
  eventMap: CalendarEventMap<any>;
  DayComponent?: (props: DayComponentProps<any>) => React.JSX.Element;
  onDayPress?: (events: CalendarEvent<any>[]) => void;
}>(
  ({
    viewingDate,
    selectedDate,
    options,
    DayComponent,
    onDayPress,
    eventMap,
  }) => (
    <MonthlyCalendar
      viewingDate={viewingDate}
      selectedDate={selectedDate}
      options={options}
      DayComponent={DayComponent}
      onDayPress={onDayPress}
      eventMap={eventMap}
    />
  ),
  arePropsEqual
);

const SlidingContents = React.memo<
  Omit<MonthlyCalendarProps<any>, 'onDayPress' | 'viewingDate'> & {
    calendarList: CalendarDate[];
    options: MonthlyCalendarOptions;
  }
>(({ calendarList, options, ...props }) => (
  <>
    {calendarList.map((value, index) => (
      <MemoizedMonthlyCalendar
        key={`monthly-calendar-list-${index}`}
        options={options}
        viewingDate={value}
        {...props}
      />
    ))}
  </>
));

interface SwipeableMonthlyCalendarProps<T> {
  events?: CalendarEvent<T>[];
  monthlyCalendarOptions?: MonthlyCalendarOptions;
  swipeAnimationDuration?: number;
  swipeThreshold?: number;
  onDayPress?: (events: CalendarEvent<T>[]) => void;
  onViewingMonthChange?: (date: Date) => void;
  DayComponent?: (props: DayComponentProps<T>) => React.JSX.Element;
}

const createMonthlyCalendarList = (date: CalendarDate) => [
  shiftMonth(date, -1),
  date,
  shiftMonth(date, 1),
];

function SwipeableMonthlyCalendar<T>({
  events = [],
  monthlyCalendarOptions = {
    showAdjacentDays: false,
    shouldMaintainConsistentRowCount: false,
  },
  onDayPress,
  onViewingMonthChange,
  DayComponent,
}: SwipeableMonthlyCalendarProps<T>): React.JSX.Element {
  const {
    addEvent,
    eventMap,
    viewingDate,
    selectedDate,
    updateViewingDate,
    setNavigateEnabled,
  } = useCalendarContext<T>();

  const [baseCalendarData, setBaseCalendarData] =
    useState<CalendarDate>(viewingDate);
  const [swipeCalendarList, setSwipeCalendarList] = useState<CalendarDate[]>(
    createMonthlyCalendarList(viewingDate)
  );

  const swipeableContainerRef = useRef<SwipeableContainerRef>(null);

  const prevEvents = useRef<CalendarEvent<T>[]>();

  useEffect(() => {
    if (events) {
      const prevEventIds = new Set(prevEvents.current?.map((e) => e.id));
      const currentEventIds = new Set(events.map((e) => e.id));

      if (
        prevEventIds.size === currentEventIds.size &&
        [...prevEventIds].every((id) => currentEventIds.has(id))
      ) {
        return;
      }

      addEvent(events);
    }

    prevEvents.current = events;
  }, [events, addEvent]);

  useEffect(() => {
    if (areDatesEqual(viewingDate, baseCalendarData)) {
      return;
    }

    setBaseCalendarData(viewingDate);

    // 년도, 달이 같을 경우 swipe 진행하지 않는다.
    if (
      viewingDate.month === baseCalendarData.month &&
      viewingDate.year === baseCalendarData.year
    ) {
      return;
    }

    // 1개월 차이만 날 경우 swipe 진행하지 않는다.
    const diff = calculateMonthDifference(viewingDate, baseCalendarData);
    const shouldAnimate = Math.abs(diff) <= 1;
    if (!shouldAnimate) {
      setBaseCalendarData(viewingDate);
      setSwipeCalendarList(createMonthlyCalendarList(viewingDate));

      const newDate = new Date(viewingDate.year, viewingDate.month - 1, 1);
      onViewingMonthChange?.(newDate);
      return;
    }

    let direction: SwipeDirectionType = SWIPE_DIRECTION.NONE;
    if (isDateBefore(viewingDate, baseCalendarData)) {
      direction = SWIPE_DIRECTION.LEFT;
    } else if (isDateAfter(viewingDate, baseCalendarData)) {
      direction = SWIPE_DIRECTION.RIGHT;
    }

    if (swipeableContainerRef.current) {
      swipeableContainerRef.current.swipe(direction);
    }
  }, [baseCalendarData, viewingDate, onViewingMonthChange]);

  const handleSwipeAnimationComplete = useCallback(() => {
    setBaseCalendarData(viewingDate);
    setSwipeCalendarList(createMonthlyCalendarList(viewingDate));

    const newDate = new Date(viewingDate.year, viewingDate.month - 1, 1);
    onViewingMonthChange?.(newDate);
  }, [viewingDate, onViewingMonthChange]);

  const handleSwipeThresholdReached = useCallback(
    (direction: SwipeDirectionType) => {
      if (direction === SWIPE_DIRECTION.LEFT) {
        updateViewingDate({ unit: 'm', offset: -1 });
      } else if (direction === SWIPE_DIRECTION.RIGHT) {
        updateViewingDate({ unit: 'm', offset: 1 });
      }
    },
    [updateViewingDate]
  );

  const handleSwipeSetup = useCallback(() => {
    setNavigateEnabled(false);
  }, [setNavigateEnabled]);

  const handleSwipeCleanup = useCallback(() => {
    setNavigateEnabled(true);
  }, [setNavigateEnabled]);

  return (
    <SwipeableContainer
      ref={swipeableContainerRef}
      SlidingContentsComponent={
        <SlidingContents
          calendarList={swipeCalendarList}
          selectedDate={selectedDate}
          options={monthlyCalendarOptions}
          DayComponent={DayComponent}
          eventMap={eventMap}
        />
      }
      onSwipeAnimationComplete={handleSwipeAnimationComplete}
      onSwipeCleanup={handleSwipeCleanup}
      onSwipeSetup={handleSwipeSetup}
      onSwipeThresholdReached={handleSwipeThresholdReached}
    >
      <MemoizedMonthlyCalendar
        viewingDate={baseCalendarData}
        selectedDate={selectedDate}
        options={monthlyCalendarOptions}
        DayComponent={DayComponent}
        onDayPress={onDayPress}
        eventMap={eventMap}
      />
    </SwipeableContainer>
  );
}

export default SwipeableMonthlyCalendar;
