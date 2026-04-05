import React, {useEffect, useMemo, useRef, useState} from "react";
import {View, Text, TouchableOpacity, Pressable} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {useLocationPermissions} from "@/src/hooks/useLocationPermissions";
import {useMapLocation} from "@/src/hooks/useMapLocation";
import {useCurrentLocation} from "@/src/hooks/useCurrentLocation";
import {Controller, useForm} from "react-hook-form";
import {DEFAULT_LOCATION} from "@/src/utils/location.utils";
import Toast from "react-native-toast-message";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import CustomMarker from "@/src/components/ui/CustomMarker";
import MapViewDirections from "react-native-maps-directions";
import {GOOGLE_API_KEY} from "@/src/constants";
import {Ionicons} from "@expo/vector-icons";
import GoogleTextInput from "@/src/components/ui/GoogleTextInput";
import ToggleButton from "@/src/components/ui/ToggleButton";
import Card from "@/src/components/ui/Card";
import StyledTextInput from "@/src/components/ui/StyledTextInput";
import NumberStepper from "@/src/components/ui/NumberStepper";
import PrimaryButton from "@/src/components/ui/PrimaryButton";
import {useRideStore} from "@/src/stores/rideStore";
import {UploadRideResponse} from "@/src/types/ride";
import {useRouter} from "expo-router";
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
    const {hasLocationPermission} = useLocationPermissions();
    const {animateToLocation} = useMapLocation(mapRef);
    const {getCurrentLocation} = useCurrentLocation();
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();

    const {user} = useAuthStore();
    const rideState = useRideStore();
    const {mutate: uploadRide, isPending} = useUploadRide((data: UploadRideResponse) => {
        rideState.setRideDetails({
            ...data
        });
        router.push('/(tabs)/carpool/ride/bookingRequests')
    })

    const {control, watch, handleSubmit, setValue, formState: {errors}} = useForm<FormData>({
        defaultValues: {
            startLocation: null,
            endLocation: null,
            vehicleModel: '',
            LicensePlate: '',
            phone: user!.phone || ''
        }
    });

    const [numberOfPassengers, setNumberOfPassengers] = React.useState(1);
    const [vehicleType, setVehicleType] = React.useState<'CAR' | 'BIKE'>('CAR');
    const [isExpanded, setIsExpanded] = useState(false);
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

                {/* Location Card */}
                {!isExpanded ? (
                    <Pressable
                        onPress={() => setIsExpanded(true)}
                        className="absolute right-4 bg-white rounded-2xl p-3 shadow-lg"
                        style={{top: headerOffset}}
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
                    <View className="absolute left-4 right-4 bg-white rounded-2xl p-4 shadow-lg" style={{top: headerOffset}}>
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
                            name="startLocation"
                            render={({field: {onChange, value}}) => (
                                <GoogleTextInput
                                    placeholderString={"Enter origin"}
                                    icon="map-pin"
                                    initialLocation={value?.address}
                                    handlePress={(location) => {
                                        onChange(location);
                                        animateToLocation(location.latitude, location.longitude);
                                    }}
                                />
                            )}
                        />

                        <Text className="text-xs text-gray-500 mb-2 mt-3">To</Text>
                        <Controller
                            control={control}
                            name="endLocation"
                            render={({field: {onChange, value}}) => (
                                <GoogleTextInput
                                    placeholderString={"Enter destination"}
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
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingTop: 16,
                        paddingBottom: 130,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className={"flex gap-4"}>
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
                                    <Text className="text-base font-semibold mb-2">Vehicle Model</Text>
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
                                    <Text className="text-base font-semibold mb-2">License Plate Number</Text>
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
                                title={isPending ? "Uploading" : "Upload Ride"}
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



