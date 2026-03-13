import React, {useEffect, useRef, useState} from "react";
import {View, TouchableOpacity, Text} from "react-native";
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import OutlineButton from "@/src/components/ui/OutlineButton";
import {Ionicons} from "@expo/vector-icons";
import Card from "@/src/components/ui/Card";
import {useRouter} from "expo-router";
import { useLocationPermissions } from "@/src/hooks/useLocationPermissions";
import { useMapLocation } from "@/src/hooks/useMapLocation";
import { DEFAULT_LOCATION } from "@/src/utils/location.utils";
import {useCurrentLocation} from "@/src/hooks/useCurrentLocation";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useRideStore} from "@/src/stores/rideStore";
import {useRideRequestStore} from "@/src/stores/rideRequestStore";

export default function CarpoolHome() {
    const router = useRouter();
    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Use custom hooks
    const { hasLocationPermission } = useLocationPermissions();
    const { centerOnUserLocation, animateToLocation } = useMapLocation(mapRef);
    const { getCurrentLocation } = useCurrentLocation();
    const insets = useSafeAreaInsets();

    const rideStore = useRideStore();
    const rideRequestStore = useRideRequestStore();

    const isDriverActive = rideStore.id !== 0;
    const isPassengerActive = rideRequestStore.id !== 0;

    const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
    const headerOffset = insets.top + 72;

    // Bottom sheet snap points - starts above tab bar but can scroll down
    const snapPoints = ["40%"]


    useEffect(() => {
        const checkLocationAndAnimate = async () => {
            const location = await getCurrentLocation();
            if (location) {
                animateToLocation(location.latitude, location.longitude);
                setCurrentLocation(location);
            }
        }
        checkLocationAndAnimate();
    }, []);

    // Set the initial region based on the user location
    const initialRegion = currentLocation?.latitude && currentLocation?.longitude
        ? {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        }
        : DEFAULT_LOCATION;

    return (
        <GestureHandlerRootView className="flex-1">
            <View className={"flex-1"}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    mapType={"standard"}
                    showsPointsOfInterests={false}
                    initialRegion={initialRegion}
                    showsUserLocation={true}
                    showsBuildings={false}
                    showsCompass={false}
                    showsMyLocationButton={false}
                    userInterfaceStyle={"light"}
                    style={{flex: 1}}
                    mapPadding={{top: headerOffset + 8, right: 10, bottom: 130, left: 10}}
                />

                {/* Custom Map Controls - Locator button beneath header */}
                <View style={{
                    position: 'absolute',
                    right: 16,
                    top: headerOffset + 8,
                    zIndex: 99
                }}>
                    {/* My Location Button */}
                    <TouchableOpacity
                        onPress={centerOnUserLocation}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 50,
                            padding: 12,
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 4},
                            shadowOpacity: 0.15,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                    >
                        <Ionicons
                            name={hasLocationPermission ? "locate" : "location-outline"}
                            size={24}
                            color={hasLocationPermission ? "#3A6FF8" : "#EF4444"}
                        />
                    </TouchableOpacity>
                </View>

                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    enablePanDownToClose={false}
                    backgroundStyle={{backgroundColor: '#f9fafb'}}
                    handleIndicatorStyle={{backgroundColor: '#d1d5db'}}
                >
                    <BottomSheetView>
                        <View className={"px-6 pb-32 pt-4 flex justify-center"}>
                            {isDriverActive ? (
                                <View>
                                    <View className="flex-row items-center justify-between mb-3">
                                        <Text className="text-lg font-bold text-mj-text-main">Current Ride</Text>
                                        <View className={`px-2 py-1 rounded-full flex-row items-center ${rideStore.bookingId ? 'bg-mj-teal-100' : 'bg-green-100'}`}>
                                            <View className={`w-2 h-2 rounded-full mr-1.5 ${rideStore.bookingId ? 'bg-mj-teal-600' : 'bg-green-500'}`} />
                                            <Text className={`text-xs font-medium ${rideStore.bookingId ? 'text-mj-teal-800' : 'text-green-700'}`}>
                                                {rideStore.bookingId ? "Booked" : "Active"}
                                            </Text>
                                        </View>
                                    </View>
                                    <Card className={`p-0 overflow-hidden border shadow-sm ${rideStore.bookingId ? 'border-mj-teal-200' : 'border-mj-blue-200'}`}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (rideStore.bookingId) {
                                                    router.push("/(tabs)/carpool/ride/bookingDetails");
                                                } else {
                                                    router.push("/(tabs)/carpool/ride/bookingRequests");
                                                }
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <View className={`p-4 flex-row items-center justify-between ${rideStore.bookingId ? 'bg-mj-teal-50' : 'bg-mj-blue-50'}`}>
                                                <View className="flex-row items-center flex-1">
                                                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${rideStore.bookingId ? 'bg-mj-teal-100' : 'bg-mj-blue-100'}`}>
                                                        <Ionicons 
                                                            name={rideStore.bookingId ? "people" : "car-sport"} 
                                                            size={22} 
                                                            color={rideStore.bookingId ? "#2D7D75" : "#3A6FF8"} 
                                                        />
                                                    </View>
                                                    <View className="flex-1">
                                                        <Text className={`font-semibold text-base ${rideStore.bookingId ? 'text-mj-teal-900' : 'text-mj-blue-800'}`}>
                                                            {rideStore.bookingId ? "Passenger Confirmed" : "Your Ride is Live"}
                                                        </Text>
                                                        <Text className={`text-xs mt-0.5 ${rideStore.bookingId ? 'text-mj-teal-700' : 'text-mj-blue-600'}`} numberOfLines={1}>
                                                            {rideStore.bookingId ? "Tap to view trip details" : "Offering ride to others"}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Ionicons 
                                                    name="chevron-forward" 
                                                    size={20} 
                                                    color={rideStore.bookingId ? "#2D7D75" : "#3A6FF8"} 
                                                />
                                            </View>
                                            <View className={`px-4 py-3 bg-white border-t ${rideStore.bookingId ? 'border-mj-teal-100' : 'border-mj-blue-100'}`}>
                                                <View className="flex-row items-center">
                                                    <Ionicons name="location" size={16} color="#9CA3AF" />
                                                    <Text className="text-gray-600 text-sm ml-2 flex-1" numberOfLines={1}>
                                                        To: <Text className="text-gray-900 font-medium">{rideStore.endLocationAddress}</Text>
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </Card>
                                </View>
                            ) : isPassengerActive ? (
                                <View>
                                    <View className="flex-row items-center justify-between mb-3">
                                        <Text className="text-lg font-bold text-mj-text-main">Current Request</Text>
                                        <View className={`px-2 py-1 rounded-full flex-row items-center ${rideRequestStore.bookingId ? 'bg-mj-teal-100' : 'bg-mj-yellow-100'}`}>
                                            <View className={`w-2 h-2 rounded-full mr-1.5 ${rideRequestStore.bookingId ? 'bg-mj-teal-600' : 'bg-mj-yellow-600'}`} />
                                            <Text className={`text-xs font-medium ${rideRequestStore.bookingId ? 'text-mj-teal-800' : 'text-mj-yellow-800'}`}>
                                                {rideRequestStore.bookingId ? "Pending" : "Searching"}
                                            </Text>
                                        </View>
                                    </View>
                                    
                                    <Card className={`p-0 overflow-hidden border shadow-sm ${rideRequestStore.bookingId ? 'border-mj-teal-200' : 'border-mj-yellow-200'}`}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (rideRequestStore.bookingId) {
                                                    router.push("/(tabs)/carpool/rideRequest/rideDetails");
                                                } else {
                                                    router.push("/(tabs)/carpool/rideRequest/availableRides");
                                                }
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <View className={`p-4 flex-row items-center justify-between ${rideRequestStore.bookingId ? 'bg-mj-teal-50' : 'bg-mj-yellow-50'}`}>
                                                <View className="flex-row items-center flex-1">
                                                    <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${rideRequestStore.bookingId ? 'bg-mj-teal-100' : 'bg-mj-yellow-100'}`}>
                                                        <Ionicons 
                                                            name={rideRequestStore.bookingId ? "ticket" : "search"} 
                                                            size={22} 
                                                            color={rideRequestStore.bookingId ? "#2D7D75" : "#B45309"} 
                                                        />
                                                    </View>
                                                    <View className="flex-1">
                                                        <Text className={`font-semibold text-base ${rideRequestStore.bookingId ? 'text-mj-teal-900' : 'text-mj-yellow-900'}`}>
                                                            {rideRequestStore.bookingId ? "Booking Requested" : "Looking for a Ride"}
                                                        </Text>
                                                        <Text className={`text-xs mt-0.5 ${rideRequestStore.bookingId ? 'text-mj-teal-700' : 'text-mj-yellow-800'}`} numberOfLines={1}>
                                                            {rideRequestStore.bookingId ? "Waiting for driver approval" : "Browsing available drivers"}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <Ionicons 
                                                    name="chevron-forward" 
                                                    size={20} 
                                                    color={rideRequestStore.bookingId ? "#2D7D75" : "#B45309"} 
                                                />
                                            </View>
                                            <View className={`px-4 py-3 bg-white border-t ${rideRequestStore.bookingId ? 'border-mj-teal-100' : 'border-mj-yellow-100'}`}>
                                                <View className="flex-row items-center">
                                                    <Ionicons name="location" size={16} color="#9CA3AF" />
                                                    <Text className="text-gray-600 text-sm ml-2 flex-1" numberOfLines={1}>
                                                        To: <Text className="text-gray-900 font-medium">{rideRequestStore.dropoffLocationAddress}</Text>
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </Card>
                                </View>
                            ) : hasLocationPermission ? (
                                <>
                                    <View className="w-2/3">
                                        <PrimaryButton
                                            title={"Book a Ride"}
                                            onPress={() => router.push("/(tabs)/carpool/rideRequest/bookRide")}
                                        />
                                    </View>
                                    <View className="w-2/3 self-end mt-3">
                                        <OutlineButton
                                            title={"Post a Ride"}
                                            onPress={() => router.push("/(tabs)/carpool/ride/postRide")}
                                        />
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Card className={"bg-red-50 border border-red-200 mb-4 p-2"}>
                                        <View>
                                            <Text className={`text-center font-medium text-red-600`}>
                                                Please enable location permission to use this feature.
                                            </Text>
                                        </View>
                                    </Card>
                                </>
                            )}
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    )
}