import { styled } from 'nativewind';
import React, { useEffect } from 'react';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { CircleProps } from 'react-native-svg';
import Svg, { Circle } from 'react-native-svg';

import { View } from '../core';

type ProgressRingProps = {
  radius?: number;
  strokeWidth?: number;
  progress: number;
};

const SvgCircle = styled(Circle, { classProps: ['stroke', 'fill'] });

const AnimatedCircle = Animated.createAnimatedComponent(SvgCircle);

export const ProgressRing = ({
  radius = 100,
  strokeWidth = 20,
  progress,
}: ProgressRingProps) => {
  const innerRadius = radius - strokeWidth / 2;
  const circumference = Math.PI * 2 * innerRadius;

  const fill = useSharedValue(0);

  useEffect(() => {
    fill.value = withSpring(progress, { overshootClamping: true });
  }, [fill, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: [circumference * fill.value, circumference],
  }));

  const circleDefaultProps: CircleProps = {
    r: innerRadius,
    cx: radius,
    cy: radius,
    origin: [radius, radius],
    strokeWidth: strokeWidth,
    strokeLinecap: 'round',
    fill: 'fill-none',
    stroke: 'stroke-blue-500',
  };

  return (
    <View
      style={{ height: radius * 2, width: radius * 2 }}
      className="align-center text-blue-300"
    >
      <Svg>
        {/* Background */}
        <SvgCircle {...circleDefaultProps} opacity={0.2} />
        {/* Progress */}
        <AnimatedCircle
          animatedProps={animatedProps}
          {...circleDefaultProps}
          rotation={-90}
        />
      </Svg>
    </View>
  );
};
