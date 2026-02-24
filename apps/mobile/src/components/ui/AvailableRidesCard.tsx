import {View, Text, Image, Pressable} from "react-native";
import {Ionicons} from "@expo/vector-icons";

import Card from "@/src/components/ui/Card";
import {RecentRideResponse} from "@/src/types/ride";
import {timeAgo} from "@/src/utils/time.utils";

interface AvailableRidesCardProps {
    recentRide: RecentRideResponse;
    rideDistance?: number;
    className?: string;
    onPress?: () => void;
}

function AvailableRidesCard({recentRide, rideDistance, className = "", onPress}: AvailableRidesCardProps) {
    const vehicleIcon = recentRide.vehicleType === "CAR" ? "car-sport-outline" : "bicycle-outline";
    const deviationKm = recentRide.routeDistanceKm - rideDistance!;

    return (
        <Card className={`px-5 py-4 ${className}`}>
            <Pressable onPress={onPress}>
                {/* Profile Row */}
                <View className="flex-row items-center mb-4">
                    {recentRide.ridePosterImageUrl ? (
                        <View className="w-11 h-11 rounded-full overflow-hidden mr-3">
                            <Image
                                source={{uri: recentRide.ridePosterImageUrl}}
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
                        <Text className="text-sm font-semibold text-mj-text-main" numberOfLines={1}>
                            {recentRide.ridePosterUsername}
                        </Text>
                        <Text className="text-xs text-mj-text-secondary" numberOfLines={1}>
                            {recentRide.ridePosterEmail}
                        </Text>
                    </View>
                    <View className="bg-mj-blue-50 rounded-full px-2.5 py-1">
                        <Text className="text-xs font-medium text-mj-blue">
                            {timeAgo(recentRide.createdAt)}
                        </Text>
                    </View>
                </View>

                {/* Route */}
                <View className="mb-4">
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-mj-blue mr-2"/>
                        <Text className="text-sm text-mj-text-main flex-1" numberOfLines={1}>
                            {recentRide.startLocationAddress}
                        </Text>
                    </View>
                    <View className="flex-row items-center my-1 ml-[3px]">
                        <View className="w-0.5 h-4 bg-gray-300"/>
                    </View>
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-mj-teal mr-2"/>
                        <Text className="text-sm text-mj-text-main flex-1" numberOfLines={1}>
                            {recentRide.endLocationAddress}
                        </Text>
                    </View>
                </View>

                {/* Divider */}
                <View className="border-t border-gray-100 mb-3"/>

                {/* Vehicle & Seats Row */}
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                        <Ionicons name={vehicleIcon} size={16} color="#5A6275"/>
                        <Text className="text-xs font-medium text-mj-text-secondary ml-1.5">
                            {recentRide.vehicleModal} | {recentRide.licensePlate}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="people-outline" size={16} color="#5A6275"/>
                        <Text className="text-xs font-medium text-mj-text-secondary ml-1">
                            {recentRide.availableSeats} seats
                        </Text>
                    </View>
                </View>

                {/* Deviation */}
                <View className="flex-row items-center">
                    <Ionicons name="git-branch-outline" size={16} color="#5A6275"/>
                    <Text className="text-xs font-medium text-mj-text-secondary ml-1">
                        +{deviationKm.toFixed(2)} km deviation
                    </Text>
                </View>
            </Pressable>
        </Card>
    );
}

export default AvailableRidesCard;