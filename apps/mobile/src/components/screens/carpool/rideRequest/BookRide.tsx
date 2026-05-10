import React, {useEffect, useMemo, useRef, useState} from "react";
import {Text, View, Pressable} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import NumberStepper from "@/src/components/ui/NumberStepper";
import Card from "@/src/components/ui/Card";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import {Controller, useForm} from "react-hook-form";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import {Ionicons, Feather} from "@expo/vector-icons";
import CustomMarker from "@/src/components/ui/CustomMarker";
import MapViewDirections from "react-native-maps-directions";
import Toast from "react-native-toast-message";
import {useLocationStore} from "@/src/stores/locationStore";
import {useMapLocation} from "@/src/hooks/useMapLocation";
import {useCurrentLocation} from "@/src/hooks/useCurrentLocation";
import {GOOGLE_API_KEY} from "@/src/constants";
import {DEFAULT_LOCATION} from "@/src/utils/location.utils";
import {useAuthStore} from "@/src/stores/authStore";
import {useRideRequestStore} from "@/src/stores/rideRequestStore";
import {useCarpoolDraftStore} from "@/src/stores/carpoolDraftStore";
import {useUploadRideRequest} from "@/src/queries/rideRequest.queries";
import {UploadRideRequestResponse} from "@/src/types/rideRequest";
import {Href, router} from "expo-router";
import {useIsFocused} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import LocationSearchModal from "@/src/components/ui/LocationSearchModal";

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
    const {hasLocationPermission} = useLocationStore();
    const {animateToLocation} = useMapLocation(mapRef);
    const {getCurrentLocation} = useCurrentLocation();
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();

    const {user} = useAuthStore();
    const rideRequestState = useRideRequestStore();
    const {bookRide: draft, saveBookRide} = useCarpoolDraftStore();
    const {mutate: uploadRideRequest, isPending} = useUploadRideRequest((data: UploadRideRequestResponse) => {
        rideRequestState.setRideRequestDetails({
            ...data
        });
        router.push("/(tabs)/carpool/rideRequest/availableRides" as Href)
    });

    const {control, watch, handleSubmit, setValue, formState: {errors}} = useForm<FormData>({
        defaultValues: {
            pickupLocation: draft.pickupLocation,
            dropOffLocation: draft.dropOffLocation,
            phone: draft.phone || user!.phone || '',
        }
    });

    const [numberOfPassengers, setNumberOfPassengers] = useState(draft.numberOfPassengers);
    const [routeDistanceKm, setRouteDistanceKm] = useState(0);
    const [modalField, setModalField] = useState<'pickup' | 'dropoff' | null>(null);
    const headerOffset = insets.top + 72;

    const snapPoints = useMemo(() => ["25%", "60%", "90%"], []);

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

    const handleUseMyLocation = async () => {
        const location = await getCurrentLocation();
        if (location) {
            setValue('pickupLocation', location);
            animateToLocation(location.latitude, location.longitude);
        }
    };

    const onSubmit = (data: FormData) => {
        if (!data.pickupLocation || !data.dropOffLocation || !user) return;

        if (routeDistanceKm === 0) {
            Toast.show({
                type: 'error',
                text1: 'Route not ready',
                text2: 'Wait for the route to finish loading on the map',
                position: 'top',
                visibilityTime: 3000,
            });
            return;
        }

        saveBookRide({
            pickupLocation: data.pickupLocation,
            dropOffLocation: data.dropOffLocation,
            phone: data.phone,
            numberOfPassengers,
        });

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
                    showsUserLocation={hasLocationPermission && isFocused}
                    showsMyLocationButton={false}
                    userInterfaceStyle={"light"}
                    style={{flex: 1}}
                    mapPadding={{top: headerOffset + 8, right: 10, bottom: 10, left: 10}}
                >
                    {pickupLocation && (
                        <Marker
                            coordinate={{
                                latitude: pickupLocation.latitude,
                                longitude: pickupLocation.longitude
                            }}
                        >
                            <CustomMarker color={"#3A6FF8"} icon={"home"}/>
                        </Marker>
                    )}

                    {dropOffLocation && (
                        <Marker
                            coordinate={{
                                latitude: dropOffLocation.latitude,
                                longitude: dropOffLocation.longitude
                            }}
                        >
                            <CustomMarker color={"#3A6FF8"} icon={"flag"}/>
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
                                strokeColor="#3A6FF8"
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
            </View>

            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
                backgroundStyle={{backgroundColor: '#f9fafb'}}
                handleIndicatorStyle={{backgroundColor: '#d1d5db'}}
                keyboardBehavior="extend"
                keyboardBlurBehavior="restore"
            >
                <BottomSheetScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingTop: 16,
                        paddingBottom: 56,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className={"flex gap-4"}>
                        {/* Location Selection */}
                        <View className="bg-white rounded-2xl p-4">
                            <View className="flex-row items-center justify-between mb-3">
                                <Text className="text-base font-sans-semibold">Select Locations</Text>
                            </View>

                            <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-xs text-gray-500">From</Text>
                                <Pressable
                                    onPress={handleUseMyLocation}
                                    className="flex-row items-center gap-1 px-2 py-1 rounded-full bg-mj-blue-50"
                                >
                                    <Ionicons name="locate" size={14} color="#3A6FF8"/>
                                    <Text className="text-xs text-mj-blue font-sans-medium">Use My Location</Text>
                                </Pressable>
                            </View>
                            <Pressable
                                onPress={() => setModalField('pickup')}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: '#f3f4f6',
                                    backgroundColor: 'white',
                                    height: 72,
                                    paddingHorizontal: 16,
                                    gap: 12,
                                    elevation: 1,
                                    shadowColor: '#000',
                                    shadowOffset: {width: 0, height: 1},
                                    shadowOpacity: 0.05,
                                    shadowRadius: 2,
                                }}
                            >
                                <Feather name="map-pin" size={18} color={pickupLocation ? '#4CB8AD' : '#9CA3AF'}/>
                                <Text
                                    numberOfLines={1}
                                    style={{flex: 1, fontSize: 15, color: pickupLocation ? '#111827' : '#9CA3AF'}}
                                >
                                    {pickupLocation?.address ?? 'Enter pickup location'}
                                </Text>
                            </Pressable>

                            <Text className="text-xs text-gray-500 mb-2 mt-3">To</Text>
                            <Pressable
                                onPress={() => setModalField('dropoff')}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: '#f3f4f6',
                                    backgroundColor: 'white',
                                    height: 72,
                                    paddingHorizontal: 16,
                                    gap: 12,
                                    elevation: 1,
                                    shadowColor: '#000',
                                    shadowOffset: {width: 0, height: 1},
                                    shadowOpacity: 0.05,
                                    shadowRadius: 2,
                                }}
                            >
                                <Feather name="flag" size={18} color={dropOffLocation ? '#4CB8AD' : '#9CA3AF'}/>
                                <Text
                                    numberOfLines={1}
                                    style={{flex: 1, fontSize: 15, color: dropOffLocation ? '#111827' : '#9CA3AF'}}
                                >
                                    {dropOffLocation?.address ?? 'Enter drop-off location'}
                                </Text>
                            </Pressable>
                        </View>

                        {/* Number of Passengers */}
                        <NumberStepper
                            label="Number of Passengers"
                            value={numberOfPassengers}
                            onValueChange={setNumberOfPassengers}
                            minValue={1}
                            maxValue={6}
                        />

                        {/* Phone number */}
                        <View className="z-0">
                            <Card className={"p-6"}>
                                <Text className="text-base font-sans-semibold mb-2">Phone Number</Text>
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
                                            isInBottomSheet={true}
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
                        <PrimaryButton
                            title={isPending ? "Finding Rides" : "Find Rides"}
                            onPress={handleSubmit(onSubmit)}
                            disabled={isPending}
                        />
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>

            <LocationSearchModal
                visible={modalField !== null}
                title={modalField === 'pickup' ? 'Select Pickup Location' : 'Select Drop-off Location'}
                onClose={() => setModalField(null)}
                onSelect={(location) => {
                    if (modalField === 'pickup') {
                        setValue('pickupLocation', location);
                        animateToLocation(location.latitude, location.longitude);
                    } else {
                        setValue('dropOffLocation', location);
                    }
                }}
            />
        </GestureHandlerRootView>
    )
}