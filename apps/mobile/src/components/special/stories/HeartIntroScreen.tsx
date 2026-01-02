import React, {useEffect} from "react";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSequence,
    withRepeat,
    Easing,
    interpolate,
} from "react-native-reanimated";
import {Feather} from "@expo/vector-icons";

const {width, height} = Dimensions.get("window");

const heartCollection = [
    {id: "heart-1", left: 0.1, delay: 0, duration: 4500, size: 28, color: "#ff9db6"},
    {id: "heart-2", left: 0.25, delay: 800, duration: 5000, size: 22, color: "#ff5c8d"},
    {id: "heart-3", left: 0.4, delay: 400, duration: 4200, size: 32, color: "#ff8bac"},
    {id: "heart-4", left: 0.55, delay: 1200, duration: 4800, size: 26, color: "#ff4c7f"},
    {id: "heart-5", left: 0.7, delay: 600, duration: 4400, size: 30, color: "#ff6aa1"},
    {id: "heart-6", left: 0.85, delay: 1000, duration: 5200, size: 24, color: "#ffb6c8"},
];

function FloatingHeart({
    left,
    delay,
    duration,
    size,
    color,
}: {
    left: number;
    delay: number;
    duration: number;
    size: number;
    color: string;
}) {
    const progress = useSharedValue(0);
    const sway = useSharedValue(0);

    useEffect(() => {
        progress.value = withDelay(
            delay,
            withRepeat(
                withTiming(1, {duration, easing: Easing.out(Easing.quad)}),
                -1,
                false
            )
        );

        sway.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(15, {duration: duration / 4, easing: Easing.inOut(Easing.sin)}),
                    withTiming(-15, {duration: duration / 2, easing: Easing.inOut(Easing.sin)}),
                    withTiming(0, {duration: duration / 4, easing: Easing.inOut(Easing.sin)})
                ),
                -1,
                false
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(progress.value, [0, 0.1, 0.8, 1], [0, 1, 1, 0]),
            transform: [
                {translateY: interpolate(progress.value, [0, 1], [0, -height * 0.8])},
                {translateX: sway.value},
                {scale: interpolate(progress.value, [0, 0.5, 1], [0.6, 1.1, 0.8])},
                {rotate: `${interpolate(progress.value, [0, 1], [-10, 10])}deg`},
            ],
        };
    });

    return (
        <Animated.View
            style={[
                styles.heartIcon,
                {left: left * width - size / 2, bottom: 60},
                animatedStyle,
            ]}
        >
            <Feather name="heart" size={size} color={color} />
        </Animated.View>
    );
}

function HeartIntroScreen() {
    const textOpacity = useSharedValue(0);
    const textSlide = useSharedValue(30);
    const waveValue = useSharedValue(0);
    const pulseValue = useSharedValue(1);

    useEffect(() => {
        // Text fade in
        textOpacity.value = withDelay(600, withTiming(1, {duration: 1800}));
        textSlide.value = withDelay(600, withTiming(0, {duration: 1800, easing: Easing.out(Easing.cubic)}));

        // Wave border animation
        waveValue.value = withRepeat(
            withSequence(
                withTiming(1, {duration: 3000, easing: Easing.inOut(Easing.sin)}),
                withTiming(0, {duration: 3000, easing: Easing.inOut(Easing.sin)})
            ),
            -1,
            true
        );

        // Pulse animation
        pulseValue.value = withRepeat(
            withSequence(
                withTiming(1.05, {duration: 1500, easing: Easing.inOut(Easing.sin)}),
                withTiming(1, {duration: 1500, easing: Easing.inOut(Easing.sin)})
            ),
            -1,
            true
        );
    }, []);

    const waveBorderStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {translateX: interpolate(waveValue.value, [0, 1], [-8, 8])},
                {translateY: interpolate(waveValue.value, [0, 1], [-6, 6])},
                {scale: pulseValue.value},
            ],
            opacity: interpolate(waveValue.value, [0, 0.5, 1], [0.2, 0.4, 0.2]),
        };
    });

    const textStyle = useAnimatedStyle(() => {
        return {
            opacity: textOpacity.value,
            transform: [{translateY: textSlide.value}],
        };
    });

    return (
        <View style={styles.screen}>
            {/* Animated wave border */}
            <Animated.View style={[styles.waveBorder, waveBorderStyle]} />
            <Animated.View style={[styles.waveBorderInner, waveBorderStyle]} />

            {/* Floating hearts */}
            <View style={styles.heartsWrapper}>
                {heartCollection.map((heart) => (
                    <FloatingHeart
                        key={heart.id}
                        left={heart.left}
                        delay={heart.delay}
                        duration={heart.duration}
                        size={heart.size}
                        color={heart.color}
                    />
                ))}
            </View>

            {/* Message */}
            <Animated.View style={[styles.textBlock, textStyle]}>
                <Text style={styles.messageText}>
                    ♡⊹✩˚₊‧Every heartbeat{"\n"}is a little story{"\n"}of how you{"\n"}make me feel‧₊˚✩⊹♡
                </Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        width,
        height,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
    },
    waveBorder: {
        position: "absolute",
        width: width * 1.2,
        height: height * 1.2,
        borderRadius: 400,
        borderWidth: 2,
        borderColor: "rgba(255, 150, 180, 0.3)",
        top: -height * 0.1,
        left: -width * 0.1,
    },
    waveBorderInner: {
        position: "absolute",
        width: width * 0.9,
        height: height * 0.9,
        borderRadius: 350,
        borderWidth: 1.5,
        borderColor: "rgba(255, 100, 150, 0.2)",
        top: height * 0.05,
        left: width * 0.05,
    },
    heartsWrapper: {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
    },
    heartIcon: {
        position: "absolute",
    },
    textBlock: {
        position: "absolute",
        bottom: height * 0.18,
        left: 30,
        right: 30,
        alignItems: "center",
    },
    messageText: {
        color: "rgba(255, 255, 255, 0.95)",
        fontSize: 22,
        fontStyle: "italic",
        textAlign: "center",
        lineHeight: 36,
        textShadowColor: "rgba(0, 0, 0, 0.4)",
        textShadowOffset: {width: 0, height: 2},
        textShadowRadius: 6,
    },
});

export default HeartIntroScreen;

