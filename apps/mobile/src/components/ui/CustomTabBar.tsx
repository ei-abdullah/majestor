import React from 'react';
import { View, Platform } from 'react-native';
import Animated, { LinearTransition, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import { Feather, AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import AnimatedPressable from './AnimatedPressable';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const isKeyboardVisible = useDerivedValue(() => 0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isKeyboardVisible.value === 1 ? 150 : 0, {
            duration: 250,
          }),
        },
      ],
      opacity: withTiming(isKeyboardVisible.value === 1 ? 0 : 1, {
        duration: 250,
      }),
    };
  });

  const IconConfig: any = {
    index: 'home',
    carpool: 'car',
    studyhub: 'anchor',
    user: 'user',
  };

  return (
    <Animated.View
      layout={LinearTransition}
      style={[
        {
          flexDirection: 'row',
          position: 'absolute',
          bottom: Platform.OS === 'android' ? 50 : 40,
          alignSelf: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          width: '85%',
          maxWidth: 340,
          minWidth: 280,
          height: 70,
          borderRadius: 16,
          paddingHorizontal: 8,
          paddingVertical: 8,
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.06)',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
          backdropFilter: 'blur(20px)',
          gap: 4,
        },
        animatedStyle,
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const iconName = IconConfig[route.name];

        const onPress = () => {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Use different icons for carpool
        const IconComponent = route.name === 'carpool' ? AntDesign : Feather;
        const adjustedIconName = route.name === 'carpool' ? 'car' : iconName;

        return (
          <AnimatedPressable
            layout={LinearTransition}
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: 54,
              minWidth: 54,
              borderRadius: 14,
              overflow: 'hidden',
            }}
          >
            {isFocused ? (
              <LinearGradient
                colors={["#3A6FF8", "#8DDDD3"]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 14,
                }}
              >
                <IconComponent 
                  name={adjustedIconName} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </LinearGradient>
            ) : (
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 14,
                  backgroundColor: 'transparent',
                }}
              >
                <IconComponent 
                  name={adjustedIconName} 
                  size={24} 
                  color="#9CA3AF" 
                />
              </View>
            )}
          </AnimatedPressable>
        );
      })}
    </Animated.View>
  );
}
