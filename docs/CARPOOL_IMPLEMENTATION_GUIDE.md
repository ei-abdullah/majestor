# Carpool Feature Implementation Guide

## Overview

This guide outlines the complete implementation of a ride-sharing/carpooling feature for the Majestor app. The system enables:
- **Drivers (Ride Posters)**: Post rides with source/destination, departure time, and vehicle details
- **Passengers (Bookers)**: Search for rides, submit booking requests, and get matched with compatible routes
- **Real-time Updates**: Drivers receive notifications when their rides are booked

---

## Table of Contents

1. [User Flow](#user-flow)
2. [Data Models](#data-models)
3. [API Endpoints](#api-endpoints)
4. [Frontend Implementation](#frontend-implementation)
5. [Matching Algorithm](#matching-algorithm)
6. [Notification System](#notification-system)
7. [Implementation Order](#implementation-order)

---

## User Flow

### Driver Flow (Posting a Ride)
```
CarpoolHome → PostRide → (Enter details) → Submit → RidesList (see own rides)
                                                  ↓
                                          Receive booking notifications
                                                  ↓
                                          Accept/Reject bookings
```

### Passenger Flow (Booking a Ride)
```
CarpoolHome → BookRide → (Enter source/destination + phone) → Submit
                                                              ↓
                                                        RidesList (matching rides from last 10 min)
                                                              ↓
                                                        RideDetails → Request Booking
                                                              ↓
                                                        Wait for driver response
```

---

## Data Models

### Backend (Java/Spring Boot)

#### 1. Ride Entity
```java
@Entity
@Table(name = "rides")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Driver info
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    // Source location
    @Column(nullable = false)
    private Double sourceLatitude;
    
    @Column(nullable = false)
    private Double sourceLongitude;
    
    @Column(nullable = false)
    private String sourceAddress;

    // Destination location
    @Column(nullable = false)
    private Double destinationLatitude;
    
    @Column(nullable = false)
    private Double destinationLongitude;
    
    @Column(nullable = false)
    private String destinationAddress;

    // Ride details
    @Column(nullable = false)
    private LocalDateTime departureTime;
    
    @Column(nullable = false)
    private Integer availableSeats;
    
    private String vehicleDetails; // e.g., "White Honda Civic - ABC-123"
    
    private String notes; // Optional notes from driver

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RideStatus status = RideStatus.ACTIVE;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt;
}
```

#### 2. BookingRequest Entity
```java
@Entity
@Table(name = "booking_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ride_id", nullable = false)
    private Ride ride;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passenger_id", nullable = false)
    private User passenger;

    // Passenger's pickup location
    @Column(nullable = false)
    private Double pickupLatitude;
    
    @Column(nullable = false)
    private Double pickupLongitude;
    
    @Column(nullable = false)
    private String pickupAddress;

    // Passenger's drop-off location
    @Column(nullable = false)
    private Double dropoffLatitude;
    
    @Column(nullable = false)
    private Double dropoffLongitude;
    
    @Column(nullable = false)
    private String dropoffAddress;

    @Column(nullable = false)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
```

#### 3. Enums
```java
public enum RideStatus {
    ACTIVE,      // Ride is available for booking
    FULL,        // All seats booked
    IN_PROGRESS, // Ride has started
    COMPLETED,   // Ride finished
    CANCELLED    // Ride cancelled by driver
}

public enum BookingStatus {
    PENDING,   // Waiting for driver response
    ACCEPTED,  // Driver accepted the booking
    REJECTED,  // Driver rejected the booking
    CANCELLED  // Passenger cancelled
}
```

### Frontend (TypeScript)

```typescript
// types/carpool.types.ts

export interface Location {
    latitude: number;
    longitude: number;
    address: string;
}

export interface RideDriver {
    id: number;
    username: string;
    avatar?: string;
    phone?: string;
}

export interface Ride {
    id: number;
    driver: RideDriver;
    source: Location;
    destination: Location;
    departureTime: string; // ISO date string
    availableSeats: number;
    vehicleDetails?: string;
    notes?: string;
    status: 'ACTIVE' | 'FULL' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
    // Calculated field for matching
    distanceFromPickup?: number; // km from passenger's pickup
}

export interface BookingRequest {
    id: number;
    rideId: number;
    passenger: {
        id: number;
        username: string;
        avatar?: string;
    };
    pickup: Location;
    dropoff: Location;
    phoneNumber: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
    createdAt: string;
}

export interface CreateRidePayload {
    sourceLatitude: number;
    sourceLongitude: number;
    sourceAddress: string;
    destinationLatitude: number;
    destinationLongitude: number;
    destinationAddress: string;
    departureTime: string;
    availableSeats: number;
    vehicleDetails?: string;
    notes?: string;
}

export interface CreateBookingPayload {
    rideId: number;
    pickupLatitude: number;
    pickupLongitude: number;
    pickupAddress: string;
    dropoffLatitude: number;
    dropoffLongitude: number;
    dropoffAddress: string;
    phoneNumber: string;
}
```

---

## API Endpoints

### Rides

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/carpool/rides` | Create a new ride | ✅ |
| `GET` | `/carpool/rides/recent` | Get rides from last 10 minutes | ✅ |
| `GET` | `/carpool/rides/matching` | Get rides matching passenger's route | ✅ |
| `GET` | `/carpool/rides/my-rides` | Get current user's posted rides | ✅ |
| `GET` | `/carpool/rides/{id}` | Get ride details | ✅ |
| `PATCH` | `/carpool/rides/{id}/status` | Update ride status | ✅ |
| `DELETE` | `/carpool/rides/{id}` | Cancel/delete a ride | ✅ |

### Bookings

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/carpool/bookings` | Create a booking request | ✅ |
| `GET` | `/carpool/bookings/ride/{rideId}` | Get all bookings for a ride (driver only) | ✅ |
| `GET` | `/carpool/bookings/my-bookings` | Get current user's booking requests | ✅ |
| `PATCH` | `/carpool/bookings/{id}/status` | Accept/Reject booking (driver) | ✅ |

### Query Parameters for Matching
```
GET /carpool/rides/matching?
    pickupLat=31.5204&
    pickupLng=74.3587&
    dropoffLat=31.4504&
    dropoffLng=74.3914&
    radiusKm=3
```

---

## Frontend Implementation

### 1. Zustand Store (`carpoolStore.ts`)

```typescript
import { create } from 'zustand';
import { Location, Ride, BookingRequest } from '@/types/carpool.types';

interface CarpoolState {
    // Ride posting state
    rideSource: Location | null;
    rideDestination: Location | null;
    setRideSource: (location: Location | null) => void;
    setRideDestination: (location: Location | null) => void;
    clearRideForm: () => void;

    // Booking state
    pickupLocation: Location | null;
    dropoffLocation: Location | null;
    setPickupLocation: (location: Location | null) => void;
    setDropoffLocation: (location: Location | null) => void;
    clearBookingForm: () => void;

    // Selected ride for details
    selectedRide: Ride | null;
    setSelectedRide: (ride: Ride | null) => void;

    // Pending bookings for driver notifications
    pendingBookingsCount: number;
    setPendingBookingsCount: (count: number) => void;
}

export const useCarpoolStore = create<CarpoolState>((set) => ({
    // Ride posting
    rideSource: null,
    rideDestination: null,
    setRideSource: (location) => set({ rideSource: location }),
    setRideDestination: (location) => set({ rideDestination: location }),
    clearRideForm: () => set({ rideSource: null, rideDestination: null }),

    // Booking
    pickupLocation: null,
    dropoffLocation: null,
    setPickupLocation: (location) => set({ pickupLocation: location }),
    setDropoffLocation: (location) => set({ dropoffLocation: location }),
    clearBookingForm: () => set({ pickupLocation: null, dropoffLocation: null }),

    // Selected ride
    selectedRide: null,
    setSelectedRide: (ride) => set({ selectedRide: ride }),

    // Notifications
    pendingBookingsCount: 0,
    setPendingBookingsCount: (count) => set({ pendingBookingsCount: count }),
}));
```

### 2. API Service (`carpool.api.ts`)

```typescript
import api from '@/src/services/index';
import { Ride, BookingRequest, CreateRidePayload, CreateBookingPayload } from '@/types/carpool.types';

// ========== RIDES ==========

export const postRideApi = async (payload: CreateRidePayload): Promise<Ride> => {
    const res = await api.post<Ride>('/carpool/rides', payload);
    return res.data;
};

export const getRecentRidesApi = async (): Promise<Ride[]> => {
    const res = await api.get<Ride[]>('/carpool/rides/recent');
    return res.data;
};

export const getMatchingRidesApi = async (params: {
    pickupLat: number;
    pickupLng: number;
    dropoffLat: number;
    dropoffLng: number;
    radiusKm?: number;
}): Promise<Ride[]> => {
    const res = await api.get<Ride[]>('/carpool/rides/matching', { params });
    return res.data;
};

export const getMyRidesApi = async (): Promise<Ride[]> => {
    const res = await api.get<Ride[]>('/carpool/rides/my-rides');
    return res.data;
};

export const getRideDetailsApi = async (rideId: number): Promise<Ride> => {
    const res = await api.get<Ride>(`/carpool/rides/${rideId}`);
    return res.data;
};

export const updateRideStatusApi = async (rideId: number, status: string): Promise<void> => {
    await api.patch(`/carpool/rides/${rideId}/status`, { status });
};

// ========== BOOKINGS ==========

export const createBookingApi = async (payload: CreateBookingPayload): Promise<BookingRequest> => {
    const res = await api.post<BookingRequest>('/carpool/bookings', payload);
    return res.data;
};

export const getRideBookingsApi = async (rideId: number): Promise<BookingRequest[]> => {
    const res = await api.get<BookingRequest[]>(`/carpool/bookings/ride/${rideId}`);
    return res.data;
};

export const getMyBookingsApi = async (): Promise<BookingRequest[]> => {
    const res = await api.get<BookingRequest[]>('/carpool/bookings/my-bookings');
    return res.data;
};

export const updateBookingStatusApi = async (
    bookingId: number, 
    status: 'ACCEPTED' | 'REJECTED'
): Promise<void> => {
    await api.patch(`/carpool/bookings/${bookingId}/status`, { status });
};
```

### 3. React Query Hooks (`carpool.queries.ts`)

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    postRideApi,
    getRecentRidesApi,
    getMatchingRidesApi,
    getMyRidesApi,
    getRideDetailsApi,
    createBookingApi,
    getRideBookingsApi,
    updateBookingStatusApi,
} from '@/src/services/carpool.api';

// ========== RIDE QUERIES ==========

export const usePostRide = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: postRideApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rides'] });
            queryClient.invalidateQueries({ queryKey: ['myRides'] });
        },
    });
};

export const useRecentRides = () => {
    return useQuery({
        queryKey: ['rides', 'recent'],
        queryFn: getRecentRidesApi,
        refetchInterval: 30000, // Poll every 30 seconds
        staleTime: 10000,
    });
};

export const useMatchingRides = (params: {
    pickupLat: number;
    pickupLng: number;
    dropoffLat: number;
    dropoffLng: number;
    radiusKm?: number;
}) => {
    return useQuery({
        queryKey: ['rides', 'matching', params],
        queryFn: () => getMatchingRidesApi(params),
        enabled: Boolean(params.pickupLat && params.dropoffLat),
        refetchInterval: 30000,
    });
};

export const useMyRides = () => {
    return useQuery({
        queryKey: ['myRides'],
        queryFn: getMyRidesApi,
        refetchInterval: 15000, // More frequent for driver's own rides
    });
};

export const useRideDetails = (rideId: number) => {
    return useQuery({
        queryKey: ['ride', rideId],
        queryFn: () => getRideDetailsApi(rideId),
        enabled: Boolean(rideId),
    });
};

// ========== BOOKING QUERIES ==========

export const useCreateBooking = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBookingApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        },
    });
};

export const useRideBookings = (rideId: number) => {
    return useQuery({
        queryKey: ['bookings', 'ride', rideId],
        queryFn: () => getRideBookingsApi(rideId),
        enabled: Boolean(rideId),
        refetchInterval: 10000, // Poll frequently for new booking requests
    });
};

export const useUpdateBookingStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ bookingId, status }: { bookingId: number; status: 'ACCEPTED' | 'REJECTED' }) =>
            updateBookingStatusApi(bookingId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['myRides'] });
        },
    });
};
```

### 4. Screen Implementations

#### PostRide.tsx (Driver Screen)
```
┌─────────────────────────────────────┐
│         Post a Ride                 │
├─────────────────────────────────────┤
│  📍 From: [Google Places Input]     │
│                                     │
│  📍 To:   [Google Places Input]     │
│                                     │
│  🕐 Departure: [DateTime Picker]    │
│                                     │
│  💺 Seats:  [- 2 +]                 │
│                                     │
│  🚗 Vehicle: [Text Input]           │
│     (e.g., White Civic ABC-123)     │
│                                     │
│  📝 Notes: [Optional Text]          │
│                                     │
│  ┌─────────────────────────────┐    │
│  │      POST RIDE              │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

#### BookRide.tsx (Passenger Screen)
```
┌─────────────────────────────────────┐
│            [MAP VIEW]               │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  ══════════ Bottom Sheet ══════════ │
│                                     │
│  📍 Pickup: [Google Places Input]   │
│                                     │
│  📍 Dropoff: [Google Places Input]  │
│                                     │
│  📱 Phone: [+92 xxx xxxxxxx]        │
│                                     │
│  ┌─────────────────────────────┐    │
│  │     FIND RIDES              │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

#### RidesList.tsx (Results Screen)
```
┌─────────────────────────────────────┐
│  Available Rides (last 10 min)      │
│  ↻ Refreshes automatically          │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 👤 Ahmed Khan                   │ │
│ │ 📍 Gulberg → Model Town         │ │
│ │ 🕐 2:30 PM • 💺 3 seats         │ │
│ │ 🚗 White Civic                  │ │
│ │ 📏 1.2 km from your pickup      │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 👤 Sara Ali                     │ │
│ │ 📍 DHA → Johar Town             │ │
│ │ 🕐 2:45 PM • 💺 2 seats         │ │
│ │ 🚗 Black Corolla                │ │
│ │ 📏 0.8 km from your pickup      │ │
│ └─────────────────────────────────┘ │
│                                     │
│        [Pull to refresh]            │
└─────────────────────────────────────┘
```

#### RideDetails.tsx (Detail + Booking)
```
┌─────────────────────────────────────┐
│            [MAP VIEW]               │
│    [Route Polyline Shown]           │
│   🔵 Driver Source                  │
│   🔴 Driver Destination             │
│   🟢 Your Pickup (if booking)       │
├─────────────────────────────────────┤
│  Driver: Ahmed Khan ⭐ 4.8          │
│  📱 +92 300 1234567                 │
│                                     │
│  From: Gulberg III, Lahore          │
│  To: Model Town, Lahore             │
│                                     │
│  🕐 Departure: 2:30 PM              │
│  💺 Available: 3 seats              │
│  🚗 White Honda Civic - LEA-1234    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │     REQUEST BOOKING         │    │
│  └─────────────────────────────┘    │
│                                     │
│  OR (if driver's own ride):         │
│  ┌─────────────────────────────┐    │
│  │  📋 View Booking Requests   │    │
│  │     (3 pending)             │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

---

## Matching Algorithm

### Haversine Distance Formula

Used to calculate distance between two GPS coordinates:

```java
public class GeoUtils {
    private static final double EARTH_RADIUS_KM = 6371.0;

    public static double haversineDistance(
            double lat1, double lon1, 
            double lat2, double lon2) {
        
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * 
                   Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return EARTH_RADIUS_KM * c;
    }
}
```

### Matching Logic

A ride is considered a **match** if:
1. **Driver's source is within X km** of passenger's pickup
2. **Driver's destination is within X km** of passenger's dropoff
3. **Departure time** is in the future
4. **Seats are available**

```java
public List<Ride> findMatchingRides(
        double pickupLat, double pickupLng,
        double dropoffLat, double dropoffLng,
        double radiusKm) {
    
    return rideRepository.findActiveRides().stream()
        .filter(ride -> {
            double pickupDistance = GeoUtils.haversineDistance(
                ride.getSourceLatitude(), ride.getSourceLongitude(),
                pickupLat, pickupLng
            );
            double dropoffDistance = GeoUtils.haversineDistance(
                ride.getDestinationLatitude(), ride.getDestinationLongitude(),
                dropoffLat, dropoffLng
            );
            
            return pickupDistance <= radiusKm && 
                   dropoffDistance <= radiusKm &&
                   ride.getDepartureTime().isAfter(LocalDateTime.now()) &&
                   ride.getAvailableSeats() > 0;
        })
        .sorted(Comparator.comparingDouble(ride -> 
            GeoUtils.haversineDistance(
                ride.getSourceLatitude(), ride.getSourceLongitude(),
                pickupLat, pickupLng
            )
        ))
        .collect(Collectors.toList());
}
```

---

## Notification System

### How Does the Driver Know Their Ride is Booked?

#### Option 1: Polling (Simple - Recommended for MVP)

The driver's app polls the server every 10-15 seconds to check for new booking requests:

```typescript
// In RideDetails.tsx or a global hook
const { data: bookings } = useRideBookings(rideId, {
    refetchInterval: 10000, // Every 10 seconds
});

// Show badge/notification when new pending bookings exist
useEffect(() => {
    const pendingCount = bookings?.filter(b => b.status === 'PENDING').length || 0;
    if (pendingCount > 0) {
        // Show in-app notification or badge
        Toast.show({
            type: 'info',
            text1: '🔔 New Booking Request!',
            text2: `You have ${pendingCount} pending request(s)`,
        });
    }
}, [bookings]);
```

#### Option 2: Push Notifications (Better UX)

When a booking is created, the backend sends a push notification to the driver:

```java
// In CarpoolService.java
public BookingRequest createBooking(CreateBookingDTO dto) {
    BookingRequest booking = // ... create booking
    
    // Send push notification to driver
    Ride ride = booking.getRide();
    User driver = ride.getDriver();
    
    pushNotificationService.sendToUser(
        driver.getId(),
        "New Booking Request",
        "Someone wants to join your ride to " + ride.getDestinationAddress(),
        Map.of("type", "BOOKING_REQUEST", "rideId", ride.getId())
    );
    
    return booking;
}
```

#### Option 3: WebSocket (Real-time)

For real-time updates without constant polling:

```typescript
// Using Socket.io or similar
useEffect(() => {
    const socket = io(API_URL);
    
    socket.on(`ride:${rideId}:booking`, (booking) => {
        queryClient.invalidateQueries(['bookings', 'ride', rideId]);
        Toast.show({
            type: 'success',
            text1: '🚗 New booking request!',
        });
    });
    
    return () => socket.disconnect();
}, [rideId]);
```

### Driver's View: Managing Booking Requests

Add a section in `RideDetails.tsx` for drivers to see and manage bookings:

```
┌─────────────────────────────────────┐
│  📋 Booking Requests (3)            │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 👤 Ali Hassan                   │ │
│ │ 📍 Pickup: Liberty Market       │ │
│ │ 📱 +92 301 2345678              │ │
│ │                                 │ │
│ │ [✓ Accept]     [✗ Reject]       │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 👤 Fatima Zahra                 │ │
│ │ 📍 Pickup: Main Boulevard       │ │
│ │ 📱 +92 333 9876543              │ │
│ │                                 │ │
│ │ [✓ Accept]     [✗ Reject]       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## Implementation Order

### Phase 1: Backend Foundation (Day 1-2)
1. ✅ Create entity classes (`Ride`, `BookingRequest`, enums)
2. ✅ Create DTOs for request/response
3. ✅ Create repositories with custom queries
4. ✅ Implement `CarpoolService` with business logic
5. ✅ Implement `CarpoolController` with endpoints
6. ✅ Add matching algorithm utility

### Phase 2: Frontend Services (Day 2-3)
1. ✅ Create TypeScript types
2. ✅ Create `carpool.api.ts` with API calls
3. ✅ Create `carpool.queries.ts` with React Query hooks
4. ✅ Create `carpoolStore.ts` for local state

### Phase 3: PostRide Screen (Day 3-4)
1. ✅ Add form with GoogleTextInput for source/destination
2. ✅ Add DateTimePicker for departure
3. ✅ Add seats counter and vehicle input
4. ✅ Implement form submission
5. ✅ Navigate to RidesList on success

### Phase 4: BookRide Screen (Day 4-5)
1. ✅ Enhance BottomSheet with form fields
2. ✅ Add GoogleTextInput for pickup/dropoff
3. ✅ Add phone number input
4. ✅ Implement form submission
5. ✅ Navigate to RidesList with matching params

### Phase 5: RidesList Screen (Day 5-6)
1. ✅ Create RideCard component
2. ✅ Implement FlatList with rides
3. ✅ Add pull-to-refresh
4. ✅ Add automatic polling
5. ✅ Add empty state and loading states
6. ✅ Navigate to RideDetails on card press

### Phase 6: RideDetails Screen (Day 6-7)
1. ✅ Display ride info with map
2. ✅ Add route polyline on map
3. ✅ Implement "Request Booking" for passengers
4. ✅ Show booking status if already requested
5. ✅ For drivers: Show booking requests list
6. ✅ Implement Accept/Reject functionality

### Phase 7: Notifications & Polish (Day 7-8)
1. ✅ Add polling for booking updates
2. ✅ Add Toast notifications for new bookings
3. ✅ Add badge on CarpoolHome for pending bookings
4. ✅ Add error handling and loading states
5. ✅ Test all flows end-to-end

---

## File Structure After Implementation

```
apps/mobile/src/
├── components/
│   └── screens/
│       └── carpool/
│           ├── BookRide.tsx       # Passenger booking form
│           ├── CarpoolHome.tsx    # Main carpool screen
│           ├── PostRide.tsx       # Driver ride posting form
│           ├── RideDetails.tsx    # Ride info + booking actions
│           ├── RidesList.tsx      # List of available rides
│           └── components/        # Reusable carpool components
│               ├── RideCard.tsx
│               ├── BookingRequestCard.tsx
│               └── RouteMap.tsx
├── services/
│   └── carpool.api.ts             # API calls
├── queries/
│   └── carpool.queries.ts         # React Query hooks
├── stores/
│   └── carpoolStore.ts            # Zustand state
└── types/
    └── carpool.types.ts           # TypeScript interfaces

apps/api/src/main/java/com/majestor/api/modules/carpool/
├── CarpoolController.java
├── CarpoolService.java
├── CarpoolRepository.java
├── BookingRepository.java
├── dto/
│   ├── CreateRideDTO.java
│   ├── RideResponseDTO.java
│   ├── CreateBookingDTO.java
│   └── BookingResponseDTO.java
├── entity/
│   ├── Ride.java
│   └── BookingRequest.java
├── enums/
│   ├── RideStatus.java
│   └── BookingStatus.java
└── utils/
    └── GeoUtils.java
```

---

## Summary

| Feature | Responsibility |
|---------|----------------|
| **Post Ride** | Driver enters route, time, seats → Creates ride in DB |
| **Book Ride** | Passenger enters route, phone → Redirected to matching rides |
| **Match Rides** | Backend uses Haversine to find rides within radius |
| **Request Booking** | Passenger selects ride → Creates BookingRequest |
| **Driver Notification** | Polling every 10s OR push notification |
| **Accept/Reject** | Driver updates BookingRequest status |
| **10-min Window** | Query filters rides by `createdAt > now - 10 minutes` |

---

## Questions to Consider

1. **Radius**: What should be the default matching radius? (Suggested: 2-3 km)
2. **Seats**: Should we auto-decrement seats when booking is accepted?
3. **Cancellation**: What happens if driver cancels? Notify all accepted passengers?
4. **Rating**: Do you want to add a rating system after ride completion?
5. **Payment**: Any payment/fare splitting feature planned?
