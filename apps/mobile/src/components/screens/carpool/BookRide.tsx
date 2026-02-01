import React, {useRef} from "react";
import {View, Text} from "react-native";
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";
import {useLocationStore} from "@/src/stores/locationStore";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export default function BookRide() {
    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);

    const snapPoints = ["5%", "25%", "90%"]

    const {
        userLatitude,
        userLongitude
    } = useLocationStore();

    const initialRegion = {
        latitude: userLatitude!,
        longitude: userLongitude!,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    }

    return (
        <GestureHandlerRootView className={"flex-1"}>
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
                />
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
                        <Text className={"text-2xl font-semibold text-center mb-4"}>Confirm Your Ride</Text>
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    )
}