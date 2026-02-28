import React, {useEffect, useMemo, useRef} from "react";
import {View, Text, Image} from "react-native";
import {useRideRequestStore} from "@/src/stores/rideRequestStore";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import CustomMarker from "@/src/components/ui/CustomMarker";
import MapViewDirections from "react-native-maps-directions";
import {GOOGLE_API_KEY} from "@/src/constants";
import Card from "@/src/components/ui/Card";
import {Ionicons} from "@expo/vector-icons";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import {useMapLocation} from "@/src/hooks/useMapLocation";
import {useCreateBooking, useGetBookingStatus} from "@/src/queries/booking.queries";
import {CreateBookingDetails, CreateBookingResponse} from "@/src/types/booking";
import {useRouter} from "expo-router";
import Toast from "react-native-toast-message";
import {RecentRideResponse} from "@/src/types/ride";
import OutlineButton from "@/src/components/ui/OutlineButton";

interface Props {
    ride: RecentRideResponse;
}

export default function RideDetails({ride}: Props) {
    const router = useRouter();
    const mapRef = useRef<MapView>(null);
    const {animateToLocation} = useMapLocation(mapRef);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["30%", "55%", "85%"], []);

    // Skip useEffect on first mount to avoid routing on stale persisted status
    const hasMounted = useRef(false);

    const rideRequest = useRideRequestStore();

    const bookingId = useRideRequestStore((state) => state.bookingId);
    const bookingStatus = useRideRequestStore((state) => state.bookingStatus);

    const hasBooked = Boolean(bookingId);
    const isAccepted = bookingStatus === "ACCEPTED";

    // On mount: if a previous booking for this ride was rejected,
    // clear it so the user sees the Book button instead of "Waiting..."
    useEffect(() => {
        if (bookingStatus === "REJECTED") {
            rideRequest.clearBookingDetails();
        }
    }, []);

    const {mutate: createBooking, isPending} = useCreateBooking((response: CreateBookingResponse) => {
        rideRequest.setBookingDetails(response.id, response.status);
    });

    const {data: bookingStatusData} = useGetBookingStatus(bookingId!);

    useEffect(() => {
        // skip on first mount: prevents routing on stale persisted status
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        if (!bookingStatusData) return;

        rideRequest.setBookingDetails(bookingId!, bookingStatusData.status);

        if (bookingStatusData.status === "ACCEPTED") {
            rideRequest.setBookingDetails(bookingId!, "ACCEPTED");
        } else if (bookingStatusData.status === "REJECTED") {
            rideRequest.clearBookingDetails();
            Toast.show({
                text1: "Booking rejected",
                text2: "Kindly explore other available rides",
                type: "error",
                visibilityTime: 3000,
                autoHide: true,
                position: "top"
            })
            router.replace("/(tabs)/carpool/rideRequest/availableRides")
        } else if(bookingStatusData.status === "COMPLETED") {
            rideRequest.clearRideRequestDetails();
            Toast.show({
                text1: "Booking completed",
                text2: "Thank you for using Majestor for ride",
                type: "success",
                visibilityTime: 3000,
                autoHide: true,
                position: "top"
            })
            router.replace("/(tabs)/carpool/rideRequest/availableRides")
        }
    }, [bookingStatusData?.status]);

    useEffect(() => {
        if (rideRequest.pickupLocationLat && rideRequest.pickupLocationLng)
            animateToLocation(rideRequest.pickupLocationLat, rideRequest.pickupLocationLng);
    }, []);

    function onSubmit() {

        const createBookingDetails: CreateBookingDetails = {
            deviationKm: parseFloat(Math.abs(rideRequest.routeDistanceKm - ride.routeDistanceKm).toFixed(2))
        }
        createBooking({
            createBookingDetails,
            rideRequestId: rideRequest.id,
            rideId: ride.id
        });
    }

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
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    userInterfaceStyle={"light"}
                    style={{flex: 1}}
                    mapPadding={{top: 0, right: 10, bottom: 10, left: 10}}
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
                                destination={{latitude: rideRequest.pickupLocationLat, longitude: rideRequest.pickupLocationLng}}
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
                                origin={{latitude: rideRequest.pickupLocationLat, longitude: rideRequest.pickupLocationLng}}
                                destination={{latitude: rideRequest.dropoffLocationLat, longitude: rideRequest.dropoffLocationLng}}
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
                                origin={{latitude: rideRequest.dropoffLocationLat, longitude: rideRequest.dropoffLocationLng}}
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
                    contentContainerStyle={{paddingHorizontal: 24, paddingVertical: 16}}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex gap-4">
                        {/* Status banner */}
                        {isAccepted && (
                            <Card className="bg-green-50 border border-green-200 px-5 py-4">
                                <View className="flex-row items-center justify-center gap-2">
                                    <Ionicons name="checkmark-circle" size={20} color="#22c55e"/>
                                    <Text className="text-sm font-semibold text-green-700">
                                        Ride Confirmed
                                    </Text>
                                </View>
                            </Card>
                        )}

                        {hasBooked && !isAccepted && (
                            <Card className="bg-amber-50 border border-amber-200 px-5 py-4">
                                <View className="flex-row items-center justify-center gap-2">
                                    <Ionicons name="time-outline" size={20} color="#d97706"/>
                                    <Text className="text-sm font-semibold text-amber-700">
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
                                    <View className="w-16 h-16 rounded-full bg-mj-blue-50 items-center justify-center mb-2">
                                        <Ionicons name="person-outline" size={28} color="#3A6FF8"/>
                                    </View>
                                )}
                                <Text className="text-base font-bold text-mj-text-main" numberOfLines={1}>
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
                                        <Text className="text-base font-semibold text-mj-blue">
                                            {ride.phone ?? "—"}
                                        </Text>
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
                                    <Text className="text-sm font-semibold text-mj-text-main text-center" numberOfLines={1}>
                                        {ride.vehicleModal ?? "—"}
                                    </Text>
                                    <Text className="text-xs text-mj-text-secondary text-center">
                                        {ride.licensePlate ?? "—"}
                                    </Text>
                                </View>

                                <View className="w-px bg-gray-100 mx-4"/>

                                <View className="flex-1 items-center gap-1">
                                    <Ionicons name="people-outline" size={22} color="#6FD0C5"/>
                                    <Text className="text-sm font-semibold text-mj-text-main">
                                        {ride.availableSeats ?? "—"}
                                    </Text>
                                    <Text className="text-xs text-mj-text-secondary">Available seats</Text>
                                </View>
                            </View>
                        </Card>

                        {/* Card 3 - Booker's request */}
                        {hasBooked && (
                            <Card className="px-5 py-6">
                                <Text className="text-sm font-bold text-mj-text-main text-center mb-3">Your Request</Text>

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
                                    <Text className="text-sm font-semibold text-mj-text-main">
                                        {rideRequest.numberOfPassengers ?? "—"}
                                    </Text>
                                    <Text className="text-sm text-mj-text-secondary">Passengers</Text>
                                </View>
                            </Card>
                        )}

                        {/* Card 4 — Route analysis */}
                        <Card className="px-5 py-5">
                            <Text className="text-sm font-bold text-mj-text-main mb-3">Route Analysis</Text>

                            <View className="h-px bg-gray-200 mb-3"/>

                            <View className="flex-row justify-between mb-2">
                                <Text className="text-sm text-mj-text-secondary">Driver's route</Text>
                                <Text className="text-sm font-medium text-mj-text-main">
                                    {ride.routeDistanceKm != null ? `${ride.routeDistanceKm.toFixed(2)} km` : "—"}
                                </Text>
                            </View>

                            <View className="flex-row justify-between mb-3">
                                <Text className="text-sm text-mj-text-secondary">Your route</Text>
                                <Text className="text-sm font-medium text-mj-text-main">
                                    {rideRequest.routeDistanceKm != null
                                        ? `${rideRequest.routeDistanceKm.toFixed(2)} km`
                                        : "—"}
                                </Text>
                            </View>

                            <View className="h-px bg-gray-200 mb-3"/>

                            <View className="flex-row justify-between">
                                <Text className="text-sm text-mj-text-secondary">Driver's detour</Text>
                                <Text className="text-sm font-semibold text-mj-blue">
                                    {ride.routeDistanceKm != null && rideRequest.routeDistanceKm != null
                                        ? `+${Math.abs(rideRequest.routeDistanceKm - ride.routeDistanceKm).toFixed(2)} km`
                                        : "—"}
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

                        {/* Done button — only shown when accepted */}
                        {isAccepted && (
                            <OutlineButton
                                title={"Cancel Rile"}
                                variant="destructive"
                                className="flex-1"
                                onPress={() => {}}
                            />
                        )}
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>
        </GestureHandlerRootView>
    )
}