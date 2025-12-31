import React, {useEffect} from "react";
import {Dimensions, StyleSheet, View, Text} from "react-native";
import Svg, {Path, Defs, RadialGradient, Stop} from "react-native-svg";
import Animated, {
    useSharedValue,
    useAnimatedProps,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSequence,
    withRepeat,
    Easing,
    interpolate,
    SharedValue,
} from "react-native-reanimated";

const {width, height} = Dimensions.get("window");

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Beautiful rainbow colors with softer, more realistic tones
const RAINBOW_COLORS = [
    {color: "#E74C3C", opacity: 0.9},  // Soft Red
    {color: "#E67E22", opacity: 0.9},  // Warm Orange
    {color: "#F1C40F", opacity: 0.9},  // Golden Yellow
    {color: "#2ECC71", opacity: 0.9},  // Fresh Green
    {color: "#3498DB", opacity: 0.9},  // Sky Blue
    {color: "#5B48A2", opacity: 0.9},  // Soft Indigo
    {color: "#9B59B6", opacity: 0.9},  // Gentle Violet
];

const BAND_WIDTH = 14;
const BAND_GAP = 3;
const PATH_LENGTH = 1200;

// Create a beautiful semicircle arc from top-right going down to bottom-right
// This creates a classic rainbow shape
function createSmoothArc(radius: number): string {
    // Center point at the bottom-right corner, slightly off screen
    const cx = width + 40;
    const cy = height + 60;

    // Start angle (top) to end angle (left side)
    const startAngle = -Math.PI * 0.85;  // Near top
    const endAngle = -Math.PI * 0.15;    // Near bottom-left

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`;
}

function RainbowBand({
    color,
    opacity,
    radius,
    delay,
    drawProgress,
}: {
    color: string;
    opacity: number;
    radius: number;
    delay: number;
    drawProgress: SharedValue<number>;
}) {
    const path = createSmoothArc(radius);

    const animatedProps = useAnimatedProps(() => {
        const adjustedProgress = Math.max(0, drawProgress.value - delay);
        const dashOffset = PATH_LENGTH - Math.min(adjustedProgress, PATH_LENGTH);
        return {
            strokeDashoffset: dashOffset,
        };
    });

    return (
        <AnimatedPath
            d={path}
            fill="none"
            stroke={color}
            strokeWidth={BAND_WIDTH}
            strokeLinecap="round"
            strokeDasharray={PATH_LENGTH}
            opacity={opacity}
            animatedProps={animatedProps}
        />
    );
}

function RainbowScreen() {
    const drawProgress = useSharedValue(0);
    const textOpacity = useSharedValue(0);
    const shimmer = useSharedValue(0);
    const scaleIn = useSharedValue(0.8);

    useEffect(() => {
        // Scale in effect
        scaleIn.value = withTiming(1, {duration: 800, easing: Easing.out(Easing.back(1.2))});

        // Draw rainbow bands sequentially
        drawProgress.value = withDelay(
            300,
            withTiming(PATH_LENGTH + 400, {
                duration: 4000,
                easing: Easing.out(Easing.cubic),
            })
        );

        // Text fades in
        textOpacity.value = withDelay(
            1200,
            withTiming(1, {duration: 1400, easing: Easing.out(Easing.cubic)})
        );

        // Gentle shimmer
        shimmer.value = withDelay(
            2500,
            withRepeat(
                withSequence(
                    withTiming(1, {duration: 3000, easing: Easing.inOut(Easing.sin)}),
                    withTiming(0, {duration: 3000, easing: Easing.inOut(Easing.sin)})
                ),
                -1,
                true
            )
        );
    }, []);

    const textContainerStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [
            {translateX: interpolate(textOpacity.value, [0, 1], [-30, 0])},
            {translateY: interpolate(textOpacity.value, [0, 1], [20, 0])},
        ],
    }));

    const rainbowStyle = useAnimatedStyle(() => ({
        transform: [{scale: scaleIn.value}],
    }));

    const glow1Style = useAnimatedStyle(() => ({
        opacity: interpolate(shimmer.value, [0, 1], [0.2, 0.45]),
        transform: [{scale: interpolate(shimmer.value, [0, 1], [1, 1.1])}],
    }));

    const glow2Style = useAnimatedStyle(() => ({
        opacity: interpolate(shimmer.value, [0, 1], [0.15, 0.35]),
    }));

    const glow3Style = useAnimatedStyle(() => ({
        opacity: interpolate(shimmer.value, [0, 1], [0.1, 0.3]),
        transform: [{scale: interpolate(shimmer.value, [0, 1], [0.95, 1.05])}],
    }));

    // Calculate base radius for rainbow
    const baseRadius = Math.max(width, height) * 0.9;

    return (
        <View style={styles.screen}>
            {/* Multiple layered glows for depth */}
            <Animated.View style={[styles.glowYellow, glow1Style]} />
            <Animated.View style={[styles.glowOrange, glow2Style]} />
            <Animated.View style={[styles.glowPink, glow3Style]} />

            {/* Text on left side, vertically centered */}
            <Animated.View style={[styles.textContainer, textContainerStyle]}>
                <Text style={styles.titleText}>After every storm</Text>
                <Text style={styles.subtitleText}>comes a rainbow...</Text>

                <View style={styles.divider} />

                <Text style={styles.quoteText}>
                    "You are the{"\n"}
                    rainbow that{"\n"}
                    colors my{"\n"}
                    grey skies."
                </Text>

                <View style={styles.smallHeart}>
                    <Text style={styles.heartEmoji}>💜</Text>
                </View>
            </Animated.View>

            {/* Rainbow SVG */}
            <Animated.View style={[styles.rainbowContainer, rainbowStyle]}>
                <Svg
                    width={width * 1.5}
                    height={height * 1.5}
                    style={styles.svgContainer}
                >
                    <Defs>
                        <RadialGradient id="glowGrad" cx="100%" cy="100%" r="80%">
                            <Stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
                            <Stop offset="100%" stopColor="#fff" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>

                    {/* Render rainbow bands from outer (red) to inner (violet) */}
                    {RAINBOW_COLORS.map((band, index) => (
                        <RainbowBand
                            key={band.color}
                            color={band.color}
                            opacity={band.opacity}
                            radius={baseRadius - index * (BAND_WIDTH + BAND_GAP)}
                            delay={index * 50}
                            drawProgress={drawProgress}
                        />
                    ))}
                </Svg>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        width,
        height,
        backgroundColor: "transparent",
        overflow: "hidden",
    },
    rainbowContainer: {
        position: "absolute",
        top: -height * 0.25,
        right: -width * 0.25,
        width: width * 1.5,
        height: height * 1.5,
        zIndex: 1,
    },
    svgContainer: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    glowYellow: {
        position: "absolute",
        bottom: -height * 0.4,
        right: -width * 0.4,
        width: width * 1.6,
        height: width * 1.6,
        borderRadius: width * 0.8,
        backgroundColor: "#FFF3CD",
        zIndex: 0,
    },
    glowOrange: {
        position: "absolute",
        bottom: -height * 0.3,
        right: -width * 0.3,
        width: width * 1.2,
        height: width * 1.2,
        borderRadius: width * 0.6,
        backgroundColor: "#FDEBD0",
        zIndex: 0,
    },
    glowPink: {
        position: "absolute",
        bottom: -height * 0.2,
        right: -width * 0.2,
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: width * 0.45,
        backgroundColor: "#FADBD8",
        zIndex: 0,
    },
    textContainer: {
        position: "absolute",
        left: 24,
        top: height * 0.18,
        width: width * 0.52,
        zIndex: 10,
    },
    titleText: {
        color: "#ffffff",
        fontSize: 28,
        fontWeight: "800",
        marginBottom: 8,
        textShadowColor: "rgba(0, 0, 0, 0.8)",
        textShadowOffset: {width: 0, height: 3},
        textShadowRadius: 12,
        letterSpacing: 0.5,
    },
    subtitleText: {
        color: "rgba(255, 255, 255, 0.95)",
        fontSize: 20,
        fontStyle: "italic",
        marginBottom: 28,
        textShadowColor: "rgba(0, 0, 0, 0.7)",
        textShadowOffset: {width: 0, height: 2},
        textShadowRadius: 10,
    },
    divider: {
        width: 70,
        height: 4,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 2,
        marginBottom: 28,
    },
    quoteText: {
        color: "rgba(255, 255, 255, 1)",
        fontSize: 24,
        fontStyle: "italic",
        lineHeight: 38,
        textShadowColor: "rgba(0, 0, 0, 0.7)",
        textShadowOffset: {width: 0, height: 2},
        textShadowRadius: 10,
        fontWeight: "500",
    },
    smallHeart: {
        marginTop: 24,
    },
    heartEmoji: {
        fontSize: 28,
    },
});

export default RainbowScreen;

