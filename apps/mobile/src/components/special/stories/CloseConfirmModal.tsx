import React from "react";
import {Modal, Pressable, Text, View, StyleSheet} from "react-native";
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
            <View style={styles.backdrop}>
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(150)}
                    style={styles.modalContainer}
                >
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <Feather name="pause-circle" size={32} color="#f43f5e" />
                    </View>

                    {/* Message */}
                    <Text style={styles.messageText}>
                        Are you sure you want to{"\n"}leave this story?
                    </Text>

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                        <Pressable
                            onPress={onCancel}
                            style={({pressed}) => [
                                styles.button,
                                styles.stayButton,
                                pressed && styles.buttonPressed,
                            ]}
                        >
                            <Text style={styles.stayButtonText}>Stay</Text>
                        </Pressable>

                        <Pressable
                            onPress={onConfirm}
                            style={({pressed}) => [
                                styles.button,
                                styles.leaveButton,
                                pressed && styles.buttonPressed,
                            ]}
                        >
                            <Text style={styles.leaveButtonText}>Leave</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    modalContainer: {
        backgroundColor: "#1a1a2e",
        borderRadius: 24,
        padding: 32,
        alignItems: "center",
        width: "100%",
        maxWidth: 320,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        shadowColor: "#f43f5e",
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 20,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "rgba(244, 63, 94, 0.15)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    messageText: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.85)",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 24,
    },
    buttonRow: {
        flexDirection: "row",
        gap: 12,
        width: "100%",
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    stayButton: {
        backgroundColor: "#f43f5e",
    },
    leaveButton: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.2)",
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{scale: 0.98}],
    },
    stayButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    leaveButtonText: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 16,
        fontWeight: "500",
    },
});

export default CloseConfirmModal;

