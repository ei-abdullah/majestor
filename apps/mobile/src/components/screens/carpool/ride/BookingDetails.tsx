import React, {useEffect, useRef, useState} from "react";
import {View, Text, Image, Pressable} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Ionicons} from "@expo/vector-icons";
import {Href, useRouter} from "expo-router";

import {GetBookingsResponse} from "@/src/types/booking";
import {useRideStore} from "@/src/stores/rideStore";
import {useAcceptBooking, useRejectBooking} from "@/src/queries/booking.queries";
import {useMapLocation} from "@/src/hooks/useMapLocation";
import {GOOGLE_API_KEY} from "@/src/constants";
import CustomMarker from "@/src/components/ui/CustomMarker";
import MapViewDirections from "react-native-maps-directions";
import Card from "@/src/components/ui/Card";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import OutlineButton from "@/src/components/ui/OutlineButton";
import {useSelectedBookingStore} from "@/src/stores/selectedBookingStore";
import {useCancelRide, useCompleteRide, useFareConfig} from "@/src/queries/ride.queries";
import {calculateFare} from "@/src/utils/fare.utils";
import RideOutcomeModal from "@/src/components/ui/RideOutcomeModal";
import ConfirmModal from "@/src/components/ui/ConfirmModal";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface BookingDetailsProps {
    booking: GetBookingsResponse;
}

export default function BookingDetails({booking}: BookingDetailsProps) {
    const router = useRouter();
    const mapRef = useRef<MapView>(null);
    const {animateToLocation} = useMapLocation(mapRef);
    const insets = useSafeAreaInsets();

    const {setAcceptedBooking, bookingId, clearRideDetails} = useRideStore();
    const {clearBooking} = useSelectedBookingStore();

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = ["35%", "55%", "85%"];
    const hasAccepted = Boolean(bookingId);

    const isNavigating = useRef(false);

    // Modal state — shown on completion or cancellation before navigating away
    const [outcomeModal, setOutcomeModal] = useState<"completed" | "cancelled" | null>(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    const {
        id: rideId,
        startLocationLat,
        startLocationLng,
        startLocationAddress,
        endLocationLat,
        endLocationLng,
        endLocationAddress,
        vehicleModal,
        vehicleType,
        availableSeats,
        routeDistanceKm,
    } = useRideStore();

    const deviationKm = (booking.routeDistanceKm != null && routeDistanceKm != null)
        ? Math.abs(booking.routeDistanceKm - routeDistanceKm)
        : null;
    const headerOffset = insets.top + 72;

    const {data: fareConfig} = useFareConfig();
    const estimatedFare = (fareConfig && deviationKm != null)
        ? calculateFare(deviationKm, vehicleType as 'CAR' | 'BIKE', fareConfig)
        : null;

    const {mutate: accept, isPending: isAccepting} = useAcceptBooking(() => {
        setAcceptedBooking(booking.bookingId, "ACCEPTED");
    });

    const {mutate: reject, isPending: isRejecting} = useRejectBooking(() => {
        clearBooking();
        router.replace( "/(tabs)/carpool/ride/bookingRequests" as Href);
    });

    const {mutate: completeRide, isPending: isCompleting} = useCompleteRide(() => {
        setOutcomeModal("completed");
    });

    const {mutate: cancelRide, isPending: isCancelling} = useCancelRide(() => {
        setOutcomeModal("cancelled");
    });

    function handleOutcomeDismiss() {
        const current = outcomeModal;
        isNavigating.current = true;
        setOutcomeModal(null);
        clearBooking();
        if (current === "completed" || current === "cancelled") {
            clearRideDetails();
        }
        router.replace("/(tabs)/carpool" as Href);
    }


    useEffect(() => {
        if (booking.pickupLocationLat && booking.pickupLocationLng) {
            animateToLocation(booking.pickupLocationLat, booking.pickupLocationLng);
        }
    }, []);

    const isPending = [
        isAccepting,
        isRejecting,
        isCompleting,
        isCancelling
    ].some(Boolean);

    const vehicleIcon = vehicleType === "CAR" ? "car-sport-outline" : "bicycle-outline";

    if (isNavigating.current) return null;

    return (
        <GestureHandlerRootView className="flex-1">
            <View className="flex-1 w-full">
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    mapType="standard"
                    showsPointsOfInterests={false}
                    showsBuildings={false}
                    showsCompass={false}
                    showsUserLocation={false}
                    showsMyLocationButton={false}
                    userInterfaceStyle="light"
                    style={{flex: 1}}
                    mapPadding={{top: headerOffset + 8, right: 10, bottom: 10, left: 10}}
                    onMapReady={() => {
                        if (booking.pickupLocationLat && booking.pickupLocationLng) animateToLocation(booking.pickupLocationLat, booking.pickupLocationLng);
                    }}
                >
                    {/* Ride start marker */}
                    {startLocationLat && startLocationLng && (
                        <Marker coordinate={{latitude: startLocationLat, longitude: startLocationLng}}>
                            <CustomMarker color="#3A6FF8" icon="home" label="Origin"/>
                        </Marker>
                    )}

                    {/* Ride end marker */}
                    {endLocationLat && endLocationLng && (
                        <Marker coordinate={{latitude: endLocationLat, longitude: endLocationLng}}>
                            <CustomMarker color="#EF4444" icon="location" label="Destination"/>
                        </Marker>
                    )}

                    {/* Booker pickup marker */}
                    {booking.pickupLocationLat && booking.pickupLocationLng && (
                        <Marker
                            coordinate={{latitude: booking.pickupLocationLat, longitude: booking.pickupLocationLng}}>
                            <CustomMarker color="#F59E0B" icon="walk-outline" label="Pickup"/>
                        </Marker>
                    )}

                    {/* Booker dropoff marker */}
                    {booking.dropoffLocationLat && booking.dropoffLocationLng && (
                        <Marker
                            coordinate={{latitude: booking.dropoffLocationLat, longitude: booking.dropoffLocationLng}}>
                            <CustomMarker color="#F59E0B" icon="pin" label="Dropoff"/>
                        </Marker>
                    )}

                    {/* Driver's original route — dashed teal */}
                    {startLocationLat && startLocationLng && endLocationLat && endLocationLng && (
                        <MapViewDirections
                            origin={{latitude: startLocationLat, longitude: startLocationLng}}
                            destination={{latitude: endLocationLat, longitude: endLocationLng}}
                            strokeWidth={2}
                            strokeColor="#6FD0C5"
                            lineDashPattern={[6, 6]}
                            mode="DRIVING"
                            precision="high"
                            apikey={GOOGLE_API_KEY}
                        />
                    )}

                    {/* Driver start → booker pickup */}
                    {startLocationLat && startLocationLng && booking.pickupLocationLat && booking.pickupLocationLng && (
                        <MapViewDirections
                            origin={{latitude: startLocationLat, longitude: startLocationLng}}
                            destination={{latitude: booking.pickupLocationLat, longitude: booking.pickupLocationLng}}
                            strokeWidth={2}
                            strokeColor="#3A6FF8"
                            mode="DRIVING"
                            precision="high"
                            apikey={GOOGLE_API_KEY}
                        />
                    )}

                    {/* Booker pickup → dropoff */}
                    {booking.pickupLocationLat && booking.pickupLocationLng && booking.dropoffLocationLat && booking.dropoffLocationLng && (
                        <MapViewDirections
                            origin={{latitude: booking.pickupLocationLat, longitude: booking.pickupLocationLng}}
                            destination={{latitude: booking.dropoffLocationLat, longitude: booking.dropoffLocationLng}}
                            strokeWidth={2}
                            strokeColor="#3A6FF8"
                            mode="DRIVING"
                            precision="high"
                            apikey={GOOGLE_API_KEY}
                        />
                    )}

                    {/* Booker dropoff → driver end */}
                    {booking.dropoffLocationLat && booking.dropoffLocationLng && endLocationLat && endLocationLng && (
                        <MapViewDirections
                            origin={{latitude: booking.dropoffLocationLat, longitude: booking.dropoffLocationLng}}
                            destination={{latitude: endLocationLat, longitude: endLocationLng}}
                            strokeWidth={3}
                            strokeColor="#3A6FF8"
                            lineDashPattern={[6, 6]}
                            mode="DRIVING"
                            precision="high"
                            apikey={GOOGLE_API_KEY}
                        />
                    )}
                </MapView>
            </View>

            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
                backgroundStyle={{backgroundColor: '#f9fafb'}}
                handleIndicatorStyle={{backgroundColor: '#d1d5db'}}
            >
                <BottomSheetScrollView
                    contentContainerStyle={{paddingHorizontal: 24, paddingTop: 16, paddingBottom: 130}}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex gap-4">

                        {/* Confirmed banner — only shown after acceptance */}
                        {hasAccepted && (
                            <Card className="bg-green-50 border border-green-200 px-5 py-4">
                                <View className="flex-row items-center justify-center gap-2">
                                    <Ionicons name="checkmark-circle" size={20} color="#22c55e"/>
                                    <Text className="text-sm font-sans-semibold text-green-700">
                                        Booking Accepted
                                    </Text>
                                </View>
                            </Card>
                        )}

                        {/* Card 1 — Booker info */}
                        <Card className="px-5 py-6">
                            {/* Profile — centered */}
                            <View className="items-center mb-4">
                                {booking.rideRequesterAvatar ? (
                                    <View className="w-16 h-16 rounded-full overflow-hidden mb-2">
                                        <Image
                                            source={{uri: booking.rideRequesterAvatar}}
                                            style={{width: "100%", height: "100%"}}
                                            resizeMode="cover"
                                        />
                                    </View>
                                ) : (
                                    <View
                                        className="w-16 h-16 rounded-full bg-mj-blue-50 items-center justify-center mb-2">
                                        <Ionicons name="person-outline" size={28} color="#3A6FF8"/>
                                    </View>
                                )}
                                <Text className="text-base font-sans-bold text-mj-text-main" numberOfLines={1}>
                                    {booking.rideRequesterUsername}
                                </Text>
                                <Text className="text-xs text-mj-text-secondary mt-0.5" numberOfLines={1}>
                                    {booking.rideRequesterEmail}
                                </Text>
                            </View>

                            {hasAccepted && (
                                <>
                                    <View className="h-px bg-gray-100 mb-4"/>
                                    <View className="flex-row items-center justify-center gap-2 mb-4">
                                        <Ionicons name="call-outline" size={18} color="#3A6FF8"/>
                                        <Text className="text-base font-sans-semibold text-mj-blue">
                                            {booking.rideRequesterPhone}
                                        </Text>
                                        <Text>|</Text>
                                        <Pressable
                                            onPress={() => router.push({
                                                pathname: "/chat" as any,
                                                params: {
                                                    receiverEmail: booking.rideRequesterEmail,
                                                    receiverUsername: booking.rideRequesterUsername
                                                }
                                            })}
                                            className={"flex-row items-center gap-1"}
                                        >
                                            <Ionicons name="chatbubble-outline" size={18} color="#3A6FF8"/>
                                            <Text className="text-base font-sans-semibold text-mj-blue">
                                                Chat with Booker
                                            </Text>
                                        </Pressable>
                                    </View>
                                </>
                            )}

                            <View className="h-px bg-gray-100 mb-4"/>

                            {/* Passengers & Fare — two columns */}
                            <View className="flex-row mb-4">
                                <View className="flex-1 items-center gap-1">
                                    <Ionicons name="people-outline" size={22} color="#6FD0C5"/>
                                    <Text className="text-sm font-sans-semibold text-mj-text-main">
                                        {booking.numberOfPassengers}
                                    </Text>
                                    <Text className="text-xs text-mj-text-secondary">Passengers</Text>
                                </View>

                                <View className="w-px bg-gray-100 mx-4"/>

                                <View className="flex-1 items-center gap-1">
                                    <Ionicons name="cash-outline" size={22} color="#6FD0C5"/>
                                    <Text className="text-sm font-sans-semibold text-mj-blue">
                                        {estimatedFare != null ? `~Rs ${estimatedFare}` : "—"}
                                    </Text>
                                    <Text className="text-xs text-mj-text-secondary">Estimated fare</Text>
                                </View>
                            </View>

                            <View className="h-px bg-gray-100 mb-4"/>

                            {/* Pickup / Dropoff */}
                            <View className="gap-8">
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="radio-button-on-outline" size={16} color="#3A6FF8"/>
                                    <Text className="text-sm text-mj-text-main flex-1" numberOfLines={1}>
                                        {booking.pickupLocationAddress}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="flag-outline" size={16} color="#3A6FF8"/>
                                    <Text className="text-sm text-mj-text-main flex-1" numberOfLines={1}>
                                        {booking.dropoffLocationAddress}
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        {/* Card 2 — Your ride info */}
                        <Card className="px-5 py-6">
                            <Text className="text-sm font-sans-bold text-mj-text-main text-center mb-3">
                                Your Ride
                            </Text>

                            <View className="h-px bg-gray-100 mb-4"/>

                            {/* Start / End route */}
                            <View className="gap-8 mb-4">
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="radio-button-on-outline" size={16} color="#3A6FF8"/>
                                    <Text className="text-sm text-mj-text-main flex-1" numberOfLines={1}>
                                        {startLocationAddress}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="flag-outline" size={16} color="#3A6FF8"/>
                                    <Text className="text-sm text-mj-text-main flex-1" numberOfLines={1}>
                                        {endLocationAddress}
                                    </Text>
                                </View>
                            </View>

                            <View className="h-px bg-gray-100 mb-4"/>

                            {/* Vehicle + Seats */}
                            <View className="flex-row">
                                <View className="flex-1 flex-row items-center gap-2">
                                    <Ionicons name={vehicleIcon as any} size={18} color="#6FD0C5"/>
                                    <Text className="text-sm font-sans-medium text-mj-text-main" numberOfLines={1}>
                                        {vehicleModal}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="people-outline" size={18} color="#6FD0C5"/>
                                    <Text className="text-sm font-sans-medium text-mj-text-main">
                                        {availableSeats} {availableSeats === 1 ? "seat" : "seats"}
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        {/* Card 3 — Route analysis */}
                        <Card className="px-5 py-5">
                            <Text className="text-sm font-sans-bold text-mj-text-main mb-3">Route Analysis</Text>

                            <View className="h-px bg-gray-200 mb-3"/>

                            <View className="flex-row justify-between mb-2">
                                <Text className="text-sm text-mj-text-secondary">Original route</Text>
                                <Text className="text-sm font-sans-medium text-mj-text-main">
                                    {routeDistanceKm != null ? `${routeDistanceKm.toFixed(2)} km` : "—"}
                                </Text>
                            </View>

                            <View className="flex-row justify-between mb-3">
                                <Text className="text-sm text-mj-text-secondary">Rider's route</Text>
                                <Text className="text-sm font-sans-medium text-mj-text-main">
                                    {booking.routeDistanceKm != null
                                        ? `${booking.routeDistanceKm.toFixed(2)} km`
                                        : "—"}
                                </Text>
                            </View>

                            <View className="h-px bg-gray-200 mb-3"/>

                            <View className="flex-row justify-between">
                                <Text className="text-sm text-mj-text-secondary">Extra distance</Text>
                                <Text className="text-sm font-sans-semibold text-mj-blue">
                                    {deviationKm != null ? `+${deviationKm.toFixed(2)} km` : "—"}
                                </Text>
                            </View>
                        </Card>

                        {/* Reject & Accept buttons */}
                        {hasAccepted ? (
                            <View className="flex-row gap-3">
                                <OutlineButton
                                    title={isCancelling ? "Cancelling Ride" : "Cancel Ride"}
                                    variant="destructive"
                                    className="flex-1"
                                    disabled={isPending}
                                    onPress={() => setShowCancelConfirm(true)}
                                />
                                <PrimaryButton
                                    title={isCompleting ? "Completing Ride" : "Complete Ride"}
                                    className="flex-1"
                                    disabled={isPending}
                                    onPress={() => completeRide({rideId, bookingId: booking.bookingId})}
                                />
                            </View>
                        ) : (
                            <View className="flex-row gap-3">
                                <OutlineButton
                                    title={isRejecting ? "Rejecting..." : "Reject"}
                                    variant="destructive"
                                    className="flex-1"
                                    disabled={isPending}
                                    onPress={() => reject(booking.bookingId)}
                                />
                                <PrimaryButton
                                    title={isAccepting ? "Accepting..." : "Accept"}
                                    className="flex-1"
                                    disabled={isPending}
                                    onPress={() => accept(booking.bookingId)}
                                />
                            </View>
                        )}
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>

            {outcomeModal && (
                <RideOutcomeModal
                    visible={true}
                    outcome={outcomeModal}
                    onDismiss={handleOutcomeDismiss}
                />
            )}
            <ConfirmModal
                visible={showCancelConfirm}
                title="Cancel Ride"
                message="Are you sure you want to cancel this ride? The passenger will be notified."
                confirmLabel="Cancel Ride"
                cancelLabel="Keep Ride"
                onConfirm={() => {
                    setShowCancelConfirm(false);
                    cancelRide({rideId, bookingId: booking.bookingId});
                }}
                onCancel={() => setShowCancelConfirm(false)}
            />
        </GestureHandlerRootView>
    );
}

