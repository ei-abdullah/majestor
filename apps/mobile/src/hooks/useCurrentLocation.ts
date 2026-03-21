import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { formatShortAddress } from '@/src/utils/location.utils';
import * as Sentry from "@sentry/react-native";

/**
 * Hook to get the current location on demand
 * Useful for "Use My Location" buttons
 */
export const useCurrentLocation = () => {
    const getCurrentLocation = async (): Promise<{
        latitude: number;
        longitude: number;
        address: string;
    } | null> => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                Toast.show({
                    type: 'error',
                    text1: '📍 Permission Required',
                    text2: 'Please grant location permission',
                    position: 'top',
                    visibilityTime: 3000,
                });
                return null;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const address = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                address: formatShortAddress(address[0])
            };
        } catch (error) {
            Sentry.captureException(error);
            Toast.show({
                type: 'error',
                text1: '❌ Location Error',
                text2: 'Unable to get your location',
                position: 'top',
                visibilityTime: 3000,
            });
            return null;
        }
    };

    return { getCurrentLocation };
};
