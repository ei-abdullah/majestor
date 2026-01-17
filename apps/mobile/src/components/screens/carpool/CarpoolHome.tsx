import React, {useEffect, useState} from "react";
import {View} from "react-native";

import * as Location from 'expo-location';
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {useDriverStore, useLocationStore} from "@/src/stores/locationStore";
import GoogleTextInput from "@/src/components/ui/GoogleTextInput";
import {SafeAreaView} from "react-native-safe-area-context";

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

    const [hasPermission, setHasPermission] = useState(false);
    const [markers, setMarkers] = useState<any[]>([]);

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
        console.log('Destination selected:', address);
    };

    useEffect(() => {
        const requestLocation = async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setHasPermission(false);
                return;
            }

            setHasPermission(true);
            const location = await Location.getCurrentPositionAsync();

            const address = await Location.reverseGeocodeAsync({
                latitude: location.coords?.latitude!,
                longitude: location.coords?.longitude!,
            });

            setUserLocation({
                latitude: location.coords?.latitude!,
                longitude: location.coords?.longitude!,
                address: `${address[0].name}, ${address[0].region}`
            })

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

    const initialRegion = {
        latitude: userLatitude || 37.78825,
        longitude: userLongitude || -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    return (
        <SafeAreaView className={"flex-1"}>
            <View className="px-6 py-4">
                <GoogleTextInput handlePress={handleGoogleSearch} />
            </View>
            {/*<MapView*/}
            {/*    provider={PROVIDER_GOOGLE}*/}
            {/*    mapType={"standard"}*/}
            {/*    showsPointsOfInterest={false}*/}
            {/*    initialRegion={initialRegion}*/}
            {/*    showsUserLocation={true}*/}
            {/*    showsBuildings={false}*/}

            {/*    showsCompass={true}*/}
            {/*    userInterfaceStyle={"light"}*/}
            {/*    style={{flex: 1}}*/}
            {/*    mapPadding={{top: 30, right: 10, bottom: 0, left: 10}}*/}
            {/*/>*/}
        </SafeAreaView>
    )
}