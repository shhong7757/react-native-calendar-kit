import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  useState,
  useCallback,
  useImperativeHandle,
  type PropsWithChildren,
  forwardRef,
} from 'react';

import type { SwipeableContainerRef, SwipeDirectionType } from '../../types';

import { DEFAULT_SWIPE_CONFIG, SWIPE_DIRECTION } from '../../constants';

interface SwipeableContainerProps {
  swipeAnimationDuration?: number;
  swipeThreshold?: number;
  SlidingContentsComponent: JSX.Element;
  onSwipeAnimationComplete?: (direction: SwipeDirectionType) => void;
  onSwipeCleanup?: () => void;
  onSwipeSetup?: () => void;
  onSwipeThresholdReached?: (direction: SwipeDirectionType) => void;
}

const SwipeableContainer = forwardRef<
  SwipeableContainerRef,
  PropsWithChildren<SwipeableContainerProps>
>(
  (
    {
      children,
      swipeAnimationDuration = DEFAULT_SWIPE_CONFIG.animationDuration,
      swipeThreshold = DEFAULT_SWIPE_CONFIG.threshold,
      onSwipeAnimationComplete,
      onSwipeThresholdReached,
      onSwipeSetup,
      onSwipeCleanup,
      SlidingContentsComponent,
    }: PropsWithChildren<SwipeableContainerProps>,
    ref
  ) => {
    const [viewportWidth, setViewportWidth] = useState(0);

    const animatedContentsOpacity = useSharedValue(0);
    const animatedContentsPosition = useSharedValue(0);
    const animatedContentsStyle = useAnimatedStyle(() => ({
      opacity: animatedContentsOpacity.value,
      transform: [{ translateX: animatedContentsPosition.value }],
    }));
    const swipeDirection = useSharedValue<SwipeDirectionType>(
      SWIPE_DIRECTION.NONE
    );

    const setup = () => {
      animatedContentsOpacity.value = 1;
      if (onSwipeSetup) onSwipeSetup();
    };

    const cleanup = () => {
      animatedContentsOpacity.value = 0;
      animatedContentsPosition.value = -1 * viewportWidth;
      if (onSwipeCleanup) onSwipeCleanup();
    };

    useImperativeHandle(ref, () => ({
      swipe: (direction: SwipeDirectionType) => {
        setup();

        let position = -1 * viewportWidth;
        const config = { duration: swipeAnimationDuration };
        if (direction === SWIPE_DIRECTION.LEFT) {
          position = position + viewportWidth;
        } else if (direction === SWIPE_DIRECTION.RIGHT) {
          position = position + -1 * viewportWidth;
        }

        animatedContentsPosition.value = withTiming(position, config, () => {
          runOnJS(cleanup)();
          if (onSwipeAnimationComplete) {
            runOnJS(onSwipeAnimationComplete)(direction);
          }
        });
      },
    }));

    const handleContentsLayoutChange = useCallback(
      (e: LayoutChangeEvent) => {
        const width = e.nativeEvent.layout.width / 3;
        animatedContentsPosition.value = -1 * width;
        setViewportWidth(width);
      },
      [animatedContentsPosition]
    );

    const panGesture = Gesture.Pan()
      .onBegin(() => {
        swipeDirection.value = SWIPE_DIRECTION.NONE;
      })
      .onStart(() => {
        runOnJS(setup)();
      })
      .onUpdate((e) => {
        animatedContentsPosition.value = -viewportWidth + e.translationX;
        if (e.translationX > 0) {
          swipeDirection.value = SWIPE_DIRECTION.LEFT;
        } else if (e.translationX < 0) {
          swipeDirection.value = SWIPE_DIRECTION.RIGHT;
        }
      })
      .onEnd(() => {
        const basePosition = -1 * viewportWidth;
        const isViewportWidthInitialized = viewportWidth > 0;
        const isThresholdExceeded =
          Math.abs(
            Math.abs(basePosition) - Math.abs(animatedContentsPosition.value)
          ) >
          viewportWidth * swipeThreshold;

        if (isViewportWidthInitialized && isThresholdExceeded) {
          if (
            swipeDirection.value === SWIPE_DIRECTION.RIGHT &&
            onSwipeThresholdReached
          ) {
            runOnJS(onSwipeThresholdReached)(swipeDirection.value);
          } else if (
            swipeDirection.value === SWIPE_DIRECTION.LEFT &&
            onSwipeThresholdReached
          ) {
            runOnJS(onSwipeThresholdReached)(swipeDirection.value);
          }
        } else {
          animatedContentsPosition.value = withTiming(basePosition, {
            duration: swipeAnimationDuration,
          });
        }
      });

    return (
      <GestureHandlerRootView>
        <GestureDetector gesture={panGesture}>
          <View style={styles.viewport}>
            {children}
            <Animated.View
              style={[styles.contents, animatedContentsStyle]}
              onLayout={handleContentsLayoutChange}
            >
              {SlidingContentsComponent}
            </Animated.View>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    );
  }
);

const styles = StyleSheet.create({
  contents: {
    backgroundColor: 'white',
    bottom: 0,
    flexDirection: 'row',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '300%',
  },
  viewport: {
    backgroundColor: 'white',
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
});

export default SwipeableContainer;
