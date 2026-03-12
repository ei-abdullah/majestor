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

export default function CarpoolHome() {
    const router = useRouter();
    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Use custom hooks
    const { hasLocationPermission } = useLocationPermissions();
    const { centerOnUserLocation, animateToLocation } = useMapLocation(mapRef);
    const { getCurrentLocation } = useCurrentLocation();

    const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);

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
                    showsUserLocation={false}
                    showsBuildings={false}
                    showsCompass={false}
                    showsMyLocationButton={false}
                    userInterfaceStyle={"light"}
                    style={{flex: 1}}
                    mapPadding={{top: 80, right: 10, bottom: 130, left: 10}}
                />

                {/* Custom Map Controls - Locator button beneath header */}
                <View style={{
                    position: 'absolute',
                    right: 16,
                    top: 100,
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
                        <View className={"px-6 py-4 flex justify-center"}>
                            {hasLocationPermission ? (
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