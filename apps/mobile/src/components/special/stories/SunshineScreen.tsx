import React, {useEffect} from "react";
import {Dimensions, StyleSheet, View, Text} from "react-native";
import Svg, {Circle, Defs, RadialGradient, Stop, Line, Rect, Path} from "react-native-svg";
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
import {LinearGradient} from "expo-linear-gradient";

const {width, height} = Dimensions.get("window");


// Sun configuration - top right corner
const SUN_RADIUS = 90;

// Light beam configuration - subtle elegant beams
const NUM_BEAMS = 12;

function SunshineScreen() {
    const sunScale = useSharedValue(0);
    const beamOpacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);
    const pulseValue = useSharedValue(0);

    useEffect(() => {
        // Sun fades and scales in elegantly
        sunScale.value = withTiming(1, {
            duration: 1800,
            easing: Easing.out(Easing.cubic),
        });

        // Beams fade in very subtly
        beamOpacity.value = withDelay(
            600,
            withTiming(1, {duration: 2000, easing: Easing.out(Easing.cubic)})
        );

        // Text fades in
        textOpacity.value = withDelay(1400, withTiming(1, {duration: 1500}));

        // Very gentle pulse
        pulseValue.value = withDelay(
            2000,
            withRepeat(
                withSequence(
                    withTiming(1, {duration: 4000, easing: Easing.inOut(Easing.sin)}),
                    withTiming(0, {duration: 4000, easing: Easing.inOut(Easing.sin)})
                ),
                -1,
                true
            )
        );
    }, []);

    const sunContainerStyle = useAnimatedStyle(() => ({
        opacity: interpolate(sunScale.value, [0, 1], [0, 1]),
        transform: [{scale: interpolate(sunScale.value, [0, 1], [0.8, 1])}],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: interpolate(pulseValue.value, [0, 1], [0.25, 0.45]),
        transform: [{scale: interpolate(pulseValue.value, [0, 1], [1, 1.08])}],
    }));

    const beamStyle = useAnimatedStyle(() => ({
        opacity: interpolate(beamOpacity.value, [0, 1], [0, 1]),
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{translateY: interpolate(textOpacity.value, [0, 1], [30, 0])}],
    }));

    // Generate elegant light beams spreading across screen
    const beams = Array.from({length: NUM_BEAMS}).map((_, i) => {
        const startAngle = Math.PI * 0.5;
        const endAngle = Math.PI * 1.15;
        const angle = startAngle + (i / (NUM_BEAMS - 1)) * (endAngle - startAngle);
        const beamLength = height * 1.5;

        // Start from top-right corner
        const startX = width + 50;
        const startY = -60;

        return {
            x1: startX,
            y1: startY,
            x2: startX + Math.cos(angle) * beamLength,
            y2: startY + Math.sin(angle) * beamLength,
            opacity: 0.03 + (i % 2) * 0.02,
            width: 40 + (i % 3) * 20,
        };
    });

    return (
        <View style={styles.screen}>
            {/* Beautiful gradient sky background */}
            <LinearGradient
                colors={["#1a1a2e", "#16213e", "#0f3460", "#533483"]}
                locations={[0, 0.3, 0.6, 1]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={StyleSheet.absoluteFill}
            />

            {/* Warm overlay from sun direction */}
            <LinearGradient
                colors={["rgba(255, 183, 77, 0.15)", "rgba(255, 138, 101, 0.08)", "transparent"]}
                locations={[0, 0.4, 1]}
                start={{x: 1, y: 0}}
                end={{x: 0, y: 1}}
                style={StyleSheet.absoluteFill}
            />

            {/* Subtle light beams */}
            <Animated.View style={[styles.beamContainer, beamStyle]}>
                <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
                    <Defs>
                        <RadialGradient id="beamGradient" cx="100%" cy="0%" r="150%">
                            <Stop offset="0%" stopColor="#FFE082" stopOpacity="0.12" />
                            <Stop offset="40%" stopColor="#FFCC80" stopOpacity="0.05" />
                            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                        </RadialGradient>
                    </Defs>

                    {/* Background warm glow */}
                    <Rect
                        x="0"
                        y="0"
                        width={width}
                        height={height}
                        fill="url(#beamGradient)"
                    />

                    {/* Individual beams */}
                    {beams.map((beam, i) => (
                        <Line
                            key={i}
                            x1={beam.x1}
                            y1={beam.y1}
                            x2={beam.x2}
                            y2={beam.y2}
                            stroke="rgba(255, 236, 179, 0.08)"
                            strokeWidth={beam.width}
                            strokeLinecap="round"
                        />
                    ))}
                </Svg>
            </Animated.View>

            {/* Sun glow layers */}
            <Animated.View style={[styles.glowOuter, glowStyle]} />
            <Animated.View style={[styles.glowMiddle, glowStyle]} />

            {/* Main Sun */}
            <Animated.View style={[styles.sunWrapper, sunContainerStyle]}>
                <Svg width={250} height={250}>
                    <Defs>
                        <RadialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
                            <Stop offset="0%" stopColor="#FFF8E1" />
                            <Stop offset="40%" stopColor="#FFE082" />
                            <Stop offset="70%" stopColor="#FFB74D" />
                            <Stop offset="100%" stopColor="#FF8A65" />
                        </RadialGradient>
                    </Defs>

                    {/* Sun circle */}
                    <Circle
                        cx={125}
                        cy={125}
                        r={SUN_RADIUS}
                        fill="url(#sunGrad)"
                    />

                    {/* Subtle inner glow */}
                    <Circle
                        cx={125}
                        cy={125}
                        r={SUN_RADIUS - 15}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth={1}
                    />

                    {/* Subtle left eye */}
                    <Circle
                        cx={105}
                        cy={115}
                        r={4}
                        fill="rgba(255, 138, 101, 0.45)"
                    />

                    {/* Subtle right eye */}
                    <Circle
                        cx={145}
                        cy={115}
                        r={4}
                        fill="rgba(255, 138, 101, 0.45)"
                    />

                    {/* Subtle smile */}
                    <Path
                        d="M 105 138 Q 125 152 145 138"
                        fill="none"
                        stroke="rgba(255, 138, 101, 0.4)"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                    />
                </Svg>
            </Animated.View>

            {/* Elegant typography */}
            <Animated.View style={[styles.textContainer, textStyle]}>
                <Text style={styles.smallText}>you are my</Text>
                <Text style={styles.mainText}>Sunshine</Text>

                <View style={styles.line} />

                <Text style={styles.quoteText}>
                    "You make me happy{"\n"}when skies are grey"
                </Text>

                <View style={styles.authorLine}>
                    <View style={styles.dash} />
                    <Text style={styles.authorText}>for you</Text>
                    <View style={styles.dash} />
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        width,
        height,
        overflow: "hidden",
    },
    beamContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
    },
    sunWrapper: {
        position: "absolute",
        top: -80,
        right: -80,
        zIndex: 10,
    },
    glowOuter: {
        position: "absolute",
        top: -200,
        right: -200,
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: "rgba(255, 183, 77, 0.15)",
        zIndex: 3,
    },
    glowMiddle: {
        position: "absolute",
        top: -150,
        right: -150,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: "rgba(255, 213, 79, 0.2)",
        zIndex: 4,
    },
    textContainer: {
        position: "absolute",
        left: 32,
        bottom: height * 0.15,
        zIndex: 20,
    },
    smallText: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 18,
        fontWeight: "300",
        letterSpacing: 3,
        textTransform: "uppercase",
        marginBottom: 4,
    },
    mainText: {
        color: "#FFFFFF",
        fontSize: 56,
        fontWeight: "200",
        fontStyle: "italic",
        letterSpacing: -1,
        marginBottom: 24,
    },
    line: {
        width: 60,
        height: 1,
        backgroundColor: "rgba(255, 183, 77, 0.6)",
        marginBottom: 24,
    },
    quoteText: {
        color: "rgba(255, 255, 255, 0.85)",
        fontSize: 20,
        fontStyle: "italic",
        fontWeight: "300",
        lineHeight: 32,
        marginBottom: 32,
    },
    authorLine: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    dash: {
        width: 20,
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
    },
    authorText: {
        color: "rgba(255, 183, 77, 0.9)",
        fontSize: 14,
        fontWeight: "400",
        letterSpacing: 2,
        textTransform: "lowercase",
    },
});

export default SunshineScreen;

