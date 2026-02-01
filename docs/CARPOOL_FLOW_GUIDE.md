# Carpool Feature - Complete Implementation Guide

> **Note**: This is a carpooling app for students/commuters to share rides – NOT a taxi/ride-hailing service.

📐 **See also**: [Screen Prototypes & Wireframes](./CARPOOL_SCREEN_PROTOTYPES.md) for ASCII mockups of all screens.

---

## System Overview

There are **two main entities** in the system:

| Entity | Role | Description |
|--------|------|-------------|
| **Poster** | Driver/Ride Provider | Person who is already traveling somewhere and offers to take passengers along |
| **Booker** | Passenger/Rider | Person who wants to find a ride going their way |

---

## Complete User Flows

### Flow 1: Poster (Ride Poster) Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           POSTER FLOW                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐              │
│   │   Carpool    │      │   Post Ride  │      │   Booking    │              │
│   │    Home      │ ──▶  │    Screen    │ ──▶  │   Requests   │              │
│   │              │      │              │      │    Screen    │              │
│   │ [Post Ride]  │      │ - Pickup     │      │              │              │
│   │ [Book Ride]  │      │ - Dropoff    │      │ Waiting for  │              │
│   └──────────────┘      │ - Vehicle    │      │ bookings...  │              │
│                         │ - Seats      │      │              │              │
│                         │ - Phone      │      │ [Request 1]  │              │
│                         │              │      │ [Request 2]  │              │
│                         │ [POST RIDE]  │      │    ...       │              │
│                         └──────────────┘      └──────┬───────┘              │
│                                                      │                       │
│                                                      │ Click on a request    │
│                                                      ▼                       │
│                                               ┌──────────────┐              │
│                                               │   Booking    │              │
│                                               │   Details    │              │
│                                               │              │              │
│                                               │ Booker info  │              │
│                                               │ Route + Map  │              │
│                                               │ Deviation    │              │
│                                               │              │              │
│                                               │ [✓ ACCEPT]   │              │
│                                               │ [✗ REJECT]   │              │
│                                               │              │              │
│                                               │ After Accept:│              │
│                                               │ [📞 CONTACT] │              │
│                                               └──────────────┘              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Step-by-Step:**

1. Poster opens the app → lands on **Carpool Home** screen
2. Clicks **"Post Ride"** button
3. Navigated to **Post Ride Screen** where they enter:
   - 📍 **Pickup Location** (where they're starting from)
   - 📍 **Destination Location** (where they're going)
   - 🚗 **Vehicle Type** (Car / Bike)
   - 📝 **Vehicle Model** (e.g., "White Honda Civic")
   - 👥 **Available Seats** (how many passengers they can take)
   - 📱 **Phone Number** (for contact)
   - 📝 **Additional Notes** (optional)
4. Clicks **"Post Ride"** → Ride is uploaded to the system
5. Poster is **immediately redirected to Booking Requests Screen** where they:
   - Wait for incoming booking requests (with auto-refresh/polling)
   - See a list of Bookers who want to join their ride
6. Poster clicks on a booking request → **Booking Details Screen** opens showing:
   - Booker's name, phone, and avatar
   - Booker's pickup and dropoff on a map
   - Deviation distance calculated
   - **Accept** / **Reject** buttons
7. After accepting → Contact options appear (Call, WhatsApp, etc.)

---

### Flow 2: Booker (Ride Booker) Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BOOKER FLOW                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐              │
│   │   Carpool    │      │  Book Ride   │      │  Available   │              │
│   │    Home      │ ──▶  │   Screen     │ ──▶  │    Rides     │              │
│   │              │      │              │      │              │              │
│   │ [Post Ride]  │      │ - Pickup     │      │ List of all  │              │
│   │ [Book Ride]  │      │ - Dropoff    │      │ posted rides │              │
│   └──────────────┘      │ - Passengers │      │              │              │
│                         │ - Phone      │      │ [Ride Card]  │              │
│                         │              │      │ [Ride Card]  │              │
│                         │ [FIND RIDES] │      │ [Ride Card]  │              │
│                         └──────────────┘      └──────┬───────┘              │
│                                                      │                       │
│                                                      │ Click on a ride       │
│                                                      ▼                       │
│                                               ┌──────────────┐              │
│                                               │  Ride Detail │              │
│                                               │    Modal     │              │
│                                               │              │              │
│                                               │ [MAP VIEW]   │              │
│                                               │ - Poster's   │              │
│                                               │   route      │              │
│                                               │ - Booker's   │              │
│                                               │   pickup     │              │
│                                               │ - Deviation  │              │
│                                               │   distance   │              │
│                                               │              │              │
│                                               │ [BOOK THIS]  │              │
│                                               └──────────────┘              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Step-by-Step:**

1. Booker opens the app → lands on **Carpool Home** screen
2. Clicks **"Book Ride"** button
3. Navigated to **Book Ride Screen** where they enter:
   - 📍 **Pickup Location** (where they need to be picked up)
   - 📍 **Destination Location** (where they want to go)
   - 👥 **Number of Passengers** (how many people)
   - 📱 **Phone Number** (for contact)
   - 📝 **Personal Info** (as required)
4. Clicks **"Find Rides"** → Booking request is saved
5. Booker is redirected to **Available Rides** screen showing list of posted rides
6. Booker clicks on a ride → **Ride Detail Modal** opens

---

### Flow 3: Ride Detail Modal (Map View)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        RIDE DETAIL MODAL                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                                                                      │   │
│   │                         MAP VIEW                                     │   │
│   │                                                                      │   │
│   │     🔵 ─────────────────────────────────────────────── 🔴            │   │
│   │     Poster's                                          Poster's       │   │
│   │     Start                                             End            │   │
│   │                                                                      │   │
│   │              🟢                        🟠                            │   │
│   │              Booker's                  Booker's                      │   │
│   │              Pickup                    Dropoff                       │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  📊 Deviation Calculation                                            │   │
│   │                                                                      │   │
│   │  Poster's original route:     15.2 km                               │   │
│   │  Route with pickup/dropoff:   18.7 km                               │   │
│   │  ─────────────────────────────────────                              │   │
│   │  Extra distance (deviation):  +3.5 km                               │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                                                                      │   │
│   │                      [ 🚗 BOOK THIS RIDE ]                          │   │
│   │                                                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**What the Modal Shows:**

1. **Map with 4 markers:**
   - 🔵 Poster's Source (where driver is starting)
   - 🔴 Poster's Destination (where driver is going)
   - 🟢 Booker's Pickup (where passenger needs pickup)
   - 🟠 Booker's Dropoff (where passenger wants to go)

2. **Deviation Calculation:**
   - How many kilometers the Poster has to deviate from their original route
   - This is calculated as: `(Route with pickup & dropoff) - (Original direct route)`

3. **Book This Ride Button** - To confirm the booking

---

## What Happens After Booking? (Complete Flow)

This is the interaction between Booker and Poster after ride is posted:

### After Booker Clicks "Book This Ride"

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    POST-BOOKING FLOW                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   BOOKER SIDE                          POSTER SIDE                          │
│   ───────────                          ───────────                          │
│                                                                              │
│   Clicks "Book This Ride"              (Already on Booking Requests Screen) │
│          │                                        │                          │
│          ▼                                        ▼                          │
│   ┌──────────────┐                     ┌──────────────┐                     │
│   │   Booking    │    Real-time        │   Booking    │                     │
│   │   Pending    │ ──────────────────▶ │   Requests   │                     │
│   │              │                     │              │                     │
│   │ "Waiting for │                     │ 🔔 New       │                     │
│   │  driver to   │                     │ request      │                     │
│   │  accept"     │                     │ appears!     │                     │
│   │              │                     │              │                     │
│   │  [View       │                     │ [Request 1]◀─┼── NEW               │
│   │   Status]    │                     │ [Request 2]  │                     │
│   └──────────────┘                     └──────┬───────┘                     │
│          │                                    │                              │
│          │                                    │ Poster clicks request        │
│          │                                    ▼                              │
│          │                             ┌──────────────┐                     │
│          │                             │   Booking    │                     │
│          │                             │   Details    │                     │
│          │                             │              │                     │
│          │                             │ 👤 Ali Khan  │                     │
│          │                             │ 📍 Pickup:   │                     │
│          │                             │   Gulberg    │                     │
│          │                             │ 📍 Dropoff:  │                     │
│          │                             │   Model Town │                     │
│          │                             │ 📏 +2.3 km   │                     │
│          │                             │   deviation  │                     │
│          │                             │              │                     │
│          │                             │ [✓ ACCEPT]   │                     │
│          │                             │ [✗ REJECT]   │                     │
│          │                             └──────┬───────┘                     │
│          │                                    │                              │
│          │         ◀──────────────────────────┘ Poster accepts               │
│          │         Notification                                              │
│          ▼                                    ▼                              │
│   ┌──────────────┐                     ┌──────────────┐                     │
│   │   Booking    │                     │   Booking    │                     │
│   │  Confirmed!  │                     │   Accepted   │                     │
│   │              │                     │              │                     │
│   │ Driver Info: │                     │ Booker Info: │                     │
│   │ - Ahmed      │                     │ - Ali Khan   │                     │
│   │ - +92 300... │                     │ - +92 333... │                     │
│   │ - Civic      │                     │              │                     │
│   │              │                     │ ┌──────────┐ │                     │
│   │ [📞 CALL]    │                     │ │ 📞 CALL  │ │                     │
│   │ [💬 WHATSAPP]│                     │ │💬WHATSAPP│ │                     │
│   └──────────────┘                     │ └──────────┘ │                     │
│                                        └──────────────┘                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Detailed Steps:

#### For Poster (After Posting Ride):
1. After posting ride, Poster lands on **Booking Requests Screen**
2. Screen shows "Waiting for booking requests..." initially
3. As Bookers request this ride, requests appear in real-time (polling every 10-15 seconds)
4. Each request card shows: Booker name, pickup location, deviation distance
5. Poster clicks on a request → **Booking Details Screen** opens
6. Booking Details shows:
   - Full booker information (name, phone, avatar)
   - Map with Poster's route + Booker's pickup/dropoff
   - Calculated deviation distance
   - **Accept** and **Reject** buttons
7. If Poster clicks **Accept**:
   - Booking status changes to "Accepted"
   - Contact options appear: Call button, WhatsApp button
   - Available seats decrease by passenger count
8. If Poster clicks **Reject**:
   - Booker is notified and can try other rides

#### For Booker (After Clicking "Book This Ride"):
1. Booking request is sent to the server
2. Booker sees a **"Booking Pending"** status with option to cancel
3. Booker waits for the Poster to accept/reject
4. When Poster accepts → Booker gets notification with driver details + contact options
5. When Poster rejects → Booker gets notification and can try another ride


---

## Screens You Need to Build

| # | Screen Name | Purpose | For | Status |
|---|-------------|---------|-----|--------|
| 1 | `CarpoolHome` | Main screen with "Post Ride" and "Book Ride" buttons | Both | ✅ Exists |
| 2 | `PostRide` | Form for Poster to enter ride details | Poster | 🔨 Needs implementation |
| 3 | `BookingRequests` | List of incoming booking requests (Poster waits here) | Poster | 🔨 New - needs creation |
| 4 | `BookingDetails` | View booker info, map, deviation + Accept/Reject | Poster | 🔨 New - needs creation |
| 5 | `BookRide` | Form for Booker to enter their requirements | Booker | 🔨 Needs implementation |
| 6 | `RidesList` (Available Rides) | List of all posted rides | Booker | 🔨 Needs implementation |
| 7 | `RideDetailModal` | Map modal showing routes and deviation + Book button | Booker | 🔨 New - needs creation |
| 8 | `BookingStatus` | Booker's view of their pending/confirmed booking | Booker | 🔨 New - needs creation |

### Screen Flow Summary:

```
POSTER FLOW:
CarpoolHome → PostRide → BookingRequests → BookingDetails (Accept/Reject → Contact)

BOOKER FLOW:
CarpoolHome → BookRide → RidesList → RideDetailModal → BookingStatus (Pending → Confirmed)
```

---

## Deviation Calculation Algorithm

The deviation is calculated as follows:

```
Original Route = Distance from Poster's Source → Poster's Destination

New Route = Distance from:
  Poster's Source → Booker's Pickup → Booker's Dropoff → Poster's Destination

Deviation = New Route - Original Route
```

### Using Google Maps Directions API:

```typescript
// Calculate deviation distance
const calculateDeviation = async (
  posterSource: Location,
  posterDestination: Location,
  bookerPickup: Location,
  bookerDropoff: Location
): Promise<number> => {
  
  // 1. Calculate original route (Poster only)
  const originalRoute = await getRouteDistance(
    posterSource, 
    posterDestination
  );
  
  // 2. Calculate new route (with Booker pickup/dropoff)
  const newRoute = await getRouteDistance(
    posterSource,
    posterDestination,
    [bookerPickup, bookerDropoff] // waypoints
  );
  
  // 3. Deviation = difference
  const deviationKm = newRoute - originalRoute;
  
  return deviationKm;
};
```

---

## Data Models

### Ride (Posted by Poster)
```typescript
interface Ride {
  id: string;
  
  // Poster info
  posterId: number;
  posterName: string;
  posterPhone: string;
  posterAvatar?: string;
  
  // Route
  source: {
    latitude: number;
    longitude: number;
    address: string;
  };
  destination: {
    latitude: number;
    longitude: number;
    address: string;
  };
  
  // Vehicle
  vehicleType: 'car' | 'bike';
  vehicleModel: string;
  availableSeats: number;
  
  // Meta
  notes?: string;
  status: 'active' | 'full' | 'completed' | 'cancelled';
  createdAt: string;
  expiresAt: string; // Rides expire after X minutes
}
```

### BookingRequest (Created by Booker)
```typescript
interface BookingRequest {
  id: string;
  
  // Booker info
  bookerId: number;
  bookerName: string;
  bookerPhone: string;
  
  // Booker's route
  pickup: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dropoff: {
    latitude: number;
    longitude: number;
    address: string;
  };
  
  // Request details
  passengers: number;
  rideId: string; // The ride they're booking
  
  // Calculated
  deviationKm: number;
  
  // Status
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  createdAt: string;
}
```

---

## API Endpoints Needed

### Rides
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/carpool/rides` | Poster creates a new ride |
| `GET` | `/carpool/rides` | Get all active rides (for Available Rides screen) |
| `GET` | `/carpool/rides/my` | Get Poster's own rides |
| `PATCH` | `/carpool/rides/:id` | Update ride (e.g., mark as full) |
| `DELETE` | `/carpool/rides/:id` | Cancel/delete a ride |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/carpool/bookings` | Booker creates booking request |
| `GET` | `/carpool/bookings/ride/:rideId` | Get all bookings for a specific ride (for Poster) |
| `GET` | `/carpool/bookings/my` | Get Booker's own booking requests |
| `PATCH` | `/carpool/bookings/:id/accept` | Poster accepts booking |
| `PATCH` | `/carpool/bookings/:id/reject` | Poster rejects booking |

---

## Implementation Order (Recommended)

### Phase 1: Core Screens (Week 1)
1. ✅ `PostRide.tsx` - Form for posting rides
2. ✅ `BookRide.tsx` - Form for booking request
3. ✅ `RidesList.tsx` - Available rides listing

### Phase 2: Interaction (Week 2)
4. ✅ `RideDetailModal.tsx` - Map modal with deviation
5. ✅ Backend APIs for rides and bookings
6. ✅ Connect frontend to backend

### Phase 3: Acceptance Flow (Week 3)
7. ✅ `MyRides.tsx` - Poster's ride management
8. ✅ Booking request cards with Accept/Reject
9. ✅ `BookingStatus.tsx` - Booker's booking status
10. ✅ Notifications (polling or push)

### Phase 4: Polish (Week 4)
11. ✅ Error handling
12. ✅ Loading states
13. ✅ Empty states
14. ✅ Ride expiration logic
15. ✅ Testing all flows

---

## Questions to Finalize

Before implementation, consider these:

1. **Ride Expiration**: How long should a posted ride remain active? (e.g., 30 minutes? 1 hour?)

2. **Matching**: Should we only show rides that are "on the way" for the booker, or show all rides?

3. **Maximum Deviation**: Should there be a limit on how much deviation is acceptable? (e.g., max 5km)

4. **Multiple Bookings**: Can a Poster accept multiple Bookers for the same ride?

5. **Cancellation**: What happens if Poster cancels after Booker is confirmed?

6. **Cost/Fare**: Is there any fare calculation based on deviation? Or is it free carpooling?

---

## Summary

| Role | Flow |
|------|------|
| **Poster** | Post Ride → Wait on Booking Requests screen → Click request → View details + Accept/Reject → Contact Booker |
| **Booker** | Enter requirements → Browse Available Rides → View ride on map → Book → Wait for acceptance → Get driver contact |

### Why This Flow Works Well:

1. **Poster stays engaged**: After posting, they immediately land on a screen waiting for bookings - no need to navigate elsewhere
2. **Clear decision making**: Poster sees all booking details (map, deviation, booker info) before accepting
3. **Contact only after acceptance**: Phone numbers are revealed only after both parties agree
4. **Deviation transparency**: Both parties see exactly how much extra the Poster needs to drive

The key differentiator of your app is the **deviation calculation** - showing the Poster exactly how much extra distance they need to travel to accommodate the Booker. This transparency helps Posters make informed decisions about accepting bookings.
