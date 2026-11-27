import {View, Text, Image, Pressable} from "react-native";
import {Ionicons} from "@expo/vector-icons";

import Card from "@/src/components/ui/Card";
import {RecentRideResponse} from "@/src/types/ride";
import {timeAgo} from "@/src/utils/time.utils";
import {useFareConfig} from "@/src/queries/ride.queries";
import {calculateFare, estimateDetourKm} from "@/src/utils/fare.utils";
import {useRideRequestStore} from "@/src/stores/rideRequestStore";

interface AvailableRidesCardProps {
    recentRide: RecentRideResponse;
    rideDistance?: number;
    className?: string;
    onPress?: () => void;
}

function AvailableRidesCard({recentRide, rideDistance, className = "", onPress}: AvailableRidesCardProps) {
    const vehicleIcon = recentRide.vehicleType === "CAR" ? "car-sport-outline" : "bicycle-outline";
    const {
        pickupLocationLat,
        pickupLocationLng,
        dropoffLocationLat,
        dropoffLocationLng,
    } = useRideRequestStore();

    const fallbackDetourKm = estimateDetourKm({
        driverStartLat: recentRide.startLocationLat,
        driverStartLng: recentRide.startLocationLng,
        driverEndLat: recentRide.endLocationLat,
        driverEndLng: recentRide.endLocationLng,
        pickupLat: pickupLocationLat,
        pickupLng: pickupLocationLng,
        dropoffLat: dropoffLocationLat,
        dropoffLng: dropoffLocationLng,
    });

    const deviationKm = recentRide.estimatedDetourKm != null
        ? Math.max(0, recentRide.estimatedDetourKm)
        : fallbackDetourKm;

    const {data: fareConfig} = useFareConfig();
    const estimatedFare = fareConfig ? calculateFare(deviationKm, recentRide.vehicleType, fareConfig) : null;

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
                        <View className="flex-row items-center gap-1.5">
                            <Text className="text-sm font-sans-semibold text-mj-text-main" numberOfLines={1}>
                                {recentRide.ridePosterUsername}
                            </Text>
                            {recentRide.isPosterElite && (
                                <View className="bg-amber-100 px-1.5 py-0.5 rounded-full">
                                    <Text className="text-[10px] font-sans-bold text-amber-700">Elite</Text>
                                </View>
                            )}
                        </View>
                        <Text className="text-xs text-mj-text-secondary" numberOfLines={1}>
                            {recentRide.ridePosterEmail}
                        </Text>
                    </View>
                    <View className="bg-mj-blue-50 rounded-full px-2.5 py-1">
                        <Text className="text-xs font-sans-medium text-mj-blue">
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
                        <Text className="text-xs font-sans-medium text-mj-text-secondary ml-1.5">
                            {recentRide.vehicleModal} | {recentRide.licensePlate}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="people-outline" size={16} color="#5A6275"/>
                        <Text className="text-xs font-sans-medium text-mj-text-secondary ml-1">
                            {recentRide.availableSeats} {recentRide.availableSeats === 1 ? "seat" : "seats"}
                        </Text>
                    </View>
                </View>

                {/* Proximity + Deviation + Fare */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                        <View className="flex-row items-center">
                            <Ionicons name="git-branch-outline" size={16} color="#5A6275"/>
                            <Text className="text-xs font-sans-medium text-mj-text-secondary ml-1">
                                +{deviationKm.toFixed(2)} km detour
                            </Text>
                        </View>
                        {recentRide.pickupDistanceKm != null && (
                            <View className="flex-row items-center">
                                <Ionicons name="navigate-outline" size={14} color="#3A6FF8"/>
                                <Text className="text-xs font-sans-medium text-mj-blue ml-1">
                                    {recentRide.pickupDistanceKm.toFixed(1)} km away
                                </Text>
                            </View>
                        )}
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

export default AvailableRidesCard;
