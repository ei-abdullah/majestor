import React from "react";
import {View, Text} from "react-native";
import {useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

import {useRideRequestStore} from "@/src/stores/rideRequestStore";
import {useRecentRides} from "@/src/queries/ride.queries";
import {RecentRideResponse} from "@/src/types/ride";

import GradientView from "@/src/components/ui/GradientView";
import Card from "@/src/components/ui/Card";
import AvailableRidesList from "@/src/components/screens/carpool/rideRequest/AvailableRidesList";
import {useSelectedRideStore} from "@/src/stores/selectedRideStore";

function AvailableRides() {
    const router = useRouter();

    const {pickupLocationAddress, dropoffLocationAddress, numberOfPassengers, routeDistanceKm} = useRideRequestStore();
    const {setRide} = useSelectedRideStore();

    const {data: recentRides, isPending, isError, refetch} = useRecentRides({
        refetchInterval: 1000 * 60,
    });

    function handleRidePress(ride: RecentRideResponse) {
        setRide(ride);
        router.push("/(tabs)/carpool/rideRequest/rideDetails");
    }

    const searchHeader = (
        <View className="mb-4">
            <Card className="px-5 py-5 mb-4">
                <View className="items-center pb-3 mb-3 border-b border-gray-200">
                    <Text className="text-sm font-bold text-mj-text-main">Your Search</Text>
                </View>

                <View className="mb-4 py-3">
                    <Text className="text-sm text-center text-mj-text-main font-medium mb-1" numberOfLines={1}>
                        {pickupLocationAddress}
                    </Text>
                    {dropoffLocationAddress ? (
                        <>
                            <View className="flex-row items-center justify-center my-2">
                                <View className="w-0.5 h-4 bg-mj-teal"/>
                            </View>
                            <Text className="text-sm text-center text-mj-text-main font-medium" numberOfLines={1}>
                                {dropoffLocationAddress}
                            </Text>
                        </>
                    ) : null}
                </View>

                <View className="flex-row items-center">
                    <Ionicons name="people-outline" size={16} color="#6FD0C5"/>
                    <Text className="text-sm text-mj-text-secondary ml-2">
                        {numberOfPassengers} {numberOfPassengers === 1 ? "passenger" : "passengers"}
                    </Text>
                </View>
            </Card>

            {!isPending && !isError && (
                <Text className="text-xs font-semibold text-mj-text-secondary mb-2 uppercase tracking-wide">
                    {recentRides.length > 0 ? `${recentRides.length} ride${recentRides.length === 1 ? "" : "s"} found` : "Available Rides"}
                </Text>
            )}
        </View>
    );

    return (
        <GradientView>
            <AvailableRidesList
                rides={recentRides!}
                rideDistance={routeDistanceKm}
                isPending={isPending}
                isError={isError}
                onRefetch={refetch}
                header={searchHeader}
                onRidePress={handleRidePress}
            />
        </GradientView>
    );
}

export default AvailableRides;