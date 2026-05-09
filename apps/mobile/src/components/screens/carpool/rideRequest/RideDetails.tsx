import React, {useEffect, useRef, useState} from "react";
import {View, Text, Image, Pressable, Linking} from "react-native";
import {useIsFocused} from "@react-navigation/native";
import {Href, useRouter} from "expo-router";
import {useQueryClient} from "@tanstack/react-query";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import {Ionicons} from "@expo/vector-icons";

import {useCreateBooking, useGetBookingStatus, useReportNoShow} from "@/src/queries/booking.queries";
import {useCancelRide, useFareConfig} from "@/src/queries/ride.queries";
import {calculateFare} from "@/src/utils/fare.utils";
import {useRideRequestStore} from "@/src/stores/rideRequestStore";
import {stompService} from "@/src/services/stompService";
import {useMapLocation} from "@/src/hooks/useMapLocation";

import {CreateBookingDetails, CreateBookingResponse} from "@/src/types/booking";
import {RecentRideResponse} from "@/src/types/ride";
import {GOOGLE_API_KEY} from "@/src/constants";

import Card from "@/src/components/ui/Card";
import CustomMarker from "@/src/components/ui/CustomMarker";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import OutlineButton from "@/src/components/ui/OutlineButton";
import RideOutcomeModal from "@/src/components/ui/RideOutcomeModal";
import ConfirmModal from "@/src/components/ui/ConfirmModal";

interface Props {
    ride: RecentRideResponse;
}

export default function RideDetails({ride}: Props) {
    const router = useRouter();
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();
    const queryClient = useQueryClient();

    const mapRef = useRef<MapView>(null);
    const {animateToLocation} = useMapLocation(mapRef);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const hasMounted = useRef(false);
    const isNavigating = useRef(false);
    // Modal state — shown on completion or cancellation before navigating away
    const [outcomeModal, setOutcomeModal] = useState<"completed" | "cancelled" | null>(null);
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [showNoShowConfirm, setShowNoShowConfirm] = useState(false);
    const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);

    const rideRequest = useRideRequestStore();
    const bookingId = useRideRequestStore((state) => state.bookingId);
    const bookingStatus = useRideRequestStore((state) => state.bookingStatus);

    const {data: fareConfig} = useFareConfig();
    const deviationKm = (rideRequest.routeDistanceKm != null && ride.routeDistanceKm != null)
        ? Math.abs(rideRequest.routeDistanceKm - ride.routeDistanceKm)
        : null;
    const estimatedFare = (fareConfig && deviationKm != null)
        ? calculateFare(deviationKm, ride.vehicleType, fareConfig)
        : null;

    const {data: bookingStatusData} = useGetBookingStatus(bookingId!);

    const {mutate: createBooking, isPending} = useCreateBooking((response: CreateBookingResponse) => {
        rideRequest.setBookingDetails(response.id, response.status);
    });

    // Passenger-initiated cancel — show modal, then clean up on dismissing
    const {mutate: cancelRide, isPending: isCancelling} = useCancelRide(() => {
        setOutcomeModal("cancelled");
    });

    const {mutate: reportNoShow, isPending: isReporting} = useReportNoShow(() => {
        isNavigating.current = true;
        rideRequest.clearRideRequestDetails();
        router.replace("/(tabs)/carpool" as Href);
    });

    const hasBooked = Boolean(bookingId);
    const isAccepted = bookingStatus === "ACCEPTED";
    const headerOffset = insets.top + 72;
    const snapPoints = ["30%", "55%", "90%"];

    // Effect: Subscribe to real-time booking status updates
    useEffect(() => {
        if (!bookingId) return;

        stompService.connect();

        const topic = `/topic/booking-status/${bookingId}`;

        const subscription = stompService.subscribe(topic, async (message) => {
            await queryClient.invalidateQueries({queryKey: ['bookingStatus', bookingId]});
        });

        return () => {
            stompService.unsubscribe(topic);
        };
    }, [bookingId, queryClient]);

    // Effect: On mount, clear a previously rejected booking
    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        if (!bookingStatusData) return;

        rideRequest.setBookingDetails(bookingId!, bookingStatusData.status);

        if (bookingStatusData.status === "REJECTED") {
            rideRequest.clearBookingDetails();
            Toast.show({
                text1: "Booking rejected",
                text2: "Kindly explore other available rides",
                type: "error",
                visibilityTime: 3000,
                autoHide: true,
                position: "top"
            });
            router.replace("/(tabs)/carpool" as Href);
        } else if (bookingStatusData.status === "COMPLETED") {
            setOutcomeModal("completed");
        } else if (bookingStatusData.status === "CANCELLED" || bookingStatusData.status === "NO_SHOW") {
            setOutcomeModal("cancelled");
        }
    }, [bookingStatusData?.status]);

    // Effect: On mount, clear a previously rejected booking
    useEffect(() => {
        if (bookingStatus === "REJECTED") {
            rideRequest.clearBookingDetails();
        }
    }, []);

    // Effect: Animate a map to pickup location on a mount
    useEffect(() => {
        if (rideRequest.pickupLocationLat && rideRequest.pickupLocationLng)
            animateToLocation(rideRequest.pickupLocationLat, rideRequest.pickupLocationLng);
    }, []);


    function handleOutcomeDismiss() {
        const current = outcomeModal;
        isNavigating.current = true;
        setOutcomeModal(null);
        if (current === "completed") {
            rideRequest.clearRideRequestDetails();
        } else if (current === "cancelled") {
            rideRequest.clearRideRequestDetails();
        }
        router.replace("/(tabs)/carpool" as Href);
    }

    function onSubmit() {
        const createBookingDetails: CreateBookingDetails = {
            deviationKm: parseFloat(Math.abs((rideRequest.routeDistanceKm ?? 0) - (ride.routeDistanceKm ?? 0)).toFixed(2))
        }
        createBooking({
            createBookingDetails,
            rideRequestId: rideRequest.id,
            rideId: ride.id
        });
    }

    if (isNavigating.current) return null;

    return (
        <GestureHandlerRootView className={"flex-1"}>
            <View className={"flex-1 w-full"}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    mapType={"standard"}
                    showsPointsOfInterests={false}
                    showsBuildings={false}
                    showsCompass={false}
                    showsUserLocation={isFocused}
                    showsMyLocationButton={false}
                    userInterfaceStyle={"light"}
                    style={{flex: 1}}
                    mapPadding={{top: headerOffset + 8, right: 10, bottom: 10, left: 10}}
                    onMapReady={() => {
                        if (rideRequest.pickupLocationLat && rideRequest.pickupLocationLng)
                            animateToLocation(rideRequest.pickupLocationLat, rideRequest.pickupLocationLng)
                    }}
                >
                    {/* Rider/Driver's location markers */}
                    {ride.startLocationLat && ride.startLocationLng && (
                        <Marker
                            coordinate={{
                                latitude: ride.startLocationLat,
                                longitude: ride.startLocationLng
                            }}
                        >
                            <CustomMarker color={"#3A6FF8"} icon={"home"} label={"Origin"}/>
                        </Marker>
                    )}

                    {ride.endLocationLat && ride.endLocationLng && (
                        <Marker
                            coordinate={{
                                latitude: ride.endLocationLat,
                                longitude: ride.endLocationLng
                            }}
                        >
                            <CustomMarker color={"#EF4444"} icon={"location"} label={"Destination"}/>
                        </Marker>
                    )}

                    {/* Ride Requestor/Booker location markers */}
                    {rideRequest.pickupLocationLat && rideRequest.pickupLocationLng && (
                        <Marker
                            coordinate={{
                                latitude: rideRequest.pickupLocationLat,
                                longitude: rideRequest.pickupLocationLng
                            }}
                        >
                            <CustomMarker color={"#F59E0B"} icon={"walk-outline"} label={"Pickup"}/>
                        </Marker>
                    )}

                    {rideRequest.dropoffLocationLat && rideRequest.dropoffLocationLng && (
                        <Marker
                            coordinate={{
                                latitude: rideRequest.dropoffLocationLat,
                                longitude: rideRequest.dropoffLocationLng
                            }}
                        >
                            <CustomMarker color={"#F59E0B"} icon={"pin"} label={"Dropoff"}/>
                        </Marker>
                    )}

                    {/* Driver's original route — dashed teal */}
                    {ride.startLocationLat && ride.startLocationLng &&
                        ride.endLocationLat && ride.endLocationLng && (
                            <MapViewDirections
                                origin={{latitude: ride.startLocationLat, longitude: ride.startLocationLng}}
                                destination={{latitude: ride.endLocationLat, longitude: ride.endLocationLng}}
                                strokeWidth={2}
                                strokeColor={"#6FD0C5"}
                                lineDashPattern={[6, 6]}
                                mode={"DRIVING"}
                                precision={"high"}
                                apikey={GOOGLE_API_KEY}
                            />
                        )
                    }

                    {/* Deviation: driver start → booker pickup */}
                    {rideRequest.pickupLocationLat && rideRequest.pickupLocationLng &&
                        ride.startLocationLat && ride.startLocationLng && (
                            <MapViewDirections
                                origin={{latitude: ride.startLocationLat, longitude: ride.startLocationLng}}
                                destination={{
                                    latitude: rideRequest.pickupLocationLat,
                                    longitude: rideRequest.pickupLocationLng
                                }}
                                strokeWidth={2}
                                strokeColor={"#3A6FF8"}
                                mode={"DRIVING"}
                                precision={"high"}
                                apikey={GOOGLE_API_KEY}
                            />
                        )
                    }

                    {/* Ride Requestor's pickup → dropoff */}
                    {rideRequest.pickupLocationLat && rideRequest.pickupLocationLng &&
                        rideRequest.dropoffLocationLat && rideRequest.dropoffLocationLng && (
                            <MapViewDirections
                                origin={{
                                    latitude: rideRequest.pickupLocationLat,
                                    longitude: rideRequest.pickupLocationLng
                                }}
                                destination={{
                                    latitude: rideRequest.dropoffLocationLat,
                                    longitude: rideRequest.dropoffLocationLng
                                }}
                                strokeWidth={2}
                                strokeColor={"#3A6FF8"}
                                mode={"DRIVING"}
                                precision={"high"}
                                apikey={GOOGLE_API_KEY}
                            />
                        )
                    }

                    {/* Deviation: booker dropoff → driver end */}
                    {rideRequest.dropoffLocationLat && rideRequest.dropoffLocationLng &&
                        ride.endLocationLat && ride.endLocationLng && (
                            <MapViewDirections
                                origin={{
                                    latitude: rideRequest.dropoffLocationLat,
                                    longitude: rideRequest.dropoffLocationLng
                                }}
                                destination={{latitude: ride.endLocationLat, longitude: ride.endLocationLng}}
                                strokeWidth={3}
                                strokeColor={"#3A6FF8"}
                                lineDashPattern={[6, 6]}
                                mode={"DRIVING"}
                                precision={"high"}
                                apikey={GOOGLE_API_KEY}
                            />
                        )
                    }
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
                    contentContainerStyle={{paddingHorizontal: 24, paddingTop: 16, paddingBottom: 56}}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex gap-4">
                        {/* Status banner */}
                        {isAccepted && (
                            <Card className="bg-green-50 border border-green-200 px-5 py-4">
                                <View className="flex-row items-center justify-center gap-2">
                                    <Ionicons name="checkmark-circle" size={20} color="#22c55e"/>
                                    <Text className="text-sm font-sans-semibold text-green-700">
                                        Ride Confirmed
                                    </Text>
                                </View>
                            </Card>
                        )}

                        {hasBooked && !isAccepted && (
                            <Card className="bg-amber-50 border border-amber-200 px-5 py-4">
                                <View className="flex-row items-center justify-center gap-2">
                                    <Ionicons name="time-outline" size={20} color="#d97706"/>
                                    <Text className="text-sm font-sans-semibold text-amber-700">
                                        Waiting for Driver's Response...
                                    </Text>
                                </View>
                            </Card>
                        )}

                        {/* Card 2 — Driver info */}
                        <Card className="px-5 py-6">
                            {/* Profile — centered */}
                            <View className="items-center mb-4">
                                {ride.ridePosterImageUrl ? (
                                    <View className="w-16 h-16 rounded-full overflow-hidden mb-2">
                                        <Image
                                            source={{uri: ride.ridePosterImageUrl}}
                                            style={{width: "100%", height: "100%", zIndex: 100}}
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
                                    {ride.ridePosterUsername ?? "—"}
                                </Text>
                                <Text className="text-xs text-mj-text-secondary mt-0.5" numberOfLines={1}>
                                    {ride.ridePosterEmail ?? "—"}
                                </Text>
                            </View>

                            {isAccepted && (
                                <>
                                    <View className="h-px bg-gray-100 mb-4"/>
                                    <View className="flex-row items-center justify-center gap-2 mb-4">
                                        <Ionicons name="call-outline" size={18} color="#3A6FF8"/>
                                        <Text className="text-base font-sans-semibold text-mj-blue">
                                            {ride.phone ?? "—"}
                                        </Text>
                                        <Text>|</Text>
                                        <Pressable
                                            onPress={() => router.push({
                                                pathname: "/chat" as any,
                                                params: {
                                                    receiverEmail: ride.ridePosterEmail,
                                                    receiverUsername: ride.ridePosterUsername,
                                                }
                                            })}
                                            className={"flex-row items-center gap-1"}
                                        >
                                            <Ionicons name="chatbubble-outline" size={18} color="#3A6FF8"/>
                                            <Text className="text-base font-sans-semibold text-mj-blue">
                                                Chat with Rider
                                            </Text>
                                        </Pressable>
                                    </View>
                                </>
                            )}

                            <View className="h-px bg-gray-100 mb-4"/>

                            {/* Route */}
                            <View className="my-4 gap-8">
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="radio-button-on-outline" size={16} color="#3A6FF8"/>
                                    <Text className="text-sm text-mj-text-main flex-1" numberOfLines={1}>
                                        {ride.startLocationAddress ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="flag-outline" size={16} color="#3A6FF8"/>
                                    <Text className="text-sm text-mj-text-main flex-1" numberOfLines={1}>
                                        {ride.endLocationAddress ?? "—"}
                                    </Text>
                                </View>
                            </View>

                            <View className="h-px bg-gray-100 mb-4"/>

                            {/* Vehicle + Seats — two columns */}
                            <View className="flex-row">
                                <View className="flex-1 items-center gap-1">
                                    <Ionicons
                                        name={ride.vehicleType === "BIKE" ? "bicycle-outline" : "car-sport-outline"}
                                        size={22}
                                        color="#6FD0C5"
                                    />
                                    <Text className="text-sm font-sans-semibold text-mj-text-main text-center"
                                          numberOfLines={1}>
                                        {ride.vehicleModal ?? "—"}
                                    </Text>
                                    <Text className="text-xs text-mj-text-secondary text-center">
                                        {ride.licensePlate ?? "—"}
                                    </Text>
                                </View>

                                <View className="w-px bg-gray-100 mx-4"/>

                                <View className="flex-1 items-center gap-1">
                                    <Ionicons name="people-outline" size={22} color="#6FD0C5"/>
                                    <Text className="text-sm font-sans-semibold text-mj-text-main">
                                        {ride.availableSeats ?? "—"}
                                    </Text>
                                    <Text className="text-xs text-mj-text-secondary">Available seats</Text>
                                </View>
                            </View>
                        </Card>

                        {/* Card 3 - Booker's request */}
                        {hasBooked && (
                            <Card className="px-5 py-6">
                                <Text className="text-sm font-sans-bold text-mj-text-main text-center mb-3">Your
                                    Request</Text>

                                <View className="h-px bg-gray-100 mb-4"/>

                                <View className="my-4 gap-8">
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons name="radio-button-on-outline" size={16} color="#3A6FF8"/>
                                        <Text className="text-sm text-mj-text-main flex-1" numberOfLines={1}>
                                            {rideRequest.pickupLocationAddress ?? "—"}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center gap-2">
                                        <Ionicons name="flag-outline" size={16} color="#3A6FF8"/>
                                        <Text className="text-sm text-mj-text-main flex-1" numberOfLines={1}>
                                            {rideRequest.dropoffLocationAddress ?? "—"}
                                        </Text>
                                    </View>
                                </View>

                                <View className="h-px bg-gray-100 mb-4"/>

                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="people-outline" size={18} color="#6FD0C5"/>
                                    <Text className="text-sm font-sans-semibold text-mj-text-main">
                                        {rideRequest.numberOfPassengers ?? "—"}
                                    </Text>
                                    <Text className="text-sm text-mj-text-secondary">Passengers</Text>
                                </View>
                            </Card>
                        )}

                        {/* Card 4 — Route analysis */}
                        <Card className="px-5 py-5">
                            <Text className="text-sm font-sans-bold text-mj-text-main mb-3">Route Analysis</Text>

                            <View className="h-px bg-gray-200 mb-3"/>

                            <View className="flex-row justify-between mb-2">
                                <Text className="text-sm text-mj-text-secondary">Driver's route</Text>
                                <Text className="text-sm font-sans-medium text-mj-text-main">
                                    {ride.routeDistanceKm != null ? `${ride.routeDistanceKm.toFixed(2)} km` : "—"}
                                </Text>
                            </View>

                            <View className="flex-row justify-between mb-3">
                                <Text className="text-sm text-mj-text-secondary">Your route</Text>
                                <Text className="text-sm font-sans-medium text-mj-text-main">
                                    {rideRequest.routeDistanceKm != null
                                        ? `${rideRequest.routeDistanceKm.toFixed(2)} km`
                                        : "—"}
                                </Text>
                            </View>

                            <View className="h-px bg-gray-200 mb-3"/>

                            <View className="flex-row justify-between mb-3">
                                <Text className="text-sm text-mj-text-secondary">Driver's detour</Text>
                                <Text className="text-sm font-sans-semibold text-mj-blue">
                                    {deviationKm != null ? `+${deviationKm.toFixed(2)} km` : "—"}
                                </Text>
                            </View>

                            <View className="h-px bg-gray-200 mb-3"/>

                            <View className="flex-row justify-between">
                                <Text className="text-sm text-mj-text-secondary">Estimated fare</Text>
                                <Text className="text-sm font-sans-semibold text-mj-blue">
                                    {estimatedFare != null ? `~Rs ${estimatedFare}` : "—"}
                                </Text>
                            </View>
                        </Card>

                        {/* Book button — hidden once booked */}
                        {!hasBooked && (
                            <PrimaryButton
                                title={isPending ? "Booking..." : "Book Ride"}
                                onPress={onSubmit}
                                disabled={isPending}
                            />
                        )}

                        {/* Accepted ride actions */}
                        {isAccepted && (
                            <View className="gap-3">
                                <OutlineButton
                                    title={isCancelling ? "Cancelling..." : "Cancel Ride"}
                                    variant="destructive"
                                    disabled={isCancelling || isReporting}
                                    onPress={() => setShowCancelConfirm(true)}
                                />
                                <OutlineButton
                                    title={isReporting ? "Reporting..." : "Report No-Show"}
                                    variant="destructive"
                                    disabled={isCancelling || isReporting}
                                    onPress={() => setShowNoShowConfirm(true)}
                                />
                                <Pressable
                                    onPress={() => setShowEmergencyConfirm(true)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        backgroundColor: '#FEF3C7',
                                        borderWidth: 1.5,
                                        borderColor: '#F59E0B',
                                        borderRadius: 12,
                                        paddingVertical: 12,
                                    }}
                                >
                                    <Ionicons name="warning" size={18} color="#B45309"/>
                                    <Text style={{color: '#B45309', fontWeight: '600', fontSize: 14}}>
                                        Emergency — Call Police (15)
                                    </Text>
                                </Pressable>
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
                message="Are you sure you want to cancel this ride? The driver will be notified."
                confirmLabel="Cancel Ride"
                cancelLabel="Keep Ride"
                onConfirm={() => {
                    setShowCancelConfirm(false);
                    cancelRide({rideId: ride.id!, bookingId: bookingId!});
                }}
                onCancel={() => setShowCancelConfirm(false)}
            />
            <ConfirmModal
                visible={showNoShowConfirm}
                title="Report No-Show"
                message="Are you sure the driver didn't show up? This will issue them a strike per our Carpool Policy."
                confirmLabel="Report No-Show"
                cancelLabel="Cancel"
                onConfirm={() => {
                    setShowNoShowConfirm(false);
                    if (bookingId) reportNoShow(bookingId);
                }}
                onCancel={() => setShowNoShowConfirm(false)}
            />
            <ConfirmModal
                visible={showEmergencyConfirm}
                title="Call Police Emergency?"
                message="This will open your phone dialer with 15 (Police Emergency) pre-dialled. Only use this in a genuine emergency."
                confirmLabel="Call 15"
                cancelLabel="Cancel"
                onConfirm={() => {
                    setShowEmergencyConfirm(false);
                    Linking.openURL('tel:15');
                }}
                onCancel={() => setShowEmergencyConfirm(false)}
            />
        </GestureHandlerRootView>
    )
}