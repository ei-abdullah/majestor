import * as Location from 'expo-location';

/**
 * Format address from geocoding result
 */
export const formatAddress = (addressComponent: Location.LocationGeocodedAddress): string => {
    const parts = [
        addressComponent.name,
        addressComponent.city,
        addressComponent.region,
        addressComponent.country
    ].filter(Boolean);

    return parts.join(', ');
};

/**
 * Get short address (name + region only)
 */
export const formatShortAddress = (addressComponent: Location.LocationGeocodedAddress): string => {
    return `${addressComponent.name}, ${addressComponent.region}`;
};

/**
 * Default fallback location (San Francisco)
 */
export const DEFAULT_LOCATION = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

/**
 * Default map region deltas
 */
export const MAP_DELTA = {
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

/**
 * Create a region object for MapView
 */
export const createMapRegion = (latitude: number, longitude: number) => ({
    latitude,
    longitude,
    ...MAP_DELTA
});

