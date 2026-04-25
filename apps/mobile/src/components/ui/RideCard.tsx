import React from "react";
import {View, Text, Pressable} from "react-native";
import {Ionicons} from "@expo/vector-icons";

type Props = {
    driverName: string;
    driverAvatar?: string;
    vehicleType: "car" | "bike";
    vehicleModel: string;
    availableSeats: number;
    startLocation: string;
    endLocation: string;
    deviation?: number;
    postedTimeAgo?: string;
    rating?: number;
    totalRides?: number;
    onPress?: () => void;
    className?: string;
};

function RideCard({
    driverName,
    vehicleType,
    vehicleModel,
    availableSeats,
    startLocation,
    endLocation,
    deviation,
    postedTimeAgo,
    rating,
    totalRides,
    onPress,
    className = "",
}: Props) {
    const vehicleIcon = vehicleType === "car" ? "car-sport-outline" : "bicycle-outline";

    return (
        <Pressable
            onPress={onPress}
            className={`bg-white rounded-2xl p-5 border border-gray-100 ${className}`}
            style={({pressed}) => ({
                opacity: pressed ? 0.85 : 1,
            })}
        >
            {/* Driver Info */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center flex-1">
                    {/* Avatar Circle */}
                    <View className="w-10 h-10 rounded-full bg-mj-blue-50 items-center justify-center mr-3">
                        <Ionicons name="person-outline" size={20} color="#3A6FF8" />
                    </View>

                    {/* Name */}
                    <Text className="text-base font-sans-semibold text-mj-text-main">
                        {driverName}
                    </Text>
                </View>

                {/* Vehicle Icon */}
                <Ionicons name={vehicleIcon} size={22} color="#6FD0C5" />
            </View>

            {/* Route - Minimal */}
            <View className="mb-4">
                <Text className="text-sm text-mj-text-main mb-1" numberOfLines={1}>
                    {startLocation}
                </Text>
                <View className="flex-row items-center my-1.5">
                    <View className="w-0.5 h-3 bg-gray-300" />
                </View>
                <Text className="text-sm text-mj-text-main" numberOfLines={1}>
                    {endLocation}
                </Text>
            </View>

            {/* Info Row */}
            <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                <View className="flex-row items-center">
                    <Ionicons name={vehicleIcon} size={16} color="#5A6275" />
                    <Text className="text-xs text-mj-text-secondary ml-1.5">
                        {vehicleModel}
                    </Text>
                </View>

                <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center">
                        <Ionicons name="people-outline" size={16} color="#6FD0C5" />
                        <Text className="text-xs text-mj-text-secondary ml-1">
                            {availableSeats}
                        </Text>
                    </View>

                    {deviation !== undefined && (
                        <Text className="text-xs font-sans-medium text-mj-teal">
                            +{deviation.toFixed(1)} km
                        </Text>
                    )}
                </View>
            </View>
        </Pressable>
    );
}

export default RideCard;

