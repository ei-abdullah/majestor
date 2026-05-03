import React, {useEffect, useMemo, useRef, useState} from "react";
import {View, Text, TouchableOpacity, Pressable} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {useLocationStore} from "@/src/stores/locationStore";
import {useMapLocation} from "@/src/hooks/useMapLocation";
import {useCurrentLocation} from "@/src/hooks/useCurrentLocation";
import {Controller, useForm} from "react-hook-form";
import {DEFAULT_LOCATION} from "@/src/utils/location.utils";
import Toast from "react-native-toast-message";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import CustomMarker from "@/src/components/ui/CustomMarker";
import MapViewDirections from "react-native-maps-directions";
import {GOOGLE_API_KEY} from "@/src/constants";
import {Ionicons, Feather} from "@expo/vector-icons";
import LocationSearchModal from "@/src/components/ui/LocationSearchModal";
import ToggleButton from "@/src/components/ui/ToggleButton";
import Card from "@/src/components/ui/Card";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import NumberStepper from "@/src/components/ui/NumberStepper";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import {useRideStore} from "@/src/stores/rideStore";
import {useCarpoolDraftStore} from "@/src/stores/carpoolDraftStore";
import {UploadRideResponse} from "@/src/types/ride";
import {Href, useRouter} from "expo-router";
import {useUploadRide} from "@/src/queries/ride.queries";
import {useAuthStore} from "@/src/stores/authStore";
import {useIsFocused} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface FormData {
    startLocation: {
        latitude: number,
        longitude: number,
        address: string,
    } | null,
    endLocation: {
        latitude: number,
        longitude: number,
        address: string,
    } | null,
    vehicleModel: string,
    LicensePlate: string,
    phone: string,
}

export default function PostRide() {
    const router = useRouter();
    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Use custom hooks
    const {hasLocationPermission} = useLocationStore();
    const {animateToLocation} = useMapLocation(mapRef);
    const {getCurrentLocation} = useCurrentLocation();
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();

    const {user} = useAuthStore();
    const rideState = useRideStore();
    const {postRide: draft, savePostRide} = useCarpoolDraftStore();
    const {mutate: uploadRide, isPending} = useUploadRide((data: UploadRideResponse) => {
        rideState.setRideDetails({...data});
        router.push('/(tabs)/carpool/ride/bookingRequests' as Href)
    })

    const {control, watch, handleSubmit, setValue, formState: {errors}} = useForm<FormData>({
        defaultValues: {
            startLocation: draft.startLocation,
            endLocation: draft.endLocation,
            vehicleModel: draft.vehicleModel,
            LicensePlate: draft.licensePlate,
            phone: draft.phone || user!.phone || '',
        }
    });

    const [numberOfPassengers, setNumberOfPassengers] = React.useState(draft.numberOfPassengers);
    const [vehicleType, setVehicleType] = React.useState<'CAR' | 'BIKE'>(draft.vehicleType);
    const [modalField, setModalField] = useState<'start' | 'end' | null>(null);
    const [routeDistanceKm, setRouteDistanceKm] = useState(0);
    const headerOffset = insets.top + 72;


    const snapPoints = useMemo(() => ["25%", "60%", "80%"], []);

    // Get current form values safely
    const startLocation = watch('startLocation');
    const endLocation = watch('endLocation');

    const initialRegion = rideState.startLocationLat && rideState.startLocationLng
        ? {
            latitude: rideState.startLocationLat,
            longitude: rideState.startLocationLng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        }
        : DEFAULT_LOCATION;

    /**
     * Fetches current location and sets it as startLocation
     */
    const handleUseMyLocation = async () => {
        const location = await getCurrentLocation();
        if (location) {
            setValue('startLocation', location);
            animateToLocation(location.latitude, location.longitude);
        }
    };

    const onSubmit = (data: FormData) => {
        if (!data.startLocation || !data.endLocation || !user) return;

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

        savePostRide({
            startLocation: data.startLocation,
            endLocation: data.endLocation,
            vehicleModel: data.vehicleModel,
            licensePlate: data.LicensePlate,
            phone: data.phone,
            numberOfPassengers,
            vehicleType,
        });

        uploadRide({
            uploadRideDetails: {
                startLocationLat: data.startLocation.latitude,
                startLocationLng: data.startLocation.longitude,
                startLocationAddress: data.startLocation.address,
                endLocationLat: data.endLocation.latitude,
                endLocationLng: data.endLocation.longitude,
                endLocationAddress: data.endLocation.address,
                vehicleType,
                vehicleModal: data.vehicleModel,
                licensePlate: data.LicensePlate,
                phone: data.phone,
                availableSeats: numberOfPassengers,
                routeDistanceKm,
            },
            userId: user.id,
        });
    };

    const handleVehicleTypeChange = (type: 'CAR' | 'BIKE') => {
        setVehicleType(type);
        if (type === 'BIKE') setNumberOfPassengers(1);
    };

    useEffect(() => {
        // Clear any stale persisted ride from a previous session
        rideState.clearRideDetails();

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
                    {/* Show markers only when locations are selected */}
                    {startLocation && (
                        <Marker
                            coordinate={{
                                latitude: startLocation.latitude,
                                longitude: startLocation.longitude
                            }}
                        >
                            <CustomMarker color={"#3A6FF8"} icon={"home"}/>
                        </Marker>
                    )}

                    {endLocation && (
                        <Marker
                            coordinate={{
                                latitude: endLocation.latitude,
                                longitude: endLocation.longitude
                            }}

                        >
                            <CustomMarker color={"#3A6FF8"} icon={"flag"}/>
                        </Marker>
                    )}

                    {startLocation && endLocation && (
                        <>
                            <MapViewDirections
                                origin={{
                                    latitude: startLocation.latitude,
                                    longitude: startLocation.longitude
                                }}
                                destination={{
                                    latitude: endLocation.latitude,
                                    longitude: endLocation.longitude
                                }}
                                strokeWidth={2}
                                strokeColor="#3A6FF8"
                                apikey={GOOGLE_API_KEY}
                                mode={"DRIVING"}
                                precision={"high"}
                                onReady={(result) => {
                                    setRouteDistanceKm(result.distance);
                                }}
                                onError={(errorMessage: any) => {
                                    Toast.show({
                                        type: 'error',
                                        text1: '🗺️ Directions Error',
                                        text2: `Unable to load route. Error: ${errorMessage}`,
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
                        paddingBottom: 36,
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
                                <TouchableOpacity
                                    onPress={handleUseMyLocation}
                                    className="flex-row items-center gap-1 px-2 py-1 rounded-full bg-mj-blue-50"
                                >
                                    <Ionicons name="locate" size={14} color="#3A6FF8"/>
                                    <Text className="text-xs text-mj-blue font-sans-medium">Use My Location</Text>
                                </TouchableOpacity>
                            </View>
                            <Pressable
                                onPress={() => setModalField('start')}
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
                                <Feather name="map-pin" size={18} color={startLocation ? '#4CB8AD' : '#9CA3AF'}/>
                                <Text
                                    numberOfLines={1}
                                    style={{flex: 1, fontSize: 15, color: startLocation ? '#111827' : '#9CA3AF'}}
                                >
                                    {startLocation?.address ?? 'Enter origin'}
                                </Text>
                            </Pressable>

                            <Text className="text-xs text-gray-500 mb-2 mt-3">To</Text>
                            <Pressable
                                onPress={() => setModalField('end')}
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
                                <Feather name="flag" size={18} color={endLocation ? '#4CB8AD' : '#9CA3AF'}/>
                                <Text
                                    numberOfLines={1}
                                    style={{flex: 1, fontSize: 15, color: endLocation ? '#111827' : '#9CA3AF'}}
                                >
                                    {endLocation?.address ?? 'Enter destination'}
                                </Text>
                            </Pressable>
                        </View>

                        {/* Vehicle Type Toggle */}
                        <ToggleButton
                            label="Vehicle Type"
                            options={[
                                {value: 'CAR', label: 'Car', icon: 'car-sport'},
                                {value: 'BIKE', label: 'Bike', icon: 'bicycle'}
                            ]}
                            selectedValue={vehicleType}
                            onSelect={handleVehicleTypeChange}
                        />

                        {/* Vehicle Details Card */}
                        <View className="z-0">
                            <Card className={"p-6"}>
                                <View>
                                    <Text className="text-base font-sans-semibold mb-2">Vehicle Model</Text>
                                    <Controller
                                        control={control}
                                        name="vehicleModel"
                                        rules={{required: 'Vehicle model is required'}}
                                        render={({field: {onChange, value}}) => (
                                            <StyledTextInput
                                                value={value}
                                                placeholder={"e.g, Black Honda Fit"}
                                                icon={"key"}
                                                onChangeText={onChange}
                                                isInBottomSheet={true}
                                            />
                                        )}
                                    />
                                    {errors.vehicleModel && (
                                        <Text className="text-red-500 text-xs mt-1">
                                            {errors.vehicleModel.message}
                                        </Text>
                                    )}
                                </View>
                                <View className={"mt-6"}>
                                    <Text className="text-base font-sans-semibold mb-2">License Plate Number</Text>
                                    <Controller
                                        control={control}
                                        name="LicensePlate"
                                        rules={{required: 'License plate is required'}}
                                        render={({field: {onChange, value}}) => (
                                            <StyledTextInput
                                                value={value}
                                                placeholder={"e.g, MG-841"}
                                                icon={"info"}
                                                onChangeText={onChange}
                                                isInBottomSheet={true}
                                            />
                                        )}
                                    />
                                    {errors.LicensePlate && (
                                        <Text className="text-red-500 text-xs mt-1">
                                            {errors.LicensePlate.message}
                                        </Text>
                                    )}
                                </View>
                            </Card>
                        </View>

                        {/* Number of Passengers */}
                        {
                            vehicleType === 'CAR' && (
                                <NumberStepper
                                    label="Available Seats"
                                    value={numberOfPassengers}
                                    onValueChange={setNumberOfPassengers}
                                    minValue={1}
                                    maxValue={vehicleType === 'CAR' ? 4 : 1}
                                />
                            )
                        }

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
                        <View className="z-0">
                            <PrimaryButton
                                title={isPending ? "Uploading" : "Upload Ride"}
                                onPress={handleSubmit(onSubmit)}
                                disabled={isPending}
                            />
                        </View>
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>

        <LocationSearchModal
            visible={modalField !== null}
            title={modalField === 'start' ? 'Select Origin' : 'Select Destination'}
            onClose={() => setModalField(null)}
            onSelect={(location) => {
                if (modalField === 'start') {
                    setValue('startLocation', location);
                    animateToLocation(location.latitude, location.longitude);
                } else {
                    setValue('endLocation', location);
                }
            }}
        />
        </GestureHandlerRootView>
    )
}



