import React, {useRef, useState, useEffect, useCallback} from "react";
import {Dimensions, Modal, Pressable, StyleSheet, View, Animated, Text} from "react-native";
import {Feather} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import HeartIntroScreen from "./HeartIntroScreen";
import RoseBloomScreen from "./RoseBloomScreen";
import RainbowScreen from "./RainbowScreen";
import SunshineScreen from "./SunshineScreen";
import CloseConfirmModal from "./CloseConfirmModal";

const {width, height} = Dimensions.get("window");

const STORY_DURATION = 20000; // 20 seconds total

const storyPages = [
    {key: "intro", component: HeartIntroScreen},
    {key: "rose", component: RoseBloomScreen},
    {key: "rainbow", component: RainbowScreen},
    {key: "sunshine", component: SunshineScreen},
];

type LoveStoryModalProps = {
    visible: boolean;
    onClose: () => void;
};

function LoveStoryModal({visible, onClose}: LoveStoryModalProps) {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const startTimeRef = useRef<number>(0);

    // Start timer when modal becomes visible
    useEffect(() => {
        if (visible) {
            startTimeRef.current = Date.now();
            setProgress(0);
            setCurrentIndex(0);

            // Progress update interval
            const progressInterval = setInterval(() => {
                const elapsed = Date.now() - startTimeRef.current;
                const newProgress = Math.min(elapsed / STORY_DURATION, 1);
                setProgress(newProgress);

                if (newProgress >= 1) {
                    clearInterval(progressInterval);
                    onClose();
                }
            }, 50);

            timerRef.current = progressInterval;

            return () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            };
        }
    }, [visible, onClose]);

    // Handle close button press - show confirmation
    const handleClosePress = useCallback(() => {
        // Pause the timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setShowConfirmModal(true);
    }, []);

    // Confirm close
    const handleConfirmClose = useCallback(() => {
        setShowConfirmModal(false);
        onClose();
    }, [onClose]);

    // Cancel close - resume timer
    const handleCancelClose = useCallback(() => {
        setShowConfirmModal(false);

        // Resume timer from where we left off
        const elapsed = progress * STORY_DURATION;
        startTimeRef.current = Date.now() - elapsed;

        const progressInterval = setInterval(() => {
            const newElapsed = Date.now() - startTimeRef.current;
            const newProgress = Math.min(newElapsed / STORY_DURATION, 1);
            setProgress(newProgress);

            if (newProgress >= 1) {
                clearInterval(progressInterval);
                onClose();
            }
        }, 50);

        timerRef.current = progressInterval;
    }, [progress, onClose]);

    const handleScroll = Animated.event(
        [{nativeEvent: {contentOffset: {x: scrollX}}}],
        {
            useNativeDriver: false,
            listener: (event: any) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentIndex(index);
            },
        }
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            presentationStyle="overFullScreen"
            statusBarTranslucent
        >
            <View style={styles.backdrop}>
                <LinearGradient
                    colors={["#080210", "#1f0e33", "#290a4f"]}
                    style={StyleSheet.absoluteFill}
                />

                {/* Progress bar at top */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, {width: `${progress * 100}%`}]} />
                    </View>
                </View>

                <Animated.FlatList
                    data={storyPages}
                    keyExtractor={(item) => item.key}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    scrollEventThrottle={16}
                    onScroll={handleScroll}
                    decelerationRate="fast"
                    snapToInterval={width}
                    snapToAlignment="start"
                    renderItem={({item}) => {
                        const Component = item.component;
                        return (
                            <View style={{width, height}}>
                                <Component />
                            </View>
                        );
                    }}
                />

                {/* Page indicators */}
                <View style={styles.indicatorWrapper}>
                    {storyPages.map((page, index) => (
                        <View
                            key={page.key}
                            style={[
                                styles.indicatorDot,
                                currentIndex === index && styles.indicatorDotActive
                            ]}
                        />
                    ))}
                </View>

                {/* Close button */}
                <Pressable style={styles.closeButton} onPress={handleClosePress}>
                    <Feather name="x" size={24} color="white" />
                </Pressable>

                {/* Time remaining indicator */}
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>
                        {Math.ceil((1 - progress) * STORY_DURATION / 1000)}s
                    </Text>
                </View>
            </View>

            {/* Confirmation Modal */}
            <CloseConfirmModal
                visible={showConfirmModal}
                onConfirm={handleConfirmClose}
                onCancel={handleCancelClose}
            />
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
    },
    progressContainer: {
        position: "absolute",
        top: 50,
        left: 60,
        right: 20,
        zIndex: 100,
    },
    progressTrack: {
        height: 3,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 2,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#f43f5e",
        borderRadius: 2,
    },
    indicatorWrapper: {
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    indicatorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
    },
    indicatorDotActive: {
        backgroundColor: "#ff6f91",
        width: 24,
    },
    closeButton: {
        position: "absolute",
        top: 44,
        left: 16,
        padding: 8,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        zIndex: 100,
    },
    timeContainer: {
        position: "absolute",
        top: 44,
        right: 16,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: 100,
    },
    timeText: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 12,
        fontWeight: "500",
    },
});

export default LoveStoryModal;

