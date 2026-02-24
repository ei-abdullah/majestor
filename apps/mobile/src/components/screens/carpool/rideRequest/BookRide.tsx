import React, {useEffect, useRef, useState} from "react";
import {Text, View, Pressable, TouchableOpacity} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import NumberStepper from "@/src/components/ui/NumberStepper";
import Card from "@/src/components/ui/Card";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import {Controller, useForm} from "react-hook-form";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import GoogleTextInput from "@/src/components/ui/GoogleTextInput";
import {Ionicons} from "@expo/vector-icons";
import CustomMarker from "@/src/components/ui/CustomMarker";
import MapViewDirections from "react-native-maps-directions";
import Toast from "react-native-toast-message";
import {useLocationPermissions} from "@/src/hooks/useLocationPermissions";
import {useMapLocation} from "@/src/hooks/useMapLocation";
import {useCurrentLocation} from "@/src/hooks/useCurrentLocation";
import {GOOGLE_API_KEY} from "@/src/constants";
import {DEFAULT_LOCATION} from "@/src/utils/location.utils";
import {useAuthStore} from "@/src/stores/authStore";
import {useRideRequestStore} from "@/src/stores/rideRequestStore";
import {useUploadRideRequest} from "@/src/queries/rideRequest.queries";
import {UploadRideRequestResponse} from "@/src/types/rideRequest";
import {router} from "expo-router";

interface FormData {
    pickupLocation: {
        latitude: number,
        longitude: number,
        address: string,
    } | null,
    dropOffLocation: {
        latitude: number,
        longitude: number,
        address: string,
    } | null,
    phone: string,
}

export default function BookRide() {
    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Use custom hooks
    const {hasLocationPermission} = useLocationPermissions();
    const {centerOnUserLocation, animateToLocation} = useMapLocation(mapRef);
    const {getCurrentLocation} = useCurrentLocation();

    const {user} = useAuthStore();
    const rideRequestState = useRideRequestStore();
    const {mutate: uploadRideRequest, isPending} = useUploadRideRequest((data: UploadRideRequestResponse) => {
        rideRequestState.setRideRequestDetails({
            ...data
        });
        router.push("/(tabs)/carpool/rideRequest/availableRides")
    });


    const {control, watch, handleSubmit, getValues, setValue, formState: {errors}} = useForm<FormData>({
        defaultValues: {
            pickupLocation: null,
            dropOffLocation: null,
            phone: ''
        }
    });

    const [numberOfPassengers, setNumberOfPassengers] = useState(1);
    const [routeDistanceKm, setRouteDistanceKm] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);

    const snapPoints = ["5%", "70%"]

    // Get current form values safely
    let pickupLocation = watch('pickupLocation');
    let dropOffLocation = watch('dropOffLocation');

    const initialRegion = rideRequestState?.pickupLocationLat && rideRequestState?.pickupLocationLng
        ? {
            latitude: rideRequestState.pickupLocationLat,
            longitude: rideRequestState.pickupLocationLng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        }
        : DEFAULT_LOCATION;

    /**
     * Fetches current location and sets it as pickupLocation
     */
    const handleUseMyLocation = async () => {
        const location = await getCurrentLocation();
        if (location) {
            setValue('pickupLocation', location);
            animateToLocation(location.latitude, location.longitude);
            Toast.show({
                type: 'success',
                text1: '📍 Location Set',
                text2: 'Pickup location set to your current location',
                position: 'top',
                visibilityTime: 2000,
            });
        }
    };


    const onSubmit = (data: FormData) => {
        if (!data.pickupLocation || !data.dropOffLocation || !user) return;

        uploadRideRequest({
            uploadRideRequestDetails: {
                pickupLocationLat: data.pickupLocation!.latitude,
                pickupLocationLng: data.pickupLocation!.longitude,
                pickupLocationAddress: data.pickupLocation!.address,
                dropoffLocationLat: data.dropOffLocation!.latitude,
                dropoffLocationLng: data.dropOffLocation!.longitude,
                dropoffLocationAddress: data.dropOffLocation!.address,
                numberOfPassengers: numberOfPassengers,
                phone: data.phone,
                routeDistanceKm: routeDistanceKm
            },
            userId: user!.id
        });
    };

    useEffect(() => {
        const animateToUser = async () => {
            const location = await getCurrentLocation();
            if (location) {
                animateToLocation(location.latitude, location.longitude);
            }
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
                    initialRegion={initialRegion}
                    showsBuildings={false}
                    showsCompass={false}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    userInterfaceStyle={"light"}
                    style={{flex: 1}}
                    mapPadding={{top: 0, right: 10, bottom: 10, left: 10}}
                >
                    {/* Show markers only when locations are selected */}
                    {pickupLocation && (
                        <Marker
                            coordinate={{
                                latitude: pickupLocation.latitude,
                                longitude: pickupLocation.longitude
                            }}
                        >
                            <CustomMarker color={"red"} icon={"home"}/>
                        </Marker>
                    )}

                    {dropOffLocation && (
                        <Marker
                            coordinate={{
                                latitude: dropOffLocation.latitude,
                                longitude: dropOffLocation.longitude
                            }}
                        >
                            <CustomMarker color={"red"} icon={"flag"}/>
                        </Marker>
                    )}

                    {pickupLocation && dropOffLocation && (
                        <>
                            <MapViewDirections
                                origin={{
                                    latitude: pickupLocation.latitude,
                                    longitude: pickupLocation.longitude
                                }}
                                destination={{
                                    latitude: dropOffLocation.latitude,
                                    longitude: dropOffLocation.longitude
                                }}
                                strokeWidth={2}
                                strokeColor="red"
                                mode={"DRIVING"}
                                precision={"high"}
                                apikey={GOOGLE_API_KEY}
                                onReady={(result) => {
                                    setRouteDistanceKm(result.distance);
                                }}
                                onError={(errorMessage) => {
                                    Toast.show({
                                        type: 'error',
                                        text1: '🗺️ Directions Error',
                                        text2: `Unable to load route. Error ${errorMessage}`,
                                        position: 'top',
                                        visibilityTime: 3000,
                                    });
                                }}
                            />
                        </>
                    )}
                </MapView>

                {/* Floating Locate Button */}
                <View className="absolute right-4 bottom-12">
                    <TouchableOpacity
                        onPress={centerOnUserLocation}
                        className="bg-white rounded-full p-3 shadow-lg"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}
                    >
                        <Ionicons
                            name={hasLocationPermission ? "locate" : "location-outline"}
                            size={24}
                            color={hasLocationPermission ? "#3A6FF8" : "#EF4444"}
                        />
                    </TouchableOpacity>
                </View>

                {/* Location Card */}
                {!isExpanded ? (
                    <Pressable
                        onPress={() => setIsExpanded(true)}
                        className="absolute top-4 right-4 bg-white rounded-2xl p-3 shadow-lg"
                    >
                        <View className="items-center gap-2">
                            <View className="w-10 h-10 rounded-full bg-mj-blue-50 items-center justify-center">
                                <Ionicons name="location" size={20} color="#3A6FF8"/>
                            </View>
                            <View className="w-0.5 h-3 bg-gray-300"/>
                            <View className="w-10 h-10 rounded-full bg-mj-teal-50 items-center justify-center">
                                <Ionicons name="flag" size={20} color="#6FD0C5"/>
                            </View>
                        </View>
                    </Pressable>
                ) : (
                    <View className="absolute top-4 left-4 right-4 bg-white rounded-2xl p-4 shadow-lg">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-base font-semibold">Select Locations</Text>
                            <Pressable onPress={() => setIsExpanded(false)} className="p-1">
                                <Ionicons name="close" size={20} color="#5A6275"/>
                            </Pressable>
                        </View>

                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-xs text-gray-500">From</Text>
                            <TouchableOpacity
                                onPress={handleUseMyLocation}
                                className="flex-row items-center gap-1 px-2 py-1 rounded-full bg-mj-blue-50"
                            >
                                <Ionicons name="locate" size={14} color="#3A6FF8"/>
                                <Text className="text-xs text-mj-blue font-medium">Use My Location</Text>
                            </TouchableOpacity>
                        </View>
                        <Controller
                            control={control}
                            name="pickupLocation"
                            render={({field: {onChange, value}}) => (
                                <GoogleTextInput
                                    icon="map-pin"
                                    initialLocation={value?.address}
                                    handlePress={(location) => onChange(location)}
                                />
                            )}
                        />

                        <Text className="text-xs text-gray-500 mb-2 mt-3">To</Text>
                        <Controller
                            control={control}
                            name="dropOffLocation"
                            render={({field: {onChange, value}}) => (
                                <GoogleTextInput
                                    icon="flag"
                                    initialLocation={value?.address}
                                    handlePress={(location) => onChange(location)}
                                />
                            )}
                        />
                    </View>
                )}
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
                    <View className={"flex gap-4"}>
                        {/* Number of Passengers */}
                        {
                            <NumberStepper
                                label="Number of Passengers"
                                value={numberOfPassengers}
                                onValueChange={setNumberOfPassengers}
                                minValue={1}
                                maxValue={6}
                            />
                        }

                        {/* Phone number */}
                        <View className="z-0">
                            <Card className={"px-4"}>
                                <Text className="text-base font-semibold mb-2">Phone Number</Text>
                                <Controller
                                    control={control}
                                    name="phone"
                                    rules={{
                                        required: 'Phone number is required',
                                        pattern: {
                                            value: /^03[0-9]{9}$/,
                                            message: 'Invalid format'
                                        }
                                    }}
                                    render={({field: {onChange, value}}) => (
                                        <StyledTextInput
                                            value={value}
                                            placeholder={"0300-0000000"}
                                            icon={"phone"}
                                            onChangeText={onChange}
                                        />
                                    )}
                                />
                                {errors.phone && (
                                    <Text className="text-red-500 text-xs mt-1">
                                        {errors.phone.message}
                                    </Text>
                                )}
                            </Card>
                        </View>

                        {/* Submit */}
                        <View className="z-0">
                            <PrimaryButton
                                title={isPending ? "Finding Rides" : "Find Rides"}
                                onPress={handleSubmit(onSubmit)}
                                disabled={isPending}
                            />
                        </View>
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>
        </GestureHandlerRootView>
    )
}

