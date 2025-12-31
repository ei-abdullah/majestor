import React, {useEffect} from "react";
import {Pressable, StyleSheet, View} from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withRepeat,
    withSequence,
    Easing,
    interpolate,
} from "react-native-reanimated";
import {Feather} from "@expo/vector-icons";

type HeartRippleButtonProps = {
    onPress: () => void;
    size?: number;
};

function HeartRippleButton({onPress, size = 70}: HeartRippleButtonProps) {
    const ripple1 = useSharedValue(0);
    const ripple2 = useSharedValue(0);
    const ripple3 = useSharedValue(0);
    const heartPulse = useSharedValue(1);

    useEffect(() => {
        // Staggered ripple animations
        ripple1.value = withRepeat(
            withTiming(1, {duration: 2000, easing: Easing.out(Easing.cubic)}),
            -1,
            false
        );

        ripple2.value = withDelay(
            600,
            withRepeat(
                withTiming(1, {duration: 2000, easing: Easing.out(Easing.cubic)}),
                -1,
                false
            )
        );

        ripple3.value = withDelay(
            1200,
            withRepeat(
                withTiming(1, {duration: 2000, easing: Easing.out(Easing.cubic)}),
                -1,
                false
            )
        );

        // Heart pulse
        heartPulse.value = withRepeat(
            withSequence(
                withTiming(1.15, {duration: 500, easing: Easing.out(Easing.cubic)}),
                withTiming(1, {duration: 500, easing: Easing.inOut(Easing.cubic)})
            ),
            -1,
            true
        );
    }, []);

    const ripple1Style = useAnimatedStyle(() => ({
        opacity: interpolate(ripple1.value, [0, 0.5, 1], [0.4, 0.2, 0]),
        transform: [{scale: interpolate(ripple1.value, [0, 1], [1, 2.2])}],
    }));

    const ripple2Style = useAnimatedStyle(() => ({
        opacity: interpolate(ripple2.value, [0, 0.5, 1], [0.35, 0.15, 0]),
        transform: [{scale: interpolate(ripple2.value, [0, 1], [1, 2.5])}],
    }));

    const ripple3Style = useAnimatedStyle(() => ({
        opacity: interpolate(ripple3.value, [0, 0.5, 1], [0.3, 0.1, 0]),
        transform: [{scale: interpolate(ripple3.value, [0, 1], [1, 2.8])}],
    }));

    const heartStyle = useAnimatedStyle(() => ({
        transform: [{scale: heartPulse.value}],
    }));

    return (
        <View style={[styles.container, {width: size * 3, height: size * 3}]}>
            {/* Ripple circles - pointerEvents none, so they don't block touches */}
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.ripple,
                    styles.ripple3,
                    {width: size, height: size, borderRadius: size / 2},
                    ripple3Style,
                ]}
            />
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.ripple,
                    styles.ripple2,
                    {width: size, height: size, borderRadius: size / 2},
                    ripple2Style,
                ]}
            />
            <Animated.View
                pointerEvents="none"
                style={[
                    styles.ripple,
                    styles.ripple1,
                    {width: size, height: size, borderRadius: size / 2},
                    ripple1Style,
                ]}
            />

            {/* Heart button */}
            <Pressable onPress={onPress} style={({pressed}) => [
                styles.heartButton,
                {width: size, height: size, borderRadius: size / 2},
                pressed && styles.pressed,
            ]}>
                <Animated.View style={heartStyle}>
                    <Feather name="heart" size={size * 0.45} color="#ffffff" />
                </Animated.View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    ripple: {
        position: "absolute",
    },
    ripple1: {
        backgroundColor: "#f87171", // red-400
    },
    ripple2: {
        backgroundColor: "#fb7185", // rose-400
    },
    ripple3: {
        backgroundColor: "#fda4af", // rose-300
    },
    heartButton: {
        backgroundColor: "#dc2626", // red-600
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#dc2626",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    pressed: {
        opacity: 0.9,
        transform: [{scale: 0.95}],
    },
});

export default HeartRippleButton;

