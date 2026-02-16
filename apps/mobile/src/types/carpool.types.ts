/**
 * Type definitions for Carpool Feature
 *
 * These types are designed to work with the UI components.
 * Adjust based on your actual API schema.
 */

// Common Types
export type VehicleType = 'car' | 'bike';
export type BookingStatus = 'pending' | 'accepted' | 'rejected';

// Location Types
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface LocationDetails extends Location {
  name?: string;
  city?: string;
  country?: string;
}

// User/Driver Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface DriverProfile extends User {
  rating?: number;
  totalRides?: number;
  vehicleType?: VehicleType;
  vehicleModel?: string;
}

// Ride Types
export interface Ride {
  id: string;
  driver: DriverProfile;
  startLocation: LocationDetails;
  endLocation: LocationDetails;
  vehicleType: VehicleType;
  vehicleModel: string;
  availableSeats: number;
  totalSeats: number;
  departureTime?: string;
  notes?: string;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface RideWithDeviation extends Ride {
  deviation?: number; // Distance in km
  estimatedDistance?: number; // Total distance in km
}

// Booking Types
export interface BookingRequest {
  id: string;
  rideId: string;
  booker: User;
  pickupLocation: LocationDetails;
  dropoffLocation: LocationDetails;
  passengers: number;
  deviation: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Booking extends BookingRequest {
  ride: Ride;
  acceptedAt?: string;
  rejectedAt?: string;
  cancelledAt?: string;
}

// Form Types
export interface PostRideFormData {
  startLocation: LocationDetails;
  endLocation: LocationDetails;
  vehicleType: VehicleType;
  vehicleModel: string;
  availableSeats: number;
  phoneNumber: string;
  departureTime?: string;
  notes?: string;
}

export interface BookRideFormData {
  pickupLocation: LocationDetails;
  dropoffLocation: LocationDetails;
  passengers: number;
  phoneNumber: string;
  notes?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// Search/Filter Types
export interface RideSearchParams {
  pickupLocation: Location;
  dropoffLocation: Location;
  passengers: number;
  maxDeviation?: number; // in km
  vehicleType?: VehicleType;
  departureTime?: string;
}

export interface RideFilters {
  vehicleType?: VehicleType;
  maxDeviation?: number;
  minRating?: number;
  sortBy?: 'deviation' | 'time' | 'rating';
  sortOrder?: 'asc' | 'desc';
}

// Map Types
export interface RouteInfo {
  distance: number; // in km
  duration: number; // in minutes
  polyline?: string; // encoded polyline
}

export interface DeviationInfo {
  originalDistance: number;
  newDistance: number;
  extraDistance: number;
  extraTime?: number; // in minutes
}

// Notification Types
export interface Notification {
  id: string;
  type: 'new_booking' | 'booking_accepted' | 'booking_rejected' | 'ride_updated';
  title: string;
  message: string;
  data?: any;
  createdAt: string;
  read: boolean;
}

// WebSocket Types
export interface WebSocketMessage {
  type: 'booking_request' | 'booking_response' | 'ride_update' | 'chat_message';
  payload: any;
  timestamp: string;
}

// Stats Types
export interface RideStats {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  averageRating: number;
  totalDistance: number; // in km
}

export interface UserStats {
  asDriver: RideStats;
  asPassenger: RideStats;
}

