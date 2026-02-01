import React, {useEffect, useRef, useState} from "react";
import {View, TouchableOpacity, Text} from "react-native";

import * as Location from 'expo-location';
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions"
import {useLocationStore} from "@/src/stores/locationStore";
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import OutlineButton from "@/src/components/ui/OutlineButton";
import {Ionicons} from "@expo/vector-icons";
import Toast from 'react-native-toast-message';
import Card from "@/src/components/ui/Card";
import {useRouter} from "expo-router";
import CustomMarker from "@/src/components/ui/CustomMarker";

const A = { latitude: 33.7300, longitude: 73.0479 };
const B = { latitude: 33.7000, longitude: 73.0500 };
const C = { latitude: 33.7200, longitude: 73.0600 };
const D = { latitude: 33.7400, longitude: 73.0800 };

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || ""

export default function CarpoolHome() {
    const router = useRouter();

    const {
        userLatitude,
        userLongitude,
        setUserLocation,
    } = useLocationStore();

    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [showDirections, setShowDirections] = useState(true);

    // Expand a bottom sheet
    // () => bottomSheetRef.current?.expand()

    // Bottom sheet snap points
    const snapPoints = ["5%", "25%", "40%"]

    const centerOnUserLocation = async () => {
        if (mapRef.current && userLatitude && userLongitude && hasPermission) {
            mapRef.current.animateToRegion({
                latitude: userLatitude,
                longitude: userLongitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }, 500);
        } else if (!hasPermission) {
            // If no permission, prompt a user to check settings
            const isLocationEnabled = await Location.hasServicesEnabledAsync();
            if (!isLocationEnabled) {
                Toast.show({
                    type: 'info',
                    text1: '⚙️ Enable Location Services',
                    text2: 'Go to Settings > Location and turn it on',
                    position: 'top',
                    visibilityTime: 4000,
                });
            } else {
                Toast.show({
                    type: 'info',
                    text1: '⚙️ Grant Location Permission',
                    text2: 'Go to Settings > App Permissions > Location',
                    position: 'top',
                    visibilityTime: 4000,
                });
            }
        }
    };

    // Check API key on mount
    useEffect(() => {
        if (!API_KEY) {
            console.warn('Google API Key is missing!');
            Toast.show({
                type: 'error',
                text1: '⚠️ API Key Missing',
                text2: 'Set EXPO_PUBLIC_GOOGLE_PLACES_API_KEY in .env',
                position: 'top',
                visibilityTime: 5000,
            });
            setShowDirections(false);
        }
    }, []);

    useEffect(() => {
        const requestLocation = async () => {
            try {
                // Check if location services are enabled
                const isLocationEnabled = await Location.hasServicesEnabledAsync();
                if (!isLocationEnabled) {
                    setHasPermission(false);
                    setUserLocation({
                        latitude: 37.78825,
                        longitude: -122.4324,
                        address: "San Francisco, CA"
                    });

                    Toast.show({
                        type: 'error',
                        text1: '📍 Location Services Off',
                        text2: 'Please enable location services in settings',
                        position: 'top',
                        visibilityTime: 5000,
                    });
                    return;
                }

                const {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setHasPermission(false);
                    // Set a default location (San Francisco) when permission denied
                    setUserLocation({
                        latitude: 37.78825,
                        longitude: -122.4324,
                        address: "San Francisco, CA"
                    });

                    // Show warning toast
                    Toast.show({
                        type: 'error',
                        text1: '📍 Location Permission Denied',
                        text2: 'Using default location. Tap to retry.',
                        position: 'top',
                        visibilityTime: 5000,
                        onPress: () => {
                            Toast.hide();
                            requestLocation();
                        }
                    });
                    return;
                }

                setHasPermission(true);
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                const address = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });

                setUserLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    address: `${address[0].name}, ${address[0].region}`
                });

                // Show success toast
                Toast.show({
                    type: 'success',
                    text1: '📍 Location Found',
                    text2: `${address[0].name}, ${address[0].region}. ${address[0].city ? address[0].city + ',' : ''} ${address[0].country}`,
                    position: 'top',
                    visibilityTime: 3000,
                });

                // Animate a map to a user location once fetched
                if (mapRef.current) {
                    mapRef.current.animateToRegion({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }, 1000);
                }
            } catch (error: any) {
                console.error('Error fetching location:', error);
                setHasPermission(false);

                // Set default location on error
                setUserLocation({
                    latitude: 37.78825,
                    longitude: -122.4324,
                    address: "San Francisco, CA"
                });

                // Show a specific error message based on an error type
                let errorMessage = 'Unable to fetch location';
                if (error.message?.includes('timeout')) {
                    errorMessage = 'Location request timed out. Try again.';
                } else if (error.message?.includes('Location services')) {
                    errorMessage = 'Location services are disabled';
                }

                Toast.show({
                    type: 'error',
                    text1: '❌ Location Error',
                    text2: errorMessage,
                    position: 'top',
                    visibilityTime: 3000,
                });
            }
        }

        requestLocation();
    }, []);

    // Default to a predefined location
    const initialRegion = {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

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
                    mapPadding={{top: 0, right: 10, bottom: 10, left: 10}}
                >
                    {/* Custom Beautiful Markers */}
                    <Marker coordinate={A} anchor={{ x: 0.5, y: 1 }}>
                        <CustomMarker color="red" icon="location" label="A" />
                    </Marker>

                    <Marker coordinate={B} anchor={{ x: 0.5, y: 1 }}>
                        <CustomMarker color="purple" icon="car" label="B" />
                    </Marker>

                    <Marker coordinate={C} anchor={{ x: 0.5, y: 1 }}>
                        <CustomMarker color="purple" icon="flag" label="C" />
                    </Marker>

                    <Marker coordinate={D} anchor={{ x: 0.5, y: 1 }}>
                        <CustomMarker color="red" icon="home" label="D" />
                    </Marker>

                    {/* Routes (street-based) */}
                    {showDirections && API_KEY && (
                        <>
                            <MapViewDirections
                                origin={A}
                                destination={B}
                                strokeWidth={4}
                                strokeColor="#8B5CF6"
                                apikey={API_KEY}
                                mode="DRIVING"
                                onReady={(result) => {
                                    console.log(`Distance: ${result.distance} km, Duration: ${result.duration} min`);
                                }}
                                onError={(errorMessage) => {
                                    console.error('MapViewDirections Error A->B:', errorMessage);
                                    Toast.show({
                                        type: 'error',
                                        text1: '🗺️ Directions Error',
                                        text2: 'Unable to load route. Check API key.',
                                        position: 'top',
                                        visibilityTime: 3000,
                                    });
                                }}
                            />

                            <MapViewDirections
                                origin={B}
                                destination={C}
                                strokeWidth={4}
                                strokeColor="#8B5CF6"
                                apikey={API_KEY}
                                mode="DRIVING"
                                onError={(errorMessage) => {
                                    console.error('MapViewDirections Error B->C:', errorMessage);
                                }}
                            />

                            <MapViewDirections
                                origin={C}
                                destination={D}
                                strokeWidth={4}
                                strokeColor="#8B5CF6"
                                apikey={API_KEY}
                                mode="DRIVING"
                                onError={(errorMessage) => {
                                    console.error('MapViewDirections Error C->D:', errorMessage);
                                }}
                            />

                            {/* Optional direct A → D */}
                            <MapViewDirections
                                origin={A}
                                destination={D}
                                strokeWidth={4}
                                strokeColor="#EF4444"
                                apikey={API_KEY}
                                mode="DRIVING"
                                lineDashPattern={[5, 5]}
                                onError={(errorMessage) => {
                                    console.error('MapViewDirections Error A->D:', errorMessage);
                                }}
                            />
                        </>
                    )}
                </MapView>

                {/* Custom Map Controls */}
                <View className="absolute right-4 bottom-20 gap-3">
                    {/* My Location Button */}
                    <TouchableOpacity
                        onPress={centerOnUserLocation}
                        className="bg-white rounded-full p-3 shadow-lg"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 20},
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}
                    >
                        <Ionicons
                            name={hasPermission ? "locate" : "location-outline"}
                            size={24}
                            color={hasPermission ? "#3A6FF8" : "#EF4444"}
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
                        <View className={"px-6 py-16 flex justify-center"}>
                            {hasPermission ? (
                                <>
                                    <View className="w-2/3">
                                        <PrimaryButton
                                            title={"Book a Ride"}
                                            onPress={() => router.push("/(tabs)/carpool/bookRide")}
                                        />
                                    </View>
                                    <View className="w-2/3 self-end mt-3">
                                        <OutlineButton
                                            title={"Post a Ride"}
                                            onPress={() => router.push("/(tabs)/carpool/postRide")}
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