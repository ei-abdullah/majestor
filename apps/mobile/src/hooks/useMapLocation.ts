import { RefObject } from 'react';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { useLocationStore } from '@/src/stores/locationStore';
import { createMapRegion } from '@/src/utils/location.utils';

/**
 * Custom hook for map-related operations
 * Provides utilities for centering, animating, and interacting with MapView
 */
export const useMapLocation = (mapRef: RefObject<MapView | null>) => {
    const {
        userLatitude,
        userLongitude,
        hasLocationPermission
    } = useLocationStore();

    /**
     * Center map on the user's current location
     */
    const centerOnUserLocation = async () => {
        if (mapRef.current && userLatitude && userLongitude && hasLocationPermission) {
            mapRef.current.animateToRegion(
                createMapRegion(userLatitude, userLongitude),
                500
            );
        } else if (!hasLocationPermission) {
            await promptLocationPermission();
        }
    };

    /**
     * Animate map to specific coordinates
     */
    const animateToLocation = (latitude: number, longitude: number, duration: number = 500) => {
        if (mapRef.current) {
            mapRef.current.animateToRegion(
                createMapRegion(latitude, longitude),
                duration
            );
        }
    };

    /**
     * Fit map to show multiple markers
     */
    const fitToMarkers = (markers: Array<{ latitude: number; longitude: number }>, animated: boolean = true) => {
        if (mapRef.current && markers.length > 0) {
            mapRef.current.fitToCoordinates(markers, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated
            });
        }
    };

    /**
     * Prompt user to enable location permissions
     */
    const promptLocationPermission = async () => {
        const isLocationEnabled = await Location.hasServicesEnabledAsync();

        if (!isLocationEnabled) {
            Toast.show({
                type: 'info',
                text1: '⚙️ Enable Location Services',
                text2: 'Go to Settings > Location and turn it on',
                position: 'top',
                visibilityTime: 4000,
            });
        } else {
            Toast.show({
                type: 'info',
                text1: '⚙️ Grant Location Permission',
                text2: 'Go to Settings > App Permissions > Location',
                position: 'top',
                visibilityTime: 4000,
            });
        }
    };

    return {
        centerOnUserLocation,
        animateToLocation,
        fitToMarkers,
        hasLocationPermission
    };
};

