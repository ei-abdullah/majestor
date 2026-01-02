import React from "react";
import {Modal, Pressable, Text, View} from "react-native";
import Animated, {
    FadeIn,
    FadeOut,
} from "react-native-reanimated";
import {Feather} from "@expo/vector-icons";

type CloseConfirmModalProps = {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

function CloseConfirmModal({visible, onConfirm, onCancel}: CloseConfirmModalProps) {
    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View className="flex-1 bg-black/70 justify-center items-center p-6">
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(150)}
                    className="bg-[#1a1a2e] rounded-3xl p-8 items-center w-full max-w-[320px] border border-white/10"
                    style={{
                        shadowColor: "#f43f5e",
                        shadowOffset: {width: 0, height: 8},
                        shadowOpacity: 0.3,
                        shadowRadius: 24,
                        elevation: 20,
                    }}
                >
                    {/* Icon */}
                    <View className="w-[70px] h-[70px] rounded-full bg-rose-500/15 justify-center items-center mb-5">
                        <Feather name="pause-circle" size={32} color="#f43f5e" />
                    </View>

                    {/* Message */}
                    <Text className="text-base text-white/85 text-center leading-6 mb-6">
                        Are you sure you want to{"\n"}leave this story?
                    </Text>

                    {/* Buttons */}
                    <View className="flex-row gap-3 w-full">
                        <Pressable
                            onPress={onCancel}
                            className="flex-1 py-3.5 rounded-xl bg-rose-500 items-center justify-center active:opacity-80 active:scale-[0.98]"
                        >
                            <Text className="text-white text-base font-semibold">Stay</Text>
                        </Pressable>

                        <Pressable
                            onPress={onConfirm}
                            className="flex-1 py-3.5 rounded-xl bg-white/10 border border-white/20 items-center justify-center active:opacity-80 active:scale-[0.98]"
                        >
                            <Text className="text-white/80 text-base font-medium">Leave</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

export default CloseConfirmModal;

