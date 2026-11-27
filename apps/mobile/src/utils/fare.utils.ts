export interface VehicleConfig {
    pricePerKm: number;
}

export interface FareConfig {
    car: VehicleConfig;
    bike: VehicleConfig;
}

export type VehicleType = 'CAR' | 'BIKE';

const EARTH_RADIUS_KM = 6371.0;

export function calculateFare(deviationKm: number, vehicleType: VehicleType, config: FareConfig): number {
    const cfg = vehicleType === 'BIKE' ? config.bike : config.car;
    return Math.round(cfg.pricePerKm * Math.max(0, Math.abs(deviationKm)));
}

export function calculateHaversineDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
}

/**
 * Estimates the extra distance (detour in km) a driver travels to pick up and drop off a passenger
 * when full multi-leg road directions are not yet loaded.
 * Formula: max(0, (dist(DriverStart -> Pickup) + dist(Pickup -> Dropoff) + dist(Dropoff -> DriverEnd)) - dist(DriverStart -> DriverEnd))
 */
export function estimateDetourKm(params: {
    driverStartLat?: number | null;
    driverStartLng?: number | null;
    driverEndLat?: number | null;
    driverEndLng?: number | null;
    pickupLat?: number | null;
    pickupLng?: number | null;
    dropoffLat?: number | null;
    dropoffLng?: number | null;
}): number {
    const {
        driverStartLat,
        driverStartLng,
        driverEndLat,
        driverEndLng,
        pickupLat,
        pickupLng,
        dropoffLat,
        dropoffLng,
    } = params;

    if (
        driverStartLat == null ||
        driverStartLng == null ||
        driverEndLat == null ||
        driverEndLng == null ||
        pickupLat == null ||
        pickupLng == null ||
        dropoffLat == null ||
        dropoffLng == null
    ) {
        return 0;
    }

    const leg1 = calculateHaversineDistanceKm(driverStartLat, driverStartLng, pickupLat, pickupLng);
    const leg2 = calculateHaversineDistanceKm(pickupLat, pickupLng, dropoffLat, dropoffLng);
    const leg3 = calculateHaversineDistanceKm(dropoffLat, dropoffLng, driverEndLat, driverEndLng);
    const direct = calculateHaversineDistanceKm(driverStartLat, driverStartLng, driverEndLat, driverEndLng);

    const detour = Math.max(0, leg1 + leg2 + leg3 - direct);
    return Math.round(detour * 100) / 100;
}
