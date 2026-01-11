import React from "react";
import {Platform, Text} from "react-native";
import {GoogleMaps, AppleMaps} from "expo-maps";

export default function CarpoolHome() {

    if (Platform.OS === 'ios') {
        return <AppleMaps.View style={{flex: 1}}/>;
    } else if (Platform.OS === 'android') {
        return <GoogleMaps.View
            style={{flex: 1}}
            cameraPosition={{
                coordinates: {
                    latitude: 37.78825,
                    longitude: -122.4324,
                },
                zoom: 15,
            }}
        />;
    } else {
        return <Text>Maps are only available on Android and iOS</Text>;
    }
}