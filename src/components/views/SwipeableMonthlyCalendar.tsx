import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MonthlyCalendar from '../core/MonthlyCalendar';
import { createMonthBuffer } from '../../utils/event';
import {
  adjustCalendarMonth,
  getMonthDifference,
  isSame,
  isAfter,
  isBefore,
} from '../../utils/date';
import type {
  CalendarDate,
  CalendarEvent,
  DayComponentProps,
} from '../../types';

import { useCalendarContext } from '../../context/CalendarContext';

const DEFAULT_ANIMATION_DURATION = 150;
const DEFAULT_SWIPE_THRESHOLD = 0.4;

const SWIPE_DIRECTION = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  NONE: 'NONE',
} as const;

const calcWindowWidth = (bufferSize: number): ViewStyle['width'] => {
  return (100 * bufferSize + '%') as `${number}%`;
};

type SwipeDirectionType =
  (typeof SWIPE_DIRECTION)[keyof typeof SWIPE_DIRECTION];

interface SwipeableMonthlyCalendarProps<CalendarEventDataType> {
  monthBufferSize?: number;
  showAdjacentDays?: boolean;
  swipeThreshold?: number;
  viewportStyle?: ViewStyle;
  onDayPress?: (events: CalendarEvent<CalendarEventDataType>[]) => void;
  DayComponent?: (
    props: DayComponentProps<CalendarEventDataType>
  ) => React.JSX.Element;
}

function SwipeableMonthlyCalendar<T>({
  monthBufferSize = 1,
  showAdjacentDays = false,
  swipeThreshold = DEFAULT_SWIPE_THRESHOLD,
  viewportStyle,
  onDayPress,
  DayComponent,
}: SwipeableMonthlyCalendarProps<T>): React.JSX.Element {
  const { displayedDate, setDisplayedDate, setNavigatorEnabled } =
    useCalendarContext();

  const swipeDirection = useSharedValue<SwipeDirectionType>(
    SWIPE_DIRECTION.NONE
  );
  const windowPosition = useSharedValue(0);
  const windowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: windowPosition.value }],
  }));

  const [monthlyCalendarViewWidth, setMonthlyCalendarViewWidth] = useState(0);
  const [currentMonth, setCurrentMonth] = useState<CalendarDate>(displayedDate);
  const prevCurrentMonth = useRef(currentMonth);

  const safeMonthBufferSize = Math.max(1, monthBufferSize);
  const totalBufferedMonths = safeMonthBufferSize * 2 + 1;
  const windowWidth = calcWindowWidth(totalBufferedMonths);

  const monthBuffer = useMemo(
    () => createMonthBuffer(currentMonth, monthBufferSize),
    [currentMonth, monthBufferSize]
  );

  const moveToNextMonth = () => {
    const newDate = adjustCalendarMonth(displayedDate, 1);
    setDisplayedDate(newDate);
    setCurrentMonth(newDate);
  };

  const moveToPrevMonth = () => {
    const newDate = adjustCalendarMonth(displayedDate, -1);
    setDisplayedDate(newDate);
    setCurrentMonth(newDate);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const syncPivotToCurrentDate = () => {
    setCurrentMonth(displayedDate);
  };

  const calcCenterPosition = useCallback(() => {
    return -1 * monthlyCalendarViewWidth * safeMonthBufferSize;
  }, [monthlyCalendarViewWidth, safeMonthBufferSize]);

  const handleWindowLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const width = e.nativeEvent.layout.width / totalBufferedMonths;
      windowPosition.value = -1 * width * safeMonthBufferSize;
      setMonthlyCalendarViewWidth(width);
    },
    [windowPosition, safeMonthBufferSize, totalBufferedMonths]
  );

  useEffect(() => {
    const hasDisplayedMonthChanged = !isSame(displayedDate, currentMonth);

    if (!hasDisplayedMonthChanged) return;

    const monthDiff = getMonthDifference(displayedDate, currentMonth);
    const shouldAnimate = Math.abs(monthDiff) <= safeMonthBufferSize;

    // 2개의 Date 차이가 Buffer 사이즈보다 작다면 애니메이션을 실행하지 않는다.
    if (!shouldAnimate) {
      setCurrentMonth(displayedDate);
      return;
    }

    let newPosition = calcCenterPosition();
    if (isBefore(displayedDate, currentMonth)) {
      newPosition =
        newPosition + monthlyCalendarViewWidth * Math.abs(monthDiff);
    } else if (isAfter(displayedDate, currentMonth)) {
      newPosition =
        newPosition + -1 * monthlyCalendarViewWidth * Math.abs(monthDiff);
    }

    setNavigatorEnabled(false);
    windowPosition.value = withTiming(
      newPosition,
      { duration: DEFAULT_ANIMATION_DURATION },
      () => {
        runOnJS(syncPivotToCurrentDate)();
        runOnJS(setNavigatorEnabled)(true);
      }
    );
  }, [
    calcCenterPosition,
    displayedDate,
    monthlyCalendarViewWidth,
    currentMonth,
    windowPosition,
    safeMonthBufferSize,
    setNavigatorEnabled,
    syncPivotToCurrentDate,
  ]);

  useEffect(() => {
    const isCurrentMonthChanged = !isSame(
      currentMonth,
      prevCurrentMonth.current
    );
    const isMonthElementWidthInitialized = monthlyCalendarViewWidth > 0;

    if (isCurrentMonthChanged && isMonthElementWidthInitialized) {
      const newPosition = calcCenterPosition();
      windowPosition.value = withTiming(newPosition, { duration: 0 });
      prevCurrentMonth.current = currentMonth;
      setDisplayedDate(currentMonth);
    }
  }, [
    currentMonth,
    monthlyCalendarViewWidth,
    safeMonthBufferSize,
    windowPosition,
    calcCenterPosition,
    setDisplayedDate,
  ]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      runOnJS(setNavigatorEnabled)(false);
      swipeDirection.value = SWIPE_DIRECTION.NONE;
    })
    .onUpdate((e) => {
      windowPosition.value =
        -monthlyCalendarViewWidth * safeMonthBufferSize + e.translationX;
      if (e.translationX > 0) {
        swipeDirection.value = SWIPE_DIRECTION.LEFT;
      } else if (e.translationX < 0) {
        swipeDirection.value = SWIPE_DIRECTION.RIGHT;
      }
    })
    .onEnd(() => {
      const threshold = monthlyCalendarViewWidth * swipeThreshold;
      const pivotPosition = -1 * monthlyCalendarViewWidth * safeMonthBufferSize;
      const isMonthlyCalendarViewWidthInitialized =
        monthlyCalendarViewWidth > 0;
      const isThresholdExceeded =
        Math.abs(Math.abs(pivotPosition) - Math.abs(windowPosition.value)) >
        threshold;

      if (isMonthlyCalendarViewWidthInitialized && isThresholdExceeded) {
        if (swipeDirection.value === SWIPE_DIRECTION.RIGHT) {
          windowPosition.value = withTiming(
            pivotPosition - monthlyCalendarViewWidth,
            { duration: DEFAULT_ANIMATION_DURATION },
            () => {
              runOnJS(moveToNextMonth)();
            }
          );
        } else if (swipeDirection.value === SWIPE_DIRECTION.LEFT) {
          windowPosition.value = withTiming(
            pivotPosition + monthlyCalendarViewWidth,
            { duration: DEFAULT_ANIMATION_DURATION },
            () => {
              runOnJS(moveToPrevMonth)();
            }
          );
        }
      } else {
        windowPosition.value = withTiming(pivotPosition, {
          duration: DEFAULT_ANIMATION_DURATION,
        });
      }
    })
    .onFinalize(() => {
      runOnJS(setNavigatorEnabled)(true);
    });

  return (
    <View style={[styles.viewport, viewportStyle]}>
      <GestureHandlerRootView>
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                width: windowWidth,
              },
              styles.window,
              windowAnimatedStyle,
            ]}
            onLayout={handleWindowLayout}
          >
            {monthBuffer.map((date: CalendarDate, index: number) => {
              return (
                <MonthlyCalendar
                  key={`swipealbe-monthly-calendar-list-${index}`}
                  date={date}
                  showAdjacentDays={showAdjacentDays}
                  onDayPress={onDayPress}
                  DayComponent={DayComponent}
                />
              );
            })}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  window: {
    flex: 1,
    flexDirection: 'row',
  },
  viewport: {
    width: '100%',
    height: 360,
    overflow: 'hidden',
  },
});

export default SwipeableMonthlyCalendar;
