import React, {useEffect} from "react";
import {View, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";

import {useRideStore} from "@/src/stores/rideStore";
import {useGetBookings} from "@/src/queries/booking.queries";
import {GetBookingsResponse} from "@/src/types/booking";
import {useSelectedBookingStore} from "@/src/stores/selectedBookingStore";

import GradientView from "@/src/components/ui/GradientView";
import Card from "@/src/components/ui/Card";
import BookingRequestsList from "@/src/components/screens/carpool/ride/BookingRequestsList";
import {useQueryClient} from "@tanstack/react-query";
import {stompService} from "@/src/services/stompService";

export default function BookingRequests() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const {
        id,
        startLocationAddress,
        endLocationAddress,
        vehicleModal,
        vehicleType,
        availableSeats,
        routeDistanceKm,
    } = useRideStore();

    const {setBooking} = useSelectedBookingStore();
    const {data: bookings, isPending, isError, refetch} = useGetBookings(id);

    useEffect(() => {
        if(!id) return;

        stompService.connect();

        const topic = `/topic/ride-requests/${id}`

        const subscription = stompService.subscribe(topic, async (message) => {
            console.log(`Real-time update for ride ${id}:`, message.body);

            await queryClient.invalidateQueries({queryKey: ["booking"]})
        });

        return () => {
            stompService.unsubscribe(topic);
        }
    }, [id, queryClient]);

    function handleBookingPress(booking: GetBookingsResponse) {
        setBooking(booking);
        router.push("/(tabs)/carpool/ride/bookingDetails");
    }

    const vehicleIcon = vehicleType === "CAR" ? "car-sport-outline" : "bicycle-outline";

    const rideHeader = (
        <View className="mb-4">
            <Card className="px-5 py-5 mb-4">
                <View className="items-center pb-3 mb-3 border-b border-gray-200">
                    <Text className="text-sm font-bold text-mj-text-main">Your Ride</Text>
                </View>

                {/* Route */}
                <View className="mb-4">
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-mj-blue mr-2"/>
                        <Text className="text-sm text-mj-text-main font-medium flex-1" numberOfLines={1}>
                            {startLocationAddress}
                        </Text>
                    </View>
                    <View className="flex-row items-center my-1 ml-[3px]">
                        <View className="w-0.5 h-4 bg-gray-300"/>
                    </View>
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-mj-teal mr-2"/>
                        <Text className="text-sm text-mj-text-main font-medium flex-1" numberOfLines={1}>
                            {endLocationAddress}
                        </Text>
                    </View>
                </View>

                {/* Divider */}
                <View className="border-t border-gray-100 mb-3"/>

                {/* Vehicle & Seats */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Ionicons name={vehicleIcon as any} size={16} color="#5A6275"/>
                        <Text className="text-xs font-medium text-mj-text-secondary ml-1.5">
                            {vehicleModal}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="people-outline" size={16} color="#5A6275"/>
                        <Text className="text-xs font-medium text-mj-text-secondary ml-1">
                            {availableSeats} {availableSeats === 1 ? "seat" : "seats"}
                        </Text>
                    </View>
                </View>
            </Card>

            {!isPending && !isError && (
                <Text className="text-xs font-semibold text-mj-text-secondary mb-2 uppercase tracking-wide">
                    {bookings.length > 0
                        ? `${bookings.length} booking request${bookings.length === 1 ? "" : "s"}`
                        : "Booking Requests"}
                </Text>
            )}
        </View>
    );

    return (
        <GradientView>
            <BookingRequestsList
                bookings={bookings!}
                rideDistanceKm={routeDistanceKm}
                isPending={isPending}
                isError={isError}
                onRefetch={refetch}
                header={rideHeader}
                onBookingPress={handleBookingPress}
            />
        </GradientView>
    );
}