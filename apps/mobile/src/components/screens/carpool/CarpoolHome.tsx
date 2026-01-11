import React, {useEffect, useState} from "react";
import {Platform, Text} from "react-native";
import {GoogleMaps, AppleMaps} from "expo-maps";

import * as Location from 'expo-location';

export default function CarpoolHome() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        async function getCurrentLocation() {

            let {status} = await Location.requestForegroundPermissionsAsync();
            if(status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        }

        getCurrentLocation();
    }, []);

    if (Platform.OS === 'ios') {
        return <AppleMaps.View style={{flex: 1}}/>;
    } else if (Platform.OS === 'android') {
        return <GoogleMaps.View
            style={{flex: 1}}
            cameraPosition={{
                coordinates: {
                    latitude: location?.coords.latitude ?? 37.78825,
                    longitude: location?.coords.longitude ?? -122.4324,
                },
                zoom: 15,
            }}
        />;
    } else {
        return <Text>Maps are only available on Android and iOS</Text>;
    }
}