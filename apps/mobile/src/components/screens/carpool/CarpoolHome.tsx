import React, {useEffect, useMemo, useRef, useState} from "react";
import {View, Platform, Text, TouchableOpacity} from "react-native";

import * as Location from 'expo-location';
import MapView, {PROVIDER_DEFAULT, PROVIDER_GOOGLE} from "react-native-maps";
import {useDriverStore, useLocationStore} from "@/src/stores/locationStore";
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import OutlineButton from "@/src/components/ui/OutlineButton";
import GoogleTextInput from "@/src/components/ui/GoogleTextInput";
import {Ionicons} from "@expo/vector-icons";

export default function CarpoolHome() {
    const {
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
        setUserLocation,
        setDestinationLocation
    } = useLocationStore();

    const {selectedDriver, setSelectedDriver, clearSelectedDriver} = useDriverStore();

    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [markers, setMarkers] = useState<any[]>([]);

    // Bottom sheet snap points
    const snapPoints = ["5%", "25%", "40%"]

    const handleGoogleSearch = ({latitude, longitude, address}: {
        latitude: number,
        longitude: number,
        address: string
    }) => {
        setDestinationLocation({
            latitude,
            longitude,
            address
        });
    };

    const centerOnUserLocation = () => {
        if (mapRef.current && userLatitude && userLongitude) {
            mapRef.current.animateToRegion({
                latitude: userLatitude,
                longitude: userLongitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }, 500);
        }
    };

    useEffect(() => {
        const requestLocation = async () => {
            try {
                const {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setHasPermission(false);
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

                // Animate map to user location once fetched
                if (mapRef.current) {
                    mapRef.current.animateToRegion({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }, 1000); // 1 second animation
                }
            } catch (error) {
                console.error('Error fetching location:', error);
            }
        }

        requestLocation();
    }, []);

    // useEffect(() => {
    //     if (Array.isArray(drivers)) {
    //         if (!userLatitude || !userLongitude) return;
    //
    //         const newMarkers = generateMarkersFromData({
    //             data: drivers,
    //             userLatitude,
    //             userLongitude
    //         })
    //
    //         setMarkers(newMarkers);
    //     }
    // }, []);

    // const region = calculateRegion({
    //     userLatitude,
    //     userLongitude,
    //     destinationLatitude,
    //     destinationLongitude
    // })

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
                {/*<View className="px-6 relative top-12 z-10">*/}
                {/*    <GoogleTextInput handlePress={handleGoogleSearch} />*/}
                {/*</View>*/}
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
                />

                {/* Custom Map Controls */}
                <View className="absolute right-4 bottom-20 gap-3">
                    {/* My Location Button */}
                    <TouchableOpacity
                        onPress={centerOnUserLocation}
                        className="bg-white rounded-full p-3 shadow-lg"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 20 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}
                    >
                        <Ionicons name="locate" size={24} color="#3A6FF8" />
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
                            <View className="w-2/3">
                                <PrimaryButton title={"Book a Ride"}/>
                            </View>
                            <View className="w-2/3 self-end mt-3">
                                <OutlineButton title={"Offer a Ride"}/>
                            </View>
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            </View>
        </GestureHandlerRootView>
    )
}