import React from "react";
import {View, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";

type Props = {
    driverName: string;
    driverAvatar?: string;
    phoneNumber?: string; // Only shown after acceptance
    vehicleType: "car" | "bike";
    vehicleModel: string;
    availableSeats?: number;
    showContact?: boolean;
    className?: string;
};

function DriverInfoCard({
    driverName,
    phoneNumber,
    vehicleType,
    vehicleModel,
    availableSeats,
    showContact = false,
    className = "",
}: Props) {
    const vehicleIcon = vehicleType === "car" ? "car-sport-outline" : "bicycle-outline";

    return (
        <View className={`bg-white rounded-2xl p-5 border border-gray-100 ${className}`}>
            {/* Driver Details */}
            <View className="flex-row items-center mb-4">
                {/* Avatar Circle */}
                <View className="w-12 h-12 rounded-full bg-mj-blue-50 items-center justify-center mr-3">
                    <Ionicons name="person-outline" size={24} color="#3A6FF8" />
                </View>

                {/* Info */}
                <View className="flex-1">
                    <Text className="text-base font-sans-semibold text-mj-text-main mb-1">
                        {driverName}
                    </Text>

                    {/* Phone (only shown after acceptance) */}
                    {showContact && phoneNumber && (
                        <View className="flex-row items-center">
                            <Ionicons name="call-outline" size={14} color="#6FD0C5" />
                            <Text className="text-sm text-mj-teal ml-1.5">
                                {phoneNumber}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Vehicle Info - Minimal */}
            <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                <View className="flex-row items-center">
                    <Ionicons name={vehicleIcon} size={18} color="#3A6FF8" />
                    <Text className="text-sm text-mj-text-secondary ml-2">
                        {vehicleModel}
                    </Text>
                </View>

                {availableSeats !== undefined && (
                    <View className="flex-row items-center">
                        <Ionicons name="people-outline" size={18} color="#6FD0C5" />
                        <Text className="text-sm text-mj-text-secondary ml-1">
                            {availableSeats} {availableSeats === 1 ? "seat" : "seats"}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

export default DriverInfoCard;

