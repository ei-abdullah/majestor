import {View, Text, FlatList, ActivityIndicator} from "react-native";
import {useRideRequestStore} from "@/src/stores/rideRequestStore";
import {useRecentRides} from "@/src/queries/ride.queries";
import React from "react";
import Card from "@/src/components/ui/Card";
import {Ionicons} from "@expo/vector-icons";
import GradientView from "@/src/components/ui/GradientView";
import AvailableRidesCard from "@/src/components/ui/AvailableRidesCard";
import {RecentRideResponse} from "@/src/types/ride";
import {useRouter} from "expo-router";
import {useSelectedRideStore} from "@/src/stores/selectedRideStore";

function ListEmpty({isLoading, isError}: { isLoading: boolean; isError: boolean }) {
    if (isLoading) {
        return (
            <View className="items-center py-10">
                <ActivityIndicator size="large" color="#3A6FF8"/>
                <Text className="text-sm text-mj-text-secondary mt-3">Looking for rides...</Text>
            </View>
        );
    }
    if (isError) {
        return (
            <View className="items-center py-10">
                <Ionicons name="alert-circle-outline" size={40} color="#F87171"/>
                <Text className="text-sm text-mj-text-secondary mt-3">Failed to load rides. Pull down to retry.</Text>
            </View>
        );
    }
    return (
        <View className="items-center py-10">
            <Ionicons name="car-outline" size={40} color="#C4C9D4"/>
            <Text className="text-sm text-mj-text-secondary mt-3">No rides available right now.</Text>
        </View>
    );
}

function AvailableRides() {
    const router = useRouter();

    const {pickupLocationAddress, dropoffLocationAddress, numberOfPassengers, routeDistanceKm} = useRideRequestStore();
    const {data: recentRides, isLoading, isError} = useRecentRides({
        refetchInterval: 1000 * 60, // 1 min, for > 2: 1000 * 60 * 2
    });
    const {setRide} = useSelectedRideStore();

    const rides = (recentRides ?? []) as RecentRideResponse[];

    const SearchHeader = (
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

            {!isLoading && !isError && (
                <Text className="text-xs font-semibold text-mj-text-secondary mb-2 uppercase tracking-wide">
                    {rides.length > 0 ? `${rides.length} ride${rides.length === 1 ? "" : "s"} found` : "Available Rides"}
                </Text>
            )}
        </View>
    );

    return (
        <GradientView>
            <FlatList<RecentRideResponse>
                className="mx-5 mt-2"
                data={rides}
                keyExtractor={(item) => String(item.id)}
                ListHeaderComponent={SearchHeader}
                ListEmptyComponent={<ListEmpty isLoading={isLoading} isError={isError}/>}
                renderItem={({item}) => (
                    <AvailableRidesCard
                        recentRide={item}
                        rideDistance={routeDistanceKm}
                        className="mb-4"
                        onPress={() => {
                            setRide(item);
                            router.push("/(tabs)/carpool/rideRequest/rideDetails")
                        }}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 40}}
            />
        </GradientView>
    );
}

export default AvailableRides;