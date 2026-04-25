import React from "react";
import {View, Text, Image, Pressable} from "react-native";
import {Ionicons} from "@expo/vector-icons";

import Card from "@/src/components/ui/Card";
import {GetBookingsResponse} from "@/src/types/booking";
import {useFareConfig} from "@/src/queries/ride.queries";
import {calculateFare, VehicleType} from "@/src/utils/fare.utils";

interface BookingRequestCardProps {
    booking: GetBookingsResponse;
    rideDistanceKm: number;
    vehicleType: VehicleType;
    className?: string;
    onPress?: () => void;
}

function BookingRequestCard({booking, rideDistanceKm, vehicleType, className = "", onPress}: BookingRequestCardProps) {
    const deviationKm = Math.abs(booking.routeDistanceKm - rideDistanceKm);
    const {data: fareConfig} = useFareConfig();
    const estimatedFare = fareConfig ? calculateFare(deviationKm, vehicleType, fareConfig) : null;

    return (
        <Card className={`px-5 py-4 ${className}`}>
            <Pressable onPress={onPress}>
                {/* Profile Row */}
                <View className="flex-row items-center mb-4">
                    {booking.rideRequesterAvatar ? (
                        <View className="w-11 h-11 rounded-full overflow-hidden mr-3">
                            <Image
                                source={{uri: booking.rideRequesterAvatar}}
                                style={{width: "100%", height: "100%"}}
                                resizeMode="cover"
                            />
                        </View>
                    ) : (
                        <View className="w-11 h-11 rounded-full bg-mj-blue-50 items-center justify-center mr-3">
                            <Ionicons name="person-outline" size={20} color="#3A6FF8"/>
                        </View>
                    )}
                    <View className="flex-1">
                        <Text className="text-sm font-sans-semibold text-mj-text-main" numberOfLines={1}>
                            {booking.rideRequesterUsername}
                        </Text>
                        <Text className="text-xs text-mj-text-secondary" numberOfLines={1}>
                            {booking.rideRequesterEmail}
                        </Text>
                    </View>
                </View>

                {/* Route */}
                <View className="mb-4">
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-mj-blue mr-2"/>
                        <Text className="text-sm text-mj-text-main flex-1" numberOfLines={1}>
                            {booking.pickupLocationAddress}
                        </Text>
                    </View>
                    <View className="flex-row items-center my-1 ml-[3px]">
                        <View className="w-0.5 h-4 bg-gray-300"/>
                    </View>
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-mj-teal mr-2"/>
                        <Text className="text-sm text-mj-text-main flex-1" numberOfLines={1}>
                            {booking.dropoffLocationAddress}
                        </Text>
                    </View>
                </View>

                {/* Divider */}
                <View className="border-t border-gray-100 mb-3"/>

                {/* Passengers Row */}
                <View className="flex-row items-center mb-2">
                    <Ionicons name="people-outline" size={16} color="#5A6275"/>
                    <Text className="text-xs font-sans-medium text-mj-text-secondary ml-1.5">
                        {booking.numberOfPassengers} {booking.numberOfPassengers === 1 ? "passenger" : "passengers"}
                    </Text>
                </View>

                {/* Deviation + Fare Row */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Ionicons name="git-branch-outline" size={16} color="#5A6275"/>
                        <Text className="text-xs font-sans-medium text-mj-text-secondary ml-1">
                            +{deviationKm.toFixed(2)} km deviation
                        </Text>
                    </View>
                    {estimatedFare != null && (
                        <View className="flex-row items-center">
                            <Ionicons name="cash-outline" size={16} color="#4CB8AD"/>
                            <Text className="text-xs font-sans-semibold text-mj-blue ml-1">
                                ~Rs {estimatedFare}
                            </Text>
                        </View>
                    )}
                </View>
            </Pressable>
        </Card>
    );
}

export default BookingRequestCard;

