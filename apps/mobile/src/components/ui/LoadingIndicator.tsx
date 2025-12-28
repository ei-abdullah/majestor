import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';
import {AntDesign} from "@expo/vector-icons";
import GradientView from "@/src/components/ui/GradientView";

const LoadingIndicator = () => {
    const rotation = useSharedValue(0);

    useEffect(() => {
        // Start infinite 360 rotation
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 1000,
                easing: Easing.linear,
            }),
            -1 // -1 means infinite repeat
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
        <GradientView className="flex-1 justify-center items-center bg-transparent">
            <Animated.View style={animatedStyle}>
                <AntDesign name={"loading"} size={60} color={"#3A6FF8"} />
            </Animated.View>
        </GradientView>
    );
};

export default LoadingIndicator;