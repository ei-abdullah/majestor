import { useEffect } from 'react';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { useLocationStore } from '@/src/stores/locationStore';
import { DEFAULT_LOCATION, formatShortAddress } from '@/src/utils/location.utils';
import * as Sentry from "@sentry/react-native";

export const useLocationPermissions = () => {
    const {
        setUserLocation,
        setHasLocationPermission,
        hasLocationPermission
    } = useLocationStore();

    const [permission, requestPermission] = Location.useForegroundPermissions();

    useEffect(() => {
        if (permission === null) return;

        if (permission.granted) {
            setHasLocationPermission(true);
            fetchAndSetLocation().catch(handleLocationError);
        } else if (!permission.granted && permission.status !== 'undetermined') {
            handlePermissionDenied();
        }
    }, [permission?.granted]);

    useEffect(() => {
        Location.hasServicesEnabledAsync().then((enabled) => {
            if (!enabled) handleLocationDisabled();
            else requestPermission();
        });
    }, []);

    const requestLocationPermission = async () => {
        try {
            const isLocationEnabled = await Location.hasServicesEnabledAsync();
            if (!isLocationEnabled) {
                handleLocationDisabled();
                return;
            }
            await requestPermission();
        } catch (error: any) {
            Sentry.captureException(error);
            handleLocationError(error);
        }
    };

    const fetchAndSetLocation = async () => {
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
            address: formatShortAddress(address[0])
        });
    };

    const handleLocationDisabled = () => {
        setHasLocationPermission(false);
        setUserLocation({
            latitude: DEFAULT_LOCATION.latitude,
            longitude: DEFAULT_LOCATION.longitude,
            address: "San Francisco, CA"
        });

        Toast.show({
            type: 'error',
            text1: '📍 Location Services Off',
            text2: 'Please enable location services in settings',
            position: 'top',
            visibilityTime: 5000,
        });
    };

    const handlePermissionDenied = () => {
        setHasLocationPermission(false);
        setUserLocation({
            latitude: DEFAULT_LOCATION.latitude,
            longitude: DEFAULT_LOCATION.longitude,
            address: "San Francisco, CA"
        });

        Toast.show({
            type: 'error',
            text1: '📍 Location Permission Denied',
            text2: 'Using default location. Tap to retry.',
            position: 'top',
            visibilityTime: 5000,
            onPress: () => {
                Toast.hide();
                requestLocationPermission();
            }
        });
    };

    const handleLocationError = (error: any) => {
        Sentry.captureException(error);
        setHasLocationPermission(false);
        setUserLocation({
            latitude: DEFAULT_LOCATION.latitude,
            longitude: DEFAULT_LOCATION.longitude,
            address: "San Francisco, CA"
        });

        let errorMessage = 'Unable to fetch location';
        if (error.message?.includes('timeout')) {
            errorMessage = 'Location request timed out. Try again.';
        } else if (error.message?.includes('Location services')) {
            errorMessage = 'Location services are disabled';
        }

        Toast.show({
            type: 'error',
            text1: '❌ Location Error',
            text2: errorMessage,
            position: 'top',
            visibilityTime: 3000,
        });
    };

    return {
        hasLocationPermission,
        requestLocationPermission,
        refetchLocation: fetchAndSetLocation
    };
};
