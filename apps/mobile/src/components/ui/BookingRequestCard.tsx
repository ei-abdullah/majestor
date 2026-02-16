import React from "react";
import {View, Text, Pressable} from "react-native";
import {Ionicons} from "@expo/vector-icons";

type Props = {
    bookerName: string;
    bookerAvatar?: string;
    pickupLocation: string;
    dropoffLocation: string;
    passengers: number;
    deviation: number;
    isNew?: boolean;
    onPress?: () => void;
    className?: string;
};

function BookingRequestCard({
    bookerName,
    pickupLocation,
    dropoffLocation,
    passengers,
    deviation,
    isNew = false,
    onPress,
    className = "",
}: Props) {
    return (
        <Pressable
            onPress={onPress}
            className={`bg-white rounded-2xl p-5 border ${
                isNew ? "border-mj-blue" : "border-gray-100"
            } ${className}`}
            style={({pressed}) => ({
                opacity: pressed ? 0.85 : 1,
            })}
        >
            {/* Booker Info */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center flex-1">
                    {/* Avatar Circle */}
                    <View className="w-10 h-10 rounded-full bg-mj-blue-50 items-center justify-center mr-3">
                        <Ionicons name="person-outline" size={20} color="#3A6FF8" />
                    </View>

                    <Text className="text-base font-semibold text-mj-text-main flex-1">
                        {bookerName}
                    </Text>
                </View>

                {isNew && (
                    <View className="bg-mj-blue px-2.5 py-1 rounded-full">
                        <Text className="text-white text-xs font-semibold">NEW</Text>
                    </View>
                )}
            </View>

            {/* Locations - Minimal */}
            <View className="mb-3">
                <View className="flex-row items-center mb-2">
                    <Ionicons name="people-outline" size={16} color="#5A6275" />
                    <Text className="text-sm text-mj-text-secondary ml-2">
                        {passengers} {passengers === 1 ? "passenger" : "passengers"}
                    </Text>
                </View>

                <Text className="text-sm text-mj-text-main mb-1" numberOfLines={1}>
                    {pickupLocation}
                </Text>
                <View className="flex-row items-center my-1">
                    <View className="w-0.5 h-3 bg-gray-300 ml-0.5" />
                </View>
                <Text className="text-sm text-mj-text-main" numberOfLines={1}>
                    {dropoffLocation}
                </Text>
            </View>

            {/* Deviation */}
            <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                <Text className="text-xs text-mj-text-muted">
                    Tap to view details →
                </Text>
                <View className="flex-row items-center">
                    <Ionicons name="git-branch-outline" size={14} color="#6FD0C5" />
                    <Text className="text-sm font-semibold text-mj-teal ml-1">
                        +{deviation.toFixed(1)} km
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}

export default BookingRequestCard;

