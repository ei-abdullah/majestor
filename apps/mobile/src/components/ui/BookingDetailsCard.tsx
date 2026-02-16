import React from "react";
import {View, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";

type Props = {
    pickupLocation: string;
    dropoffLocation?: string;
    passengers?: number;
    className?: string;
};

function BookingDetailsCard({
    pickupLocation,
    dropoffLocation,
    passengers,
    className = "",
}: Props) {
    return (
        <View className={`bg-white rounded-2xl p-5 border border-gray-100 ${className}`}>
            {/* Header */}
            <Text className="text-sm text-mj-text-secondary mb-3">
                Your Request
            </Text>

            {/* Locations - Minimal */}
            <View className="mb-3">
                <Text className="text-sm text-mj-text-main font-medium mb-1" numberOfLines={1}>
                    {pickupLocation}
                </Text>

                {dropoffLocation && (
                    <>
                        <View className="flex-row items-center my-2">
                            <View className="w-0.5 h-4 bg-mj-blue" />
                        </View>
                        <Text className="text-sm text-mj-text-main font-medium" numberOfLines={1}>
                            {dropoffLocation}
                        </Text>
                    </>
                )}
            </View>

            {/* Passengers */}
            {passengers !== undefined && (
                <View className="flex-row items-center pt-3 border-t border-gray-100">
                    <Ionicons name="people-outline" size={18} color="#6FD0C5" />
                    <Text className="text-sm text-mj-text-secondary ml-2">
                        {passengers} {passengers === 1 ? "passenger" : "passengers"}
                    </Text>
                </View>
            )}
        </View>
    );
}

export default BookingDetailsCard;

