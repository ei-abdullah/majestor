import {View, Text, Image} from "react-native";
import {useSelectedRideStore} from "@/src/stores/selectedRideStore";
import {useRideRequestStore} from "@/src/stores/rideRequestStore";
import React, {useEffect, useMemo, useRef} from "react";
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

export default function RideDetails() {
    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const {animateToLocation} = useMapLocation(mapRef);

    const snapPoints = useMemo(() => ["30%", "50%"], []);

    const {ride: selectedRide} = useSelectedRideStore();
    const rideRequest = useRideRequestStore();

    useEffect(() => {
        const animateToUser = async () => {
            if (rideRequest.pickupLocationLat && rideRequest.pickupLocationLng)
                animateToLocation(rideRequest.pickupLocationLat, rideRequest.pickupLocationLng);
        };
        animateToUser();
    }, []);

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
                    {selectedRide?.startLocationLat && selectedRide?.startLocationLng && (
                        <Marker
                            coordinate={{
                                latitude: selectedRide.startLocationLat,
                                longitude: selectedRide.startLocationLng
                            }}
                        >
                            <CustomMarker color={"#3A6FF8"} icon={"home"} label={"Origin"}/>
                        </Marker>
                    )}

                    {selectedRide?.endLocationLat && selectedRide?.endLocationLng && (
                        <Marker
                            coordinate={{
                                latitude: selectedRide.endLocationLat,
                                longitude: selectedRide.endLocationLng
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

                    {/* Driver's original route — solid blue */}
                    {
                        selectedRide?.startLocationLat &&
                        selectedRide?.startLocationLng &&
                        selectedRide?.endLocationLat &&
                        selectedRide?.endLocationLng && (
                            <MapViewDirections
                                origin={{
                                    latitude: selectedRide.startLocationLat,
                                    longitude: selectedRide.startLocationLng
                                }}
                                destination={{
                                    latitude: selectedRide.endLocationLat,
                                    longitude: selectedRide.endLocationLng
                                }}
                                strokeWidth={2}
                                strokeColor={"#6FD0C5"}
                                lineDashPattern={[6, 6]}
                                mode={"DRIVING"}
                                precision={"high"}
                                apikey={GOOGLE_API_KEY}
                            />
                        )
                    }

                    {/* Deviation: driver start → booker pickup — dashed teal */}
                    {
                        rideRequest.pickupLocationLat &&
                        rideRequest.pickupLocationLng &&
                        selectedRide?.startLocationLat &&
                        selectedRide?.startLocationLng && (
                            <MapViewDirections
                                origin={{
                                    latitude: selectedRide.startLocationLat,
                                    longitude: selectedRide.startLocationLng
                                }}
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

                    {/* Ride Requestor's pickup location -> dropoff location */}
                    {
                        rideRequest.pickupLocationLat &&
                        rideRequest.pickupLocationLng &&
                        rideRequest.dropoffLocationLat &&
                        rideRequest.dropoffLocationLng && (
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

                    {/* Deviation: booker dropoff → driver end — dashed teal */}
                    {
                        rideRequest.dropoffLocationLat &&
                        rideRequest.dropoffLocationLng &&
                        selectedRide?.endLocationLat &&
                        selectedRide?.endLocationLng && (
                            <MapViewDirections
                                origin={{
                                    latitude: rideRequest.dropoffLocationLat,
                                    longitude: rideRequest.dropoffLocationLng
                                }}
                                destination={{
                                    latitude: selectedRide.endLocationLat,
                                    longitude: selectedRide.endLocationLng
                                }}
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
                        {/* Card 1 — Driver info */}
                        <Card className="px-5 py-6">
                            {/* Profile — centered */}
                            <View className="items-center mb-4">
                                {selectedRide?.ridePosterImageUrl ? (
                                    <View className="w-16 h-16 rounded-full overflow-hidden mb-2">
                                        <Image
                                            source={{uri: selectedRide.ridePosterImageUrl}}
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
                                <Text className="text-base font-bold text-mj-text-main" numberOfLines={1}>
                                    {selectedRide?.ridePosterUsername ?? "—"}
                                </Text>
                                <Text className="text-xs text-mj-text-secondary mt-0.5" numberOfLines={1}>
                                    {selectedRide?.ridePosterEmail ?? "—"}
                                </Text>
                            </View>

                            <View className="h-px bg-gray-100 mb-4"/>

                            {/* Route */}
                            <View className="my-4 gap-8">
                                <View className="flex-row items-center gap-2">
                                    <Ionicons name="radio-button-on-outline" size={16} color="#3A6FF8"/>
                                    <Text className="text-sm text-mj-text-main flex-1" numberOfLines={1}>
                                        {selectedRide?.startLocationAddress ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-2 mb-4">
                                    <Ionicons name="flag-outline" size={16} color="#6FD0C5"/>
                                    <Text className="text-sm text-mj-text-main flex-1" numberOfLines={1}>
                                        {selectedRide?.endLocationAddress ?? "—"}
                                    </Text>
                                </View>
                            </View>

                            <View className="h-px bg-gray-100 mb-4"/>

                            {/* Vehicle + Seats — two columns */}
                            <View className="flex-row">
                                {/* Left — vehicle */}
                                <View className="flex-1 items-center gap-1">
                                    <Ionicons
                                        name={selectedRide?.vehicleType === "BIKE" ? "bicycle-outline" : "car-sport-outline"}
                                        size={22}
                                        color="#6FD0C5"
                                    />
                                    <Text className="text-sm font-semibold text-mj-text-main text-center"
                                          numberOfLines={1}>
                                        {selectedRide?.vehicleModal ?? "—"}
                                    </Text>
                                    <Text className="text-xs text-mj-text-secondary text-center">
                                        {selectedRide?.licensePlate ?? "—"}
                                    </Text>
                                </View>

                                {/* Vertical divider */}
                                <View className="w-px bg-gray-100 mx-4"/>

                                {/* Right — seats */}
                                <View className="flex-1 items-center gap-1">
                                    <Ionicons name="people-outline" size={22} color="#6FD0C5"/>
                                    <Text className="text-sm font-semibold text-mj-text-main">
                                        {selectedRide?.availableSeats ?? "—"}
                                    </Text>
                                    <Text className="text-xs text-mj-text-secondary">Available seats</Text>
                                </View>
                            </View>
                        </Card>

                        {/* Card 2 — Route analysis */}
                        <Card className="px-5 py-5">
                            <Text className="text-sm font-bold text-mj-text-main mb-3">Route Analysis</Text>

                            <View className="h-px bg-gray-200 mb-3"/>

                            <View className="flex-row justify-between mb-2">
                                <Text className="text-sm text-mj-text-secondary">Driver's route</Text>
                                <Text className="text-sm font-medium text-mj-text-main">
                                    {selectedRide?.routeDistanceKm != null
                                        ? `${selectedRide.routeDistanceKm.toFixed(2)} km`
                                        : "—"}
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
                                    {selectedRide?.routeDistanceKm != null && rideRequest.routeDistanceKm != null
                                        ? `+${Math.abs(rideRequest.routeDistanceKm - selectedRide.routeDistanceKm).toFixed(2)} km`
                                        : "—"}
                                </Text>
                            </View>
                        </Card>

                        {/* Book button */}
                        <PrimaryButton
                            title="Book this ride"
                            onPress={() => {
                                console.log("Book this ride");
                            }}
                        />
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>
        </GestureHandlerRootView>
    )
}