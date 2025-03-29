import MonthlyCalendarMatrix from '../core/MonthlyCalendarMatrix';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import SwipeableContainer from '../core/SwipeableContainer';

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
  MonthlyCalendarMatrixProps,
} from '../../types';

import { DEFAULT_SWIPE_CONFIG, SWIPE_DIRECTION } from '../../constants';

const SlidingContents = React.memo<
  Omit<MonthlyCalendarMatrixProps<any>, 'onDayPress' | 'viewingDate'> & {
    calendarList: CalendarDate[];
    options: MonthlyCalendarOptions;
  }
>(({ calendarList, options, ...props }) => (
  <>
    {calendarList.map((value, index) => (
      <MonthlyCalendarMatrix
        key={`monthly-calendar-list-${index}`}
        options={options}
        viewingDate={value}
        {...props}
      />
    ))}
  </>
));

interface MonthlyCalendarProps<T> {
  events?: CalendarEvent<T>[];
  monthlyCalendarOptions?: MonthlyCalendarOptions;
  swipeable?: boolean;
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

function MonthlyCalendar<T>({
  events = [],
  monthlyCalendarOptions = {
    showAdjacentDays: false,
    shouldMaintainConsistentRowCount: false,
  },
  swipeable = true,
  swipeAnimationDuration = DEFAULT_SWIPE_CONFIG.animationDuration,
  swipeThreshold = DEFAULT_SWIPE_CONFIG.threshold,
  onDayPress,
  onViewingMonthChange,
  DayComponent,
}: MonthlyCalendarProps<T>): React.JSX.Element {
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

    if (swipeable && swipeableContainerRef.current) {
      swipeableContainerRef.current.swipe(direction);
    }
  }, [baseCalendarData, viewingDate, onViewingMonthChange, swipeable]);

  const handleSwipeAnimationComplete = useCallback(() => {
    if (!swipeable) return;

    setBaseCalendarData(viewingDate);
    setSwipeCalendarList(createMonthlyCalendarList(viewingDate));

    const newDate = new Date(viewingDate.year, viewingDate.month - 1, 1);
    onViewingMonthChange?.(newDate);
  }, [viewingDate, onViewingMonthChange, swipeable]);

  const handleSwipeThresholdReached = useCallback(
    (direction: SwipeDirectionType) => {
      if (!swipeable) return;

      if (direction === SWIPE_DIRECTION.LEFT) {
        updateViewingDate({ unit: 'm', offset: -1 });
      } else if (direction === SWIPE_DIRECTION.RIGHT) {
        updateViewingDate({ unit: 'm', offset: 1 });
      }
    },
    [updateViewingDate, swipeable]
  );

  const handleSwipeSetup = useCallback(() => {
    if (!swipeable) return;

    setNavigateEnabled(false);
  }, [setNavigateEnabled, swipeable]);

  const handleSwipeCleanup = useCallback(() => {
    if (!swipeable) return;

    setNavigateEnabled(true);
  }, [setNavigateEnabled, swipeable]);

  // swipeable 옵션이 false일 경우 스와이프 기능을 비활성화 한다.
  if (!swipeable) {
    return (
      <MonthlyCalendarMatrix
        viewingDate={baseCalendarData}
        selectedDate={selectedDate}
        options={monthlyCalendarOptions}
        // TODO: Any를 사용하지 않는 방법 찾기
        DayComponent={DayComponent as any}
        onDayPress={onDayPress as any}
        eventMap={eventMap}
      />
    );
  }

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
      swipeAnimationDuration={swipeAnimationDuration}
      swipeThreshold={swipeThreshold}
      onSwipeAnimationComplete={handleSwipeAnimationComplete}
      onSwipeCleanup={handleSwipeCleanup}
      onSwipeSetup={handleSwipeSetup}
      onSwipeThresholdReached={handleSwipeThresholdReached}
    >
      <MonthlyCalendarMatrix
        viewingDate={baseCalendarData}
        selectedDate={selectedDate}
        options={monthlyCalendarOptions}
        // TODO: Any를 사용하지 않는 방법 찾기
        DayComponent={DayComponent as any}
        onDayPress={onDayPress as any}
        eventMap={eventMap}
      />
    </SwipeableContainer>
  );
}

export default MonthlyCalendar;
