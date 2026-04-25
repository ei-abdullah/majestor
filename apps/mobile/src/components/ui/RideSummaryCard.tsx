import React from "react";
import {View, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";

type Props = {
    startLocation: string;
    endLocation: string;
    vehicleType: "car" | "bike";
    vehicleModel: string;
    availableSeats: number;
    className?: string;
};

function RideSummaryCard({
    startLocation,
    endLocation,
    vehicleType,
    vehicleModel,
    availableSeats,
    className = "",
}: Props) {
    const vehicleIcon = vehicleType === "car" ? "car-sport-outline" : "bicycle-outline";

    return (
        <View className={`bg-white rounded-2xl p-5 border border-gray-100 ${className}`}>
            {/* Header */}
            <Text className="text-sm text-mj-text-secondary mb-3">
                Your Ride
            </Text>

            {/* Route */}
            <View className="mb-4">
                <Text className="text-base text-mj-text-main font-sans-medium mb-1">
                    {startLocation}
                </Text>
                <View className="flex-row items-center my-2">
                    <View className="w-0.5 h-4 bg-mj-blue" />
                </View>
                <Text className="text-base text-mj-text-main font-sans-medium">
                    {endLocation}
                </Text>
            </View>

            {/* Vehicle Info */}
            <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                <View className="flex-row items-center">
                    <Ionicons name={vehicleIcon} size={18} color="#3A6FF8" />
                    <Text className="text-sm text-mj-text-secondary ml-2">
                        {vehicleModel}
                    </Text>
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="people-outline" size={18} color="#6FD0C5" />
                    <Text className="text-sm text-mj-text-secondary ml-1">
                        {availableSeats} {availableSeats === 1 ? "seat" : "seats"}
                    </Text>
                </View>
            </View>
        </View>
    );
}

export default RideSummaryCard;

