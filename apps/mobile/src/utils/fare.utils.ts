export interface VehicleConfig {
    pricePerKm: number;
}

export interface FareConfig {
    car: VehicleConfig;
    bike: VehicleConfig;
}

export type VehicleType = 'CAR' | 'BIKE';

export function calculateFare(deviationKm: number, vehicleType: VehicleType, config: FareConfig): number {
    const cfg = vehicleType === 'BIKE' ? config.bike : config.car;
    return Math.round(cfg.pricePerKm * Math.abs(deviationKm));
}