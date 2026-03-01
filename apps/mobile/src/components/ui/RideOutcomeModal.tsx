import React from "react";
import {Modal, View, Text, Pressable} from "react-native";
import {Ionicons} from "@expo/vector-icons";

type Outcome = "completed" | "cancelled";

interface Props {
    visible: boolean;
    outcome: Outcome;
    onDismiss: () => void;
}

export default function RideOutcomeModal({visible, outcome, onDismiss}: Props) {
    const isCompleted = outcome === "completed";

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onDismiss}
        >
            <View className="flex-1 justify-center items-center px-7" style={{backgroundColor: "rgba(18,24,38,0.55)"}}>
                <View className={`w-full rounded-3xl overflow-hidden ${isCompleted ? "bg-mj-blue-50" : "bg-red-50"}`}
                      style={{shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: {width: 0, height: 4}, elevation: 10}}>

                    {/* Accent bar */}
                    <View className={`h-1 ${isCompleted ? "bg-mj-blue" : "bg-mj-error"}`}/>

                    {/* Content */}
                    <View className="px-8 pt-9 pb-7 items-center">

                        {/* Icon circle */}
                        <View className={`w-20 h-20 rounded-full items-center justify-center mb-5 ${isCompleted ? "bg-mj-blue-100" : "bg-red-100"}`}>
                            <Ionicons
                                name={isCompleted ? "checkmark-circle" : "close-circle"}
                                size={44}
                                color={isCompleted ? "#3A6FF8" : "#E94F37"}
                            />
                        </View>

                        <Text className="text-xl font-bold text-mj-text-main mb-2 text-center">
                            {isCompleted ? "Ride Completed" : "Ride Cancelled"}
                        </Text>

                        <Text className="text-sm text-mj-text-secondary text-center leading-6">
                            {isCompleted
                                ? "Your ride has ended successfully. Thank you for using Majestor!"
                                : "This ride has been cancelled. You can book or post another ride anytime."}
                        </Text>
                    </View>

                    {/* Divider */}
                    <View className={`h-px mx-6 ${isCompleted ? "bg-mj-blue-100" : "bg-red-100"}`}/>

                    {/* Button */}
                    <View className="px-6 pt-4 pb-6">
                        <Pressable
                            onPress={onDismiss}
                            className={`h-14 rounded-2xl flex-row items-center justify-center ${isCompleted ? "bg-mj-blue" : "bg-mj-error"}`}
                            style={({pressed}) => ({opacity: pressed ? 0.82 : 1})}
                        >
                            <Ionicons name="home" size={18} color="#fff"/>
                            <Text className="text-white text-base font-bold ml-2">
                                Back to Home
                            </Text>
                        </Pressable>
                    </View>

                </View>
            </View>
        </Modal>
    );
}
