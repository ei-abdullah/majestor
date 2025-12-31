import React, {useRef, useState} from "react";
import {Dimensions, Modal, Pressable, ScrollView, StyleSheet, View, Animated, FlatList} from "react-native";
import {Feather} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import HeartIntroScreen from "./HeartIntroScreen";
import RoseBloomScreen from "./RoseBloomScreen";
import RainbowScreen from "./RainbowScreen";
import SunshineScreen from "./SunshineScreen";

const {width, height} = Dimensions.get("window");

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
                <Pressable style={styles.closeButton} onPress={onClose}>
                    <Feather name="x" size={28} color="white" />
                </Pressable>
            </View>
        </Modal>
    );
}

// HeartIntroScreen and RoseBloomScreen now live in ./HeartIntroScreen and ./RoseBloomScreen

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
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
        top: 50,
        right: 20,
        padding: 10,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        zIndex: 100,
    },
});

export default LoveStoryModal;
