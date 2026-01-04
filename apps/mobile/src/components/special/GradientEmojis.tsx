import React, {useEffect, useMemo} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useAuthStore} from '@/src/stores/authStore';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const SPECIAL_EMAIL = "bcs233188@cust.pk";

// All available emojis/symbols
const allEmojis = [
    '✩', '♡', '⊹', '☆彡', '✧', '🌸', '💫', '✨',
    '🦋', '💖', '🌙', '🌷', '⭐', '🎀', '♡', '✩'
];

// Grid-based positioning to avoid collisions
const generateGridPositions = () => {
    const elements: {id: string; emoji: string; x: number; y: number; size: number; opacity: number; delay: number}[] = [];

    // Create a grid with some randomness within each cell
    const cols = 4;
    const rows = 10;
    const cellWidth = 1 / cols;
    const cellHeight = 1 / rows;

    let emojiIndex = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Skip some cells randomly for a more organic look (keep ~50%)
            if (Math.random() > 0.5) continue;

            // Position within cell with padding to avoid edges
            const padding = 0.2;
            const x = col * cellWidth + padding * cellWidth + Math.random() * cellWidth * (1 - 2 * padding);
            const y = row * cellHeight + padding * cellHeight + Math.random() * cellHeight * (1 - 2 * padding);

            const emoji = allEmojis[emojiIndex % allEmojis.length];
            emojiIndex++;

            elements.push({
                id: `el-${row}-${col}`,
                emoji,
                x,
                y,
                size: 12 + Math.random() * 6, // 12-18
                opacity: 0.35 + Math.random() * 0.25, // 0.35-0.6
                delay: Math.random() * 3000, // Random delay up to 3s
            });
        }
    }

    return elements;
};

// Lightweight animated emoji component
const AnimatedEmoji = React.memo(({
    emoji,
    x,
    y,
    size,
    baseOpacity,
    delay,
}: {
    emoji: string;
    x: number;
    y: number;
    size: number;
    baseOpacity: number;
    delay: number;
}) => {
    const opacity = useSharedValue(baseOpacity);

    useEffect(() => {
        // Simple, subtle pulse animation
        opacity.value = withDelay(
            delay,
            withRepeat(
                withTiming(baseOpacity * 0.5, {
                    duration: 2500 + Math.random() * 1000,
                    easing: Easing.inOut(Easing.sin),
                }),
                -1,
                true
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.Text
            style={[
                styles.glitterElement,
                {
                    left: x * width,
                    top: y * height,
                    fontSize: size,
                },
                animatedStyle,
            ]}
        >
            {emoji}
        </Animated.Text>
    );
});

const GradientEmojis = () => {
    const user = useAuthStore((state) => state.user);
    const isSpecialUser = user?.email === SPECIAL_EMAIL;

    // Generate grid positions once per mount
    const scatteredElements = useMemo(() => generateGridPositions(), []);

    if (!isSpecialUser) return null;

    return (
        <View style={styles.glitterContainer} pointerEvents="none">
            {scatteredElements.map((el) => (
                <AnimatedEmoji
                    key={el.id}
                    emoji={el.emoji}
                    x={el.x}
                    y={el.y}
                    size={el.size}
                    baseOpacity={el.opacity}
                    delay={el.delay}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    glitterContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    glitterElement: {
        position: 'absolute',
        color: '#c9a0dc',
    },
});

export default GradientEmojis;

