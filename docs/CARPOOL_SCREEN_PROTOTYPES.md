# Carpool Feature - Screen Prototypes & Wireframes

> ASCII mockups for all carpool screens. Use these as inspiration for Figma designs.

---

## Table of Contents

1. [Carpool Home (Existing)](#1-carpool-home)
2. [Post Ride Screen](#2-post-ride-screen)
3. [Booking Requests Screen](#3-booking-requests-screen)
4. [Booking Details Screen](#4-booking-details-screen)
5. [Book Ride Screen](#5-book-ride-screen)
6. [Available Rides List](#6-available-rides-list)
7. [Ride Detail Modal](#7-ride-detail-modal)
8. [Booking Status Screen](#8-booking-status-screen)
9. [Components Library](#9-components-library)

---

## 1. Carpool Home

> **Status**: ✅ Already exists  
> **File**: `CarpoolHome.tsx`  
> **Purpose**: Main entry point with map and two action buttons

```
┌─────────────────────────────────────────┐
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │                                   │  │
│  │                                   │  │
│  │           📍                      │  │
│  │         (You)                     │  │
│  │                                   │  │
│  │              MAP VIEW             │  │
│  │                                   │  │
│  │                                   │  │
│  │                                   │  │
│  │                                   │  │
│  │                           ┌────┐  │  │
│  │                           │ 📍 │  │  │  ← My Location Button
│  │                           └────┘  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ╔═══════════════════════════════════╗  │  ← Bottom Sheet
│  ║             ─────                 ║  │    (drag handle)
│  ║                                   ║  │
│  ║  ┌─────────────────────────────┐  ║  │
│  ║  │                             │  ║  │
│  ║  │       🚗  Book a Ride       │  ║  │  ← Primary Button
│  ║  │                             │  ║  │    (Gradient: Blue→Teal)
│  ║  └─────────────────────────────┘  ║  │
│  ║                                   ║  │
│  ║  ┌─────────────────────────────┐  ║  │
│  ║  │                             │  ║  │
│  ║  │       📝  Post a Ride       │  ║  │  ← Outline Button
│  ║  │                             │  ║  │
│  ║  └─────────────────────────────┘  ║  │
│  ║                                   ║  │
│  ╚═══════════════════════════════════╝  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 2. Post Ride Screen

> **Status**: 🔨 Needs implementation  
> **File**: `PostRide.tsx`  
> **Purpose**: Poster enters ride details (source, destination, vehicle, seats)

### Version A: Scrollable Form (Recommended)

```
┌─────────────────────────────────────────┐
│  ←  Post Ride                           │  ← Header with back button
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 🔵  Starting Point                │  │  ← Google Places Input
│  │                                   │  │
│  │     Where are you starting from?  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 🔴  Destination                   │  │  ← Google Places Input
│  │                                   │  │
│  │     Where are you going?          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ─────────── Vehicle Info ───────────   │  ← Section Divider
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Vehicle Type                     │  │
│  │                                   │  │
│  │  ┌─────────────┐  ┌─────────────┐ │  │  ← Toggle Buttons
│  │  │   🚗 Car    │  │   🏍️ Bike   │ │  │
│  │  │  (selected) │  │             │ │  │
│  │  └─────────────┘  └─────────────┘ │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 🚙  Vehicle Model                 │  │  ← Text Input
│  │                                   │  │
│  │     e.g., White Honda Civic       │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 👥  Available Seats               │  │
│  │                                   │  │
│  │   ┌─────┐                         │  │  ← Number Stepper
│  │   │  -  │    3    │  +  │         │  │
│  │   └─────┘         └─────┘         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 📱  Phone Number                  │  │  ← Phone Input
│  │                                   │  │
│  │     +92 300 1234567               │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 📝  Additional Notes (Optional)   │  │  ← Multiline Text Input
│  │                                   │  │
│  │     Any special instructions...   │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │         🚀  POST RIDE             │  │  ← Primary Button
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│         (Safe area padding)             │
└─────────────────────────────────────────┘
```

### Version B: Map + Bottom Sheet Form

```
┌─────────────────────────────────────────┐
│  ←  Post Ride                           │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │           🔵──────────🔴          │  │  ← Route preview on map
│  │         Start         End         │  │    (updates as user types)
│  │                                   │  │
│  │              MAP VIEW             │  │
│  │                                   │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ╔═══════════════════════════════════╗  │  ← Bottom Sheet (expandable)
│  ║             ─────                 ║  │
│  ║                                   ║  │
│  ║  ┌─────────────────────────────┐  ║  │
│  ║  │ 🔵  From: Select start...   │  ║  │
│  ║  └─────────────────────────────┘  ║  │
│  ║                                   ║  │
│  ║  ┌─────────────────────────────┐  ║  │
│  ║  │ 🔴  To: Select destination  │  ║  │
│  ║  └─────────────────────────────┘  ║  │
│  ║                                   ║  │
│  ║  (Expand ↑ for more options)      ║  │
│  ║                                   ║  │
│  ╚═══════════════════════════════════╝  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 3. Booking Requests Screen

> **Status**: 🔨 New screen needed  
> **File**: `BookingRequests.tsx`  
> **Purpose**: Poster waits here after posting a ride, sees incoming booking requests

### Empty State (No requests yet)

```
┌─────────────────────────────────────────┐
│  ←  Booking Requests                🏠  │  ← Header with home button
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │  ← Your Ride Summary Card
│  │  📍 Your Ride                     │  │
│  │  ─────────────────────────────    │  │
│  │  🔵 Gulberg III, Lahore           │  │
│  │        ↓                          │  │
│  │  🔴 Model Town, Lahore            │  │
│  │                                   │  │
│  │  🚗 White Civic  •  👥 3 seats    │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│                                         │
│                                         │
│              ⏳                         │
│                                         │
│     Waiting for booking requests...     │  ← Empty state
│                                         │
│     Bookers will appear here when       │
│     they request to join your ride      │
│                                         │
│                                         │
│              🔄 Refreshing...           │  ← Auto-refresh indicator
│                                         │
│                                         │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │       ❌  Cancel Ride             │  │  ← Outline Button (Red)
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### With Booking Requests

```
┌─────────────────────────────────────────┐
│  ←  Booking Requests            🏠  🔔  │  ← Notification bell if new
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  📍 Your Ride                     │  │
│  │  ─────────────────────────────    │  │
│  │  🔵 Gulberg III → 🔴 Model Town   │  │
│  │  🚗 White Civic  •  👥 3 seats    │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ───── Booking Requests (3) ─────────   │  ← Section header with count
│                                         │
│  ┌───────────────────────────────────┐  │  ← Request Card #1
│  │  ┌────┐                           │  │
│  │  │ 👤 │  Ali Khan            NEW  │  │  ← Avatar + Name + Badge
│  │  └────┘                           │  │
│  │                                   │  │
│  │  📍 Pickup: Liberty Market        │  │
│  │  📍 Dropoff: Faisal Town          │  │
│  │                                   │  │
│  │  👥 2 passengers                  │  │
│  │  📏 +2.3 km deviation             │  │  ← Deviation distance
│  │                                   │  │
│  │  ──────────────────────────────   │  │
│  │           Tap to view →           │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │  ← Request Card #2
│  │  ┌────┐                           │  │
│  │  │ 👤 │  Sara Ahmed               │  │
│  │  └────┘                           │  │
│  │                                   │  │
│  │  📍 Pickup: DHA Phase 5           │  │
│  │  📍 Dropoff: Johar Town           │  │
│  │                                   │  │
│  │  👥 1 passenger                   │  │
│  │  📏 +4.1 km deviation             │  │
│  │                                   │  │
│  │  ──────────────────────────────   │  │
│  │           Tap to view →           │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │  ← Request Card #3
│  │  ┌────┐                           │  │
│  │  │ 👤 │  Usman Malik              │  │
│  │  └────┘  ...                      │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 4. Booking Details Screen

> **Status**: 🔨 New screen needed  
> **File**: `BookingDetails.tsx`  
> **Purpose**: Poster views full booking details, map with routes, and Accept/Reject

### Before Accepting

```
┌─────────────────────────────────────────┐
│  ←  Booking Details                     │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │     🔵━━━━━━━━━━━━━━━━━━━━━🔴     │  │  ← Poster's route (blue line)
│  │   Start                    End    │  │
│  │           ↘               ↗       │  │
│  │            🟢━━━━━━━━━━🟠         │  │  ← Booker's points (green/orange)
│  │          Pickup      Dropoff      │  │
│  │                                   │  │
│  │              MAP VIEW             │  │
│  │                                   │  │
│  │  Legend:                          │  │
│  │  ── Your route   ── With pickup   │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │  ← Booker Info Card
│  │                                   │  │
│  │  ┌──────┐  Ali Khan               │  │
│  │  │  👤  │                         │  │
│  │  │      │  👥 2 passengers        │  │
│  │  └──────┘                         │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │  ← Route Details
│  │                                   │  │
│  │  🟢 Pickup                        │  │
│  │     Liberty Market, Gulberg       │  │
│  │                                   │  │
│  │  🟠 Dropoff                       │  │
│  │     Faisal Town, Lahore           │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │  ← Deviation Card
│  │  📊 Route Deviation               │  │
│  │  ─────────────────────────────    │  │
│  │                                   │  │
│  │  Your original route:   12.5 km   │  │
│  │  With this pickup:      14.8 km   │  │
│  │  ─────────────────────────────    │  │
│  │  Extra distance:       +2.3 km    │  │  ← Highlighted
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─────────────────┐ ┌─────────────────┐│
│  │                 │ │                 ││
│  │  ✗  REJECT      │ │  ✓  ACCEPT      ││  ← Action Buttons
│  │                 │ │                 ││
│  │   (Outline)     │ │   (Primary)     ││
│  └─────────────────┘ └─────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

### After Accepting (Contact Revealed)

```
┌─────────────────────────────────────────┐
│  ←  Booking Details                     │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │              MAP VIEW             │  │
│  │       (same as before)            │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │              ✓ ACCEPTED           │  │  ← Status Badge (Green)
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │  ← Booker Info (Expanded)
│  │                                   │  │
│  │  ┌──────┐  Ali Khan               │  │
│  │  │  👤  │                         │  │
│  │  │      │  📱 +92 333 1234567     │  │  ← Phone now visible!
│  │  └──────┘                         │  │
│  │                                   │  │
│  │  👥 2 passengers                  │  │
│  │                                   │  │
│  │  🟢 Pickup: Liberty Market        │  │
│  │  🟠 Dropoff: Faisal Town          │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ───────── Contact Booker ───────────   │
│                                         │
│  ┌─────────────────┐ ┌─────────────────┐│
│  │                 │ │                 ││
│  │   📞  CALL      │ │  💬  WHATSAPP   ││  ← Contact Buttons
│  │                 │ │                 ││
│  └─────────────────┘ └─────────────────┘│
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │      🏠  Back to Home             │  │  ← Secondary action
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 5. Book Ride Screen

> **Status**: 🔨 Needs implementation  
> **File**: `BookRide.tsx`  
> **Purpose**: Booker enters their pickup/dropoff details to search for rides

### Version A: Full Screen Form

```
┌─────────────────────────────────────────┐
│  ←  Book a Ride                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │     🎯 Where do you need a ride?  │  │  ← Section Title
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 🟢  Pickup Location               │  │  ← Google Places Input
│  │                                   │  │
│  │     Where should we pick you up?  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 🟠  Drop-off Location             │  │  ← Google Places Input
│  │                                   │  │
│  │     Where are you going?          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ─────────── Your Details ───────────   │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 👥  Number of Passengers          │  │
│  │                                   │  │
│  │   ┌─────┐         ┌─────┐         │  │  ← Stepper
│  │   │  -  │    2    │  +  │         │  │
│  │   └─────┘         └─────┘         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 📱  Your Phone Number             │  │  ← Auto-filled if available
│  │                                   │  │
│  │     +92 333 9876543               │  │
│  └───────────────────────────────────┘  │
│                                         │
│                                         │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │       🔍  FIND RIDES              │  │  ← Primary Button
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  (This will show available rides that   │  ← Helper text
│   match your route)                     │
│                                         │
└─────────────────────────────────────────┘
```

### Version B: Map with Bottom Sheet

```
┌─────────────────────────────────────────┐
│  ←  Book a Ride                         │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │              📍                   │  │
│  │            (You)                  │  │
│  │                                   │  │
│  │              MAP                  │  │
│  │                                   │  │
│  │    🟢                    🟠       │  │  ← Updates as user enters
│  │  Pickup               Dropoff     │  │    locations
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ╔═══════════════════════════════════╗  │
│  ║             ─────                 ║  │
│  ║                                   ║  │
│  ║  Where do you need a ride?        ║  │
│  ║                                   ║  │
│  ║  ┌─────────────────────────────┐  ║  │
│  ║  │ 🟢  Pickup: Tap to select   │  ║  │
│  ║  └─────────────────────────────┘  ║  │
│  ║                                   ║  │
│  ║  ┌─────────────────────────────┐  ║  │
│  ║  │ 🟠  Dropoff: Tap to select  │  ║  │
│  ║  └─────────────────────────────┘  ║  │
│  ║                                   ║  │
│  ║  ┌─────────────────────────────┐  ║  │
│  ║  │                             │  ║  │
│  ║  │       🔍  FIND RIDES        │  ║  │
│  ║  │                             │  ║  │
│  ║  └─────────────────────────────┘  ║  │
│  ║                                   ║  │
│  ╚═══════════════════════════════════╝  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 6. Available Rides List

> **Status**: 🔨 Needs implementation  
> **File**: `RidesList.tsx`  
> **Purpose**: Booker sees list of all available rides they can book

### Empty State

```
┌─────────────────────────────────────────┐
│  ←  Available Rides                 🔄  │  ← Refresh button
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │  ← Your search summary
│  │  🔍 Your Search                   │  │
│  │  ─────────────────────────────    │  │
│  │  🟢 Liberty Market                │  │
│  │        ↓                          │  │
│  │  🟠 Faisal Town                   │  │
│  │                                   │  │
│  │  👥 2 passengers                  │  │
│  └───────────────────────────────────┘  │
│                                         │
│                                         │
│                                         │
│                                         │
│              🚗                         │
│                                         │
│      No rides available right now       │
│                                         │
│     Pull down to refresh or check       │
│          back in a few minutes          │
│                                         │
│                                         │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │       🔄  Refresh                 │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### With Available Rides

```
┌─────────────────────────────────────────┐
│  ←  Available Rides              🔄  ⏱️ │  ← Refresh + Timer
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  🔍 Searching near: Liberty Mkt   │  │  ← Compact search info
│  │     → Faisal Town (2 passengers)  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ─────── 5 Rides Found ──────────────   │
│                                         │
│  ┌───────────────────────────────────┐  │  ← Ride Card #1
│  │                                   │  │
│  │  ┌────┐  Ahmed Hassan      🚗     │  │  ← Avatar + Name + Vehicle icon
│  │  │ 👤 │                           │  │
│  │  └────┘  ⭐ 4.8 (12 rides)        │  │  ← Optional: rating
│  │                                   │  │
│  │  🔵 Gulberg III, Lahore           │  │
│  │        ↓                          │  │
│  │  🔴 Model Town, Lahore            │  │
│  │                                   │  │
│  │  ─────────────────────────────    │  │
│  │                                   │  │
│  │  🚗 White Civic   👥 3 seats      │  │
│  │                                   │  │
│  │  📏 +2.3 km from your route       │  │  ← Deviation preview
│  │                                   │  │
│  │  ⏱️ Posted 3 min ago              │  │  ← Time ago
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │  ← Ride Card #2
│  │                                   │  │
│  │  ┌────┐  Fatima Zahra      🏍️     │  │  ← Bike icon
│  │  │ 👤 │                           │  │
│  │  └────┘                           │  │
│  │                                   │  │
│  │  🔵 DHA Phase 6                   │  │
│  │        ↓                          │  │
│  │  🔴 Johar Town                    │  │
│  │                                   │  │
│  │  🏍️ Honda 125     👥 1 seat       │  │
│  │  📏 +1.1 km from your route       │  │
│  │  ⏱️ Posted 7 min ago              │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─────────────────────────────────  ┐  │
│  │  ... more cards (scrollable)      │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ────────────────────────────────────   │
│    Auto-refreshing in 25 seconds...     │  ← Polling indicator
│                                         │
└─────────────────────────────────────────┘
```

---

## 7. Ride Detail Modal

> **Status**: 🔨 New screen needed  
> **File**: `RideDetailModal.tsx`  
> **Purpose**: Booker views ride details with map before booking

```
┌─────────────────────────────────────────┐
│  ╔═══════════════════════════════════╗  │  ← Modal (slides up)
│  ║             ─────                 ║  │    Drag handle
│  ║  ✕                                ║  │  ← Close button
│  ║                                   ║  │
│  ║  ┌─────────────────────────────┐  ║  │
│  ║  │                             │  ║  │
│  ║  │    🔵━━━━━━━━━━━━━━━━🔴     │  ║  │  ← Driver's route
│  ║  │  Start              End     │  ║  │
│  ║  │                             │  ║  │
│  ║  │        🟢          🟠       │  ║  │  ← Your pickup/dropoff
│  ║  │     Pickup      Dropoff     │  ║  │
│  ║  │                             │  ║  │
│  ║  │          MAP VIEW           │  ║  │
│  ║  │                             │  ║  │
│  ║  │  ─── Driver route           │  ║  │
│  ║  │  ─── Your stops             │  ║  │
│  ║  │                             │  ║  │
│  ║  └─────────────────────────────┘  ║  │
│  ║                                   ║  │
│  ║  ┌─────────────────────────────┐  ║  │  ← Driver Info
│  ║  │  ┌────┐                     │  ║  │
│  ║  │  │ 👤 │  Ahmed Hassan       │  ║  │
│  ║  │  └────┘                     │  ║  │
│  ║  │                             │  ║  │
│  ║  │  🚗 White Honda Civic       │  ║  │
│  ║  │  👥 3 seats available       │  ║  │
│  ║  │                             │  ║  │
│  ║  └─────────────────────────────┘  ║  │
│  ║                                   ║  │
│  ║  ┌─────────────────────────────┐  ║  │  ← Route Comparison
│  ║  │  📊 Route Analysis          │  ║  │
│  ║  │  ───────────────────────    │  ║  │
│  ║  │                             │  ║  │
│  ║  │  Driver's route:   15.2 km  │  ║  │
│  ║  │  With your stops:  17.5 km  │  ║  │
│  ║  │  ───────────────────────    │  ║  │
│  ║  │  Driver detours:  +2.3 km   │  ║  │  ← Key info!
│  ║  │                             │  ║  │
│  ║  └─────────────────────────────┘  ║  │
│  ║                                   ║  │
│  ║  ┌─────────────────────────────┐  ║  │
│  ║  │                             │  ║  │
│  ║  │     🚗  BOOK THIS RIDE      │  ║  │  ← Primary CTA
│  ║  │                             │  ║  │
│  ║  └─────────────────────────────┘  ║  │
│  ║                                   ║  │
│  ╚═══════════════════════════════════╝  │
│                                         │
│  (Background: Rides List - blurred)     │
│                                         │
└─────────────────────────────────────────┘
```

---

## 8. Booking Status Screen

> **Status**: 🔨 New screen needed  
> **File**: `BookingStatus.tsx`  
> **Purpose**: Booker sees their booking status (pending/accepted/rejected)

### Pending State

```
┌─────────────────────────────────────────┐
│  ←  Booking Status                      │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│                                         │
│              ⏳                         │
│                                         │
│       Waiting for driver to accept      │  ← Animated loading
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │  ┌────┐  Ahmed Hassan             │  │
│  │  │ 👤 │                           │  │
│  │  └────┘  🚗 White Civic           │  │
│  │                                   │  │
│  │  🔵 Gulberg → 🔴 Model Town       │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Your Request                     │  │
│  │  ─────────────────────────────    │  │
│  │  🟢 Pickup: Liberty Market        │  │
│  │  🟠 Dropoff: Faisal Town          │  │
│  │  👥 2 passengers                  │  │
│  │                                   │  │
│  │  ⏱️ Requested 2 min ago           │  │
│  └───────────────────────────────────┘  │
│                                         │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │       ❌  Cancel Request          │  │  ← Option to cancel
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ────────────────────────────────────   │
│    We'll notify you when driver         │
│    responds to your request             │
│                                         │
└─────────────────────────────────────────┘
```

### Accepted State 🎉

```
┌─────────────────────────────────────────┐
│  ←  Booking Confirmed                   │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │              ✓                    │  │  ← Big checkmark (green)
│  │                                   │  │
│  │        Booking Confirmed!         │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │  ← Driver Details Card
│  │                                   │  │
│  │       Your Driver                 │  │
│  │  ─────────────────────────────    │  │
│  │                                   │  │
│  │  ┌──────┐                         │  │
│  │  │      │   Ahmed Hassan          │  │
│  │  │  👤  │                         │  │
│  │  │      │   📱 +92 300 1234567    │  │  ← Phone revealed!
│  │  └──────┘                         │  │
│  │                                   │  │
│  │  🚗 White Honda Civic             │  │
│  │                                   │  │
│  │  🔵 Starting from: Gulberg III    │  │
│  │  🔴 Going to: Model Town          │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Your Pickup                      │  │
│  │  ─────────────────────────────    │  │
│  │                                   │  │
│  │  🟢 Liberty Market, Gulberg       │  │
│  │                                   │  │
│  │  (Driver will pick you up here)   │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ───────── Contact Driver ───────────   │
│                                         │
│  ┌─────────────────┐ ┌─────────────────┐│
│  │                 │ │                 ││
│  │   📞  CALL      │ │  💬  WHATSAPP   ││
│  │                 │ │                 ││
│  └─────────────────┘ └─────────────────┘│
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │       🏠  Back to Home            │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### Rejected State 😢

```
┌─────────────────────────────────────────┐
│  ←  Booking Status                      │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│                                         │
│              ❌                         │
│                                         │
│      Driver declined your request       │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │  Don't worry! There are other     │  │
│  │  rides available.                 │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│                                         │
│                                         │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │    🔍  Find Other Rides           │  │  ← Try again
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │
│  │       🏠  Back to Home            │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 9. Components Library

> Reusable components you'll need across screens

### 9.1 Ride Card (Compact)

```
┌───────────────────────────────────────┐
│                                       │
│  ┌────┐  Ahmed Hassan          🚗    │
│  │ 👤 │                              │
│  └────┘                              │
│                                       │
│  🔵 Gulberg III, Lahore              │
│        ↓                             │
│  🔴 Model Town, Lahore               │
│                                       │
│  ─────────────────────────────────   │
│                                       │
│  🚗 White Civic    👥 3 seats        │
│  📏 +2.3 km        ⏱️ 3 min ago      │
│                                       │
└───────────────────────────────────────┘
```

### 9.2 Booking Request Card

```
┌───────────────────────────────────────┐
│  ┌────┐                        NEW   │
│  │ 👤 │  Ali Khan                    │
│  └────┘                              │
│                                       │
│  📍 Pickup: Liberty Market           │
│  📍 Dropoff: Faisal Town             │
│                                       │
│  👥 2 passengers  •  📏 +2.3 km      │
│                                       │
│  ─────────────────────────────────   │
│           Tap to view details →      │
└───────────────────────────────────────┘
```

### 9.3 Location Input Field

```
┌───────────────────────────────────────┐
│  🟢  Pickup Location                 │
│                                       │
│      Liberty Market, Gulberg...      │
│                                       │
└───────────────────────────────────────┘
          ↓ (on tap, shows autocomplete)
┌───────────────────────────────────────┐
│  🔍  Search location...              │
├───────────────────────────────────────┤
│  📍 Liberty Market, Gulberg          │
│  📍 Liberty Roundabout               │
│  📍 Liberty Chowk, MM Alam           │
└───────────────────────────────────────┘
```

### 9.4 Deviation Card

```
┌───────────────────────────────────────┐
│  📊 Route Deviation                  │
│  ─────────────────────────────────   │
│                                       │
│  Original route:       15.2 km       │
│  With pickup/dropoff:  17.5 km       │
│  ─────────────────────────────────   │
│  Extra distance:      +2.3 km  ⚠️    │
│                                       │
└───────────────────────────────────────┘
```

### 9.5 Status Badge

```
Pending:    ┌──────────────┐
            │  ⏳ PENDING  │  (Yellow/Orange)
            └──────────────┘

Accepted:   ┌──────────────┐
            │  ✓ ACCEPTED  │  (Green)
            └──────────────┘

Rejected:   ┌──────────────┐
            │  ✗ REJECTED  │  (Red)
            └──────────────┘
```

### 9.6 Contact Buttons Row

```
┌─────────────────┐ ┌─────────────────┐
│                 │ │                 │
│   📞  CALL      │ │  💬  WHATSAPP   │
│                 │ │                 │
└─────────────────┘ └─────────────────┘
```

### 9.7 Number Stepper

```
┌───────────────────────────────────────┐
│  👥 Number of Passengers             │
│                                       │
│     ┌─────┐           ┌─────┐        │
│     │  -  │     2     │  +  │        │
│     └─────┘           └─────┘        │
│                                       │
└───────────────────────────────────────┘
```

### 9.8 Vehicle Type Toggle

```
┌───────────────────────────────────────┐
│  Vehicle Type                        │
│                                       │
│  ┌───────────────┐  ┌───────────────┐│
│  │               │  │               ││
│  │    🚗 Car     │  │   🏍️ Bike    ││
│  │   (selected)  │  │               ││
│  │   ─────────   │  │               ││
│  └───────────────┘  └───────────────┘│
│                                       │
└───────────────────────────────────────┘
```

---

## Color Scheme Reference

```
Primary Colors:
├── Blue:       #3A6FF8  (Primary actions)
├── Teal:       #8DDDD3  (Gradient end, accents)
└── Gradient:   Blue → Teal (Primary buttons)

Status Colors:
├── Green:      #22C55E  (Success, Accepted)
├── Red:        #EF4444  (Error, Rejected)
├── Yellow:     #F59E0B  (Warning, Pending)
└── Gray:       #9CA3AF  (Disabled, Secondary)

Map Markers:
├── 🔵 Blue:    Driver's Start
├── 🔴 Red:     Driver's Destination  
├── 🟢 Green:   Booker's Pickup
└── 🟠 Orange:  Booker's Dropoff

Background:
├── White:      #FFFFFF
├── Light Gray: #F9FAFB
└── Card BG:    #FFFFFF with shadow
```

---

## Implementation Checklist

### Step 1: Set Up Navigation
- [ ] Add new screens to `_layout.tsx`
- [ ] Configure screen transitions

### Step 2: Create Types
- [ ] Create `carpool.types.ts`

### Step 3: Build Screens (In Order)
- [ ] `PostRide.tsx` - Form screen
- [ ] `BookRide.tsx` - Form screen  
- [ ] `RidesList.tsx` - List screen
- [ ] `BookingRequests.tsx` - List screen
- [ ] `RideDetailModal.tsx` - Modal
- [ ] `BookingDetails.tsx` - Detail screen
- [ ] `BookingStatus.tsx` - Status screen

### Step 4: Reusable Components
- [ ] `RideCard.tsx`
- [ ] `BookingRequestCard.tsx`
- [ ] `DeviationCard.tsx`
- [ ] `ContactButtons.tsx`
- [ ] `NumberStepper.tsx`
- [ ] `VehicleTypeToggle.tsx`

### Step 5: Backend Integration
- [ ] Create API service
- [ ] Create React Query hooks
- [ ] Connect screens to API

---

**Good luck with your Figma designs! 🎨**
