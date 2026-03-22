import React, {useEffect} from "react";
import {View, Text, Pressable, ActivityIndicator} from "react-native";
import {useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";

import {useRideRequestStore} from "@/src/stores/rideRequestStore";
import {useRecentRides} from "@/src/queries/ride.queries";
import {RecentRideResponse} from "@/src/types/ride";

import GradientView from "@/src/components/ui/GradientView";
import Card from "@/src/components/ui/Card";
import AvailableRidesList from "@/src/components/screens/carpool/rideRequest/AvailableRidesList";
import {useSelectedRideStore} from "@/src/stores/selectedRideStore";
import {useQueryClient} from "@tanstack/react-query";
import {stompService} from "@/src/services/stompService";
import {useCancelRideRequest} from "@/src/queries/rideRequest.queries";

function AvailableRides() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const {id, pickupLocationAddress, dropoffLocationAddress, numberOfPassengers, routeDistanceKm, clearBookingDetails} = useRideRequestStore();
    const {setRide} = useSelectedRideStore();

    const {data: recentRides, isPending: isLoadingRides , isError, refetch} = useRecentRides();
    const {mutate: cancelRideRequest, isPending: isCancelingRequest} = useCancelRideRequest(() => {
        clearBookingDetails();
        router.replace("/(tabs)/carpool")
    });

    useEffect(() => {
        stompService.connect();

        const topic = '/topic/available-rides';

        const subscription = stompService.subscribe(topic, async (message) => {
            await queryClient.invalidateQueries({ queryKey: ['ride'] });
        });

        return () => {
            stompService.unsubscribe(topic);
        };
    }, [queryClient]);

    function handleRidePress(ride: RecentRideResponse) {
        setRide(ride);
        router.push("/(tabs)/carpool/rideRequest/rideDetails");
    }

    function handleCancelSearch() {
        cancelRideRequest(id)
    }

    const searchHeader = (
        <View className="mb-4">
            <Card className="px-5 py-5 mb-4">
                <View className="relative flex-row items-center justify-center border-b border-gray-200 pb-3 mb-3">
                    <Text className="text-sm font-bold text-mj-text-main">Your Search</Text>
                    <Pressable
                        onPress={handleCancelSearch}
                        className="absolute -right-2 -top-2"
                        hitSlop={20}
                        disabled={isCancelingRequest}
                    >
                        {isCancelingRequest ? (
                            <ActivityIndicator size="small" color="#9CA3AF" />
                        ) : (
                            <Ionicons name="close-circle" size={24} color="#9CA3AF"/>
                        )}
                    </Pressable>
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

            {!isLoadingRides && !isError && (
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
                isPending={isLoadingRides}
                isError={isError}
                onRefetch={refetch}
                header={searchHeader}
                onRidePress={handleRidePress}
            />
        </GradientView>
    );
}

export default AvailableRides;