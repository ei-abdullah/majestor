import { useEffect } from 'react';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { useLocationStore } from '@/src/stores/locationStore';
import { DEFAULT_LOCATION, formatShortAddress, formatAddress } from '@/src/utils/location.utils';
import * as Sentry from "@sentry/react-native";

/**
 * Custom hook to handle location permissions and initial location fetch
 * Automatically requests permissions and updates global store
 */
export const useLocationPermissions = () => {
    const {
        setUserLocation,
        setHasLocationPermission,
        hasLocationPermission
    } = useLocationStore();

    useEffect(() => {
        requestLocationPermission();
    }, []);

    const requestLocationPermission = async () => {
        try {
            // Check if location services are enabled
            const isLocationEnabled = await Location.hasServicesEnabledAsync();
            if (!isLocationEnabled) {
                handleLocationDisabled();
                return;
            }

            // Request permission
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                handlePermissionDenied();
                return;
            }

            // Permission granted - fetch location
            setHasLocationPermission(true);
            await fetchAndSetLocation();
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
