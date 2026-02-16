
import React, {useEffect, useRef, useState} from "react";
import {View, Text, TouchableOpacity, Pressable} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {useLocationPermissions} from "@/src/hooks/useLocationPermissions";
import {useMapLocation} from "@/src/hooks/useMapLocation";
import {useCurrentLocation} from "@/src/hooks/useCurrentLocation";
import {Controller, useForm} from "react-hook-form";
import {useLocationStore} from "@/src/stores/locationStore";
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

type FormData = {
    startLocation: {
        latitude: number;
        longitude: number;
        address: string;
    } | null;
    destination: {
        latitude: number;
        longitude: number;
        address: string;
    } | null;
    vehicleModel: string;
    LicensePlate: string;
    phone: string;
};

export default function PostRide() {

    const mapRef = useRef<MapView>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);

// Use custom hooks
    const {hasLocationPermission} = useLocationPermissions();
    const {centerOnUserLocation, animateToLocation} = useMapLocation(mapRef);
    const {getCurrentLocation} = useCurrentLocation();

    const {control, handleSubmit, getValues, setValue, formState: {errors}} = useForm<FormData>({
        defaultValues: {
            startLocation: null,
            destination: null,
            vehicleModel: '',
            LicensePlate: '',
            phone: ''
        }
    });

    const [numberOfPassengers, setNumberOfPassengers] = React.useState(1);
    const [vehicleType, setVehicleType] = React.useState<'car' | 'bike'>('car');
    const [isExpanded, setIsExpanded] = useState(false);

    const snapPoints = ["5%", "60%", "90%"]

// Get current form values safely
    let startLocation = getValues('startLocation');
    let destination = getValues('destination');

    const {userLatitude, userLongitude} = useLocationStore();

    const initialRegion = userLatitude && userLongitude
        ? {
            latitude: userLatitude,
            longitude: userLongitude,
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
            Toast.show({
                type: 'success',
                text1: '📍 Location Set',
                text2: 'Start location set to your current location',
                position: 'top',
                visibilityTime: 2000,
            });
        }
    };


    const onSubmit = (data: FormData) => {
        console.log(JSON.stringify({
            startLocation: data.startLocation,
            destination: data.destination,
            vehicleModel: data.vehicleModel,
            LicensePlate: data.LicensePlate,
            phone: data.phone,
            vehicleType,
            numberOfPassengers
        }, null, 2));
        // You can now use data.startLocation.latitude, data.startLocation.longitude, etc.
    };

    useEffect(() => {
        startLocation = getValues('startLocation');
        destination = getValues('destination');
    }, [getValues]);

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
                    {startLocation && (
                        <Marker
                            coordinate={{
                                latitude: startLocation.latitude,
                                longitude: startLocation.longitude
                            }}
                        >
                            <CustomMarker color={"red"} icon={"home"}/>
                        </Marker>
                    )}

                    {destination && (
                        <Marker
                            coordinate={{
                                latitude: destination.latitude,
                                longitude: destination.longitude
                            }}

                        >
                            <CustomMarker color={"red"} icon={"flag"}/>
                        </Marker>
                    )}

                    {startLocation && destination && (
                        <>
                            <MapViewDirections
                                origin={{
                                    latitude: startLocation.latitude,
                                    longitude: startLocation.longitude
                                }}
                                destination={{
                                    latitude: destination.latitude,
                                    longitude: destination.longitude
                                }}
                                strokeWidth={2}
                                strokeColor="red"
                                apikey={GOOGLE_API_KEY}
                                mode={"DRIVING"}
                                precision={"high"}
                                onReady={(result) => {
                                    console.log(`Distance: ${result.distance} km, Duration: ${result.duration} min`);
                                }}
                                onError={(errorMessage) => {
                                    console.error('MapViewDirections Error A->B:', errorMessage);
                                    Toast.show({
                                        type: 'error',
                                        text1: '🗺️ Directions Error',
                                        text2: 'Unable to load route.',
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
                            name="startLocation"
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
                            name="destination"
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
                        {/* Vehicle Type Toggle */}
                        <ToggleButton
                            label="Vehicle Type"
                            options={[
                                {value: 'car', label: 'Car', icon: 'car-sport'},
                                {value: 'bike', label: 'Bike', icon: 'bicycle'}
                            ]}
                            selectedValue={vehicleType}
                            onSelect={setVehicleType}
                        />

                        {/* Vehicle Details Card */}
                        <View className="z-0">
                            <Card className={"px-4"}>
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
                            vehicleType === 'car' && (
                                <NumberStepper
                                    label="Available Seats"
                                    value={numberOfPassengers}
                                    onValueChange={setNumberOfPassengers}
                                    minValue={1}
                                    maxValue={vehicleType === 'car' ? 4 : 1}
                                />
                            )
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
                                            value: /^[0-9]{11}$/,
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
                                title={"Upload Ride"}
                                onPress={handleSubmit(onSubmit)}
                            />
                        </View>
                    </View>
                </BottomSheetScrollView>
            </BottomSheet>
        </GestureHandlerRootView>
    )
}



