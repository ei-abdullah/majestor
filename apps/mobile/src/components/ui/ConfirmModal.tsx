import React from "react";
import {Modal, View, Text, Pressable} from "react-native";
import {Ionicons} from "@expo/vector-icons";

interface Props {
    visible: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    visible,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Keep",
    onConfirm,
    onCancel,
}: Props) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onCancel}
        >
            <View
                className="flex-1 justify-center items-center px-7"
                style={{backgroundColor: "rgba(18,24,38,0.55)"}}
            >
                <View
                    className="w-full bg-white rounded-3xl overflow-hidden"
                    style={{shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: {width: 0, height: 4}, elevation: 10}}
                >
                    <View className="h-1 bg-mj-error"/>

                    <View className="px-8 pt-9 pb-7 items-center">
                        <View className="w-16 h-16 rounded-full items-center justify-center mb-5 bg-red-100">
                            <Ionicons name="warning-outline" size={36} color="#E94F37"/>
                        </View>

                        <Text className="text-xl font-bold text-mj-text-main mb-2 text-center">
                            {title}
                        </Text>

                        <Text className="text-sm text-mj-text-secondary text-center leading-6">
                            {message}
                        </Text>
                    </View>

                    <View className="h-px mx-6 bg-red-100"/>

                    <View className="px-6 pt-4 pb-6 flex-row gap-3">
                        <Pressable
                            onPress={onCancel}
                            className="flex-1 h-14 rounded-2xl border border-gray-200 items-center justify-center"
                            style={({pressed}) => ({opacity: pressed ? 0.7 : 1})}
                        >
                            <Text className="text-mj-text-main font-semibold text-base">{cancelLabel}</Text>
                        </Pressable>
                        <Pressable
                            onPress={onConfirm}
                            className="flex-1 h-14 rounded-2xl bg-mj-error items-center justify-center"
                            style={({pressed}) => ({opacity: pressed ? 0.82 : 1})}
                        >
                            <Text className="text-white font-bold text-base">{confirmLabel}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
