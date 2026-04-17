import React, {useCallback} from 'react';
import {StyleSheet, ViewProps} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {useFocusEffect} from 'expo-router';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

interface Props extends ViewProps {
    children: React.ReactNode;
}

const GradientView = ({children, style, ...props}: Props) => {
    const opacity = useSharedValue(0);

    useFocusEffect(useCallback(() => {
        opacity.value = 0;
        opacity.value = withTiming(1, {duration: 200});
        return () => {
            opacity.value = 0;
        };
    }, []));

    const animatedStyle = useAnimatedStyle(() => ({opacity: opacity.value}));

    return (
        <AnimatedGradient
            colors={['#EFF3FA', '#E6EBF5']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
            style={[styles.container, style, animatedStyle]}
            {...props}
        >
            {children}
        </AnimatedGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default GradientView;