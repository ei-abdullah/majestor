import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends PressableProps {
  layout?: any;
  children: React.ReactNode;
}

export default function CustomAnimatedPressable({ layout, children, ...props }: AnimatedPressableProps) {
  return (
    <AnimatedPressable layout={layout} {...props}>
      {children}
    </AnimatedPressable>
  );
}
