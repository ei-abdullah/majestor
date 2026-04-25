import React, {useEffect, useState} from "react";
import {View, Text, ActivityIndicator, Pressable} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Href, useRouter} from "expo-router";

import {useRideStore} from "@/src/stores/rideStore";
import {useGetBookings} from "@/src/queries/booking.queries";
import {GetBookingsResponse} from "@/src/types/booking";
import {useSelectedBookingStore} from "@/src/stores/selectedBookingStore";

import GradientView from "@/src/components/ui/GradientView";
import Card from "@/src/components/ui/Card";
import BookingRequestsList from "@/src/components/screens/carpool/ride/BookingRequestsList";
import {useQueryClient} from "@tanstack/react-query";
import {stompService} from "@/src/services/stompService";
import {useCancelPostedRide} from "@/src/queries/ride.queries";
import ConfirmModal from "@/src/components/ui/ConfirmModal";

export default function BookingRequests() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const {
        id,
        startLocationAddress,
        endLocationAddress,
        vehicleModal,
        vehicleType,
        availableSeats,
        routeDistanceKm,
        clearRideDetails,
    } = useRideStore();

    const {setBooking} = useSelectedBookingStore();
    const {data: bookings, isPending, isError, refetch} = useGetBookings(id);

    const {mutate: cancelPostedRide, isPending: isCancelling} = useCancelPostedRide(() => {
        clearRideDetails();
        router.replace("/(tabs)/carpool" as Href);
    });

    useEffect(() => {
        if (!id) return;

        stompService.connect();

        const topic = `/topic/ride-requests/${id}`

        const subscription = stompService.subscribe(topic, async (message) => {
            await queryClient.invalidateQueries({queryKey: ["booking"]})
        });

        return () => {
            stompService.unsubscribe(topic);
        }
    }, [id, queryClient]);

    function handleBookingPress(booking: GetBookingsResponse) {
        setBooking(booking);
        router.push("/(tabs)/carpool/ride/bookingDetails" as Href);
    }

    const vehicleIcon = vehicleType === "CAR" ? "car-sport-outline" : "bicycle-outline";

    const rideHeader = (
        <View className="mb-4">
            <Card className="px-5 py-5 mb-4">
                <View className="relative flex-row items-center justify-center pb-3 mb-3 border-b border-gray-200">
                    <Text className="text-sm font-sans-bold text-mj-text-main">Your Ride</Text>
                    <Pressable
                        onPress={() => setShowCancelConfirm(true)}
                        className="absolute -right-2 -top-2"
                        hitSlop={20}
                        disabled={isCancelling}
                    >
                        {isCancelling ? (
                            <ActivityIndicator size="small" color="#9CA3AF"/>
                        ) : (
                            <Ionicons name="close-circle" size={24} color="#9CA3AF"/>
                        )}
                    </Pressable>
                </View>

                {/* Route */}
                <View className="mb-4">
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-mj-blue mr-2"/>
                        <Text className="text-sm text-mj-text-main font-sans-medium flex-1" numberOfLines={1}>
                            {startLocationAddress}
                        </Text>
                    </View>
                    <View className="flex-row items-center my-1 ml-[3px]">
                        <View className="w-0.5 h-4 bg-gray-300"/>
                    </View>
                    <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-mj-teal mr-2"/>
                        <Text className="text-sm text-mj-text-main font-sans-medium flex-1" numberOfLines={1}>
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
                        <Text className="text-xs font-sans-medium text-mj-text-secondary ml-1.5">
                            {vehicleModal}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="people-outline" size={16} color="#5A6275"/>
                        <Text className="text-xs font-sans-medium text-mj-text-secondary ml-1">
                            {availableSeats} {availableSeats === 1 ? "seat" : "seats"}
                        </Text>
                    </View>
                </View>
            </Card>
        </View>
    );

    return (
        <GradientView>
            <BookingRequestsList
                bookings={bookings!}
                rideDistanceKm={routeDistanceKm}
                vehicleType={vehicleType as "CAR" | "BIKE"}
                isPending={isPending}
                isError={isError}
                onRefetch={refetch}
                header={rideHeader}
                onBookingPress={handleBookingPress}
            />
            <ConfirmModal
                visible={showCancelConfirm}
                title="Cancel Ride"
                message="Are you sure you want to cancel your posted ride? All pending booking requests will be dismissed."
                confirmLabel="Cancel Ride"
                cancelLabel="Keep Ride"
                onConfirm={() => {
                    setShowCancelConfirm(false);
                    cancelPostedRide(id);
                }}
                onCancel={() => setShowCancelConfirm(false)}
            />
        </GradientView>
    );
}