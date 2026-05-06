# Majestor Mobile

React Native + Expo app for the Majestor platform. Carpool, Study Hub, document sharing, real-time chat, and push notifications.

---

## Stack

- **React Native 0.81.5** + **Expo 54**
- **TypeScript**
- **Expo Router v3** — file-based routing
- **TanStack Query v5** — server state and caching
- **Zustand** — client state (persisted to AsyncStorage)
- **NativeWind** — Tailwind utility classes
- **React Hook Form** — form management and validation
- **Axios** — HTTP client with JWT interceptor
- **React Native Maps** — Google Maps integration
- **@stomp/stompjs** — WebSocket real-time messaging
- **Expo Location** — device location + permissions
- **Expo Notifications** — push notification token registration
- **Sentry** — error tracking

---

## Running

```bash
npm install
npm start          # Expo dev server
npm run android    # Android emulator
npm run ios        # iOS simulator (macOS only)
npm run lint       # ESLint
```

Before running on a physical device, set your machine's LAN IP in `src/constants/index.ts`:

```typescript
const LOCAL_IP = "192.168.x.x"; // your machine's IP
```

---

## Project Structure

```
src/
├── app/                    # Expo Router pages (file = route)
├── components/
│   ├── screens/            # Screen-level components
│   └── ui/                 # Reusable UI components
├── hooks/                  # Custom React hooks
├── queries/                # TanStack Query hooks
├── services/               # Axios API functions
├── stores/                 # Zustand stores
├── types/                  # TypeScript types
├── utils/                  # Pure utility functions
└── constants/              # App-wide constants
```

---

## Routing

Expo Router file-based routing under `src/app/`:

```
_layout.tsx                     Root layout (Sentry, error boundary, push token registrar)
(auth)/
  _layout.tsx
  authScreen.tsx               Login / Signup
(tabs)/
  _layout.tsx                  Bottom tab navigator
  index.tsx                    Home dashboard
  carpool/
    _layout.tsx                Carpool tab (mounts useLocationPermissions once)
    index.tsx                  Carpool home (map + quick actions)
    ride/
      postRide.tsx             Driver: post a new ride
      bookingRequests.tsx      Driver: view incoming booking requests
      bookingDetails.tsx       Driver: detailed view of a booking + map
    rideRequest/
      bookRide.tsx             Passenger: submit a ride request
      availableRides.tsx       Passenger: browse matching rides
      rideDetails.tsx          Passenger: view ride + book
  studyhub/
    _layout.tsx
    index.tsx                  Study Hub feed
    uploadDocument.tsx         Upload a document
    joinedGroups.tsx           Groups the user is a member of
    officialGroup.tsx          Official university groups
    trendingGroup.tsx          Trending groups
    studyGroupDetail.tsx       Group detail + members + documents
    personalVault.tsx          User's private documents
    publicVault.tsx            Public document vault
  user/
    index.tsx                  Profile + settings + sign out
chat/
  _layout.tsx
  index.tsx                    1-on-1 carpool chat (STOMP)
groupchat/
  _layout.tsx
  index.tsx                    Study group chat (STOMP)
notification/
  _layout.tsx
  index.tsx                    Notification list
error.tsx                      Global React error boundary
```

**Route typing**: Typed routes enabled. Use `"..." as Href` for plain strings. Use `pathname: "..." as any` when passing `params`.

---

## Zustand Stores

All stores live in `src/stores/`. Persisted stores use AsyncStorage.

### `authStore`
Persisted. Holds the logged-in session.

| Field | Type | Description |
|-------|------|-------------|
| `user` | `AuthUser \| null` | Current user |
| `accessToken` | `string \| null` | JWT access token |
| `isLoggedIn` | `boolean` | Derived from user presence |

Actions: `setSession`, `clearSession`, `updateUser`, `markOnboarded`

### `rideStore`
Persisted. Holds the driver's active ride details.

Stores the full `UploadRideResponse` plus `bookingId` and `bookingStatus` once a booking is accepted.

Actions: `setRideDetails`, `setAcceptedBooking`, `clearRideDetails`, `isEmpty`

### `rideRequestStore`
Persisted. Holds the passenger's active ride request and booking state.

Actions: `setRideRequestDetails`, `setBookingDetails`, `clearBookingDetails`, `clearRideRequestDetails`

### `locationStore`
Holds device location state shared across carpool screens.

| Field | Description |
|-------|-------------|
| `hasLocationPermission` | Whether OS permission is granted |
| `userLocation` | `{ latitude, longitude, address }` |

Actions: `setHasLocationPermission`, `setUserLocation`

### `selectedRideStore`
Transient. Holds the ride the passenger selected to view/book.

### `selectedBookingStore`
Transient. Holds the booking the driver tapped to view details.

### `premiumModalStore`
Controls the premium upsell modal. Triggered automatically on HTTP 402 responses.

### `networkErrorStore`
Controls the global network error overlay. Triggered on HTTP 5xx or no-response errors.

---

## React Query Hooks

All hooks live in `src/queries/`. The API functions they call are in `src/services/*.api.ts`.

### Ride (`ride.queries.ts`)

| Hook | Method | Endpoint |
|------|--------|----------|
| `useRecentRides()` | GET | `/ride/recentRides` |
| `useFareConfig()` | GET | `/ride/fare-config` — staleTime: 1h |
| `useUploadRide()` | POST | `/ride/uploadRide/{userId}` |
| `useCompleteRide()` | PATCH | `/ride/completeRide/{rideId}/{bookingId}` |
| `useCancelRide()` | PATCH | `/ride/cancelBookedRide/{rideId}/{bookingId}` |
| `useCancelPostedRide()` | PATCH | `/ride/cancelPostedRide/{rideId}` |

### Ride Request (`rideRequest.queries.ts`)

| Hook | Method | Endpoint |
|------|--------|----------|
| `useUploadRideRequest()` | POST | `/rideRequest/uploadRideRequest/{userId}` |
| `useCancelRideRequest()` | PATCH | `/rideRequest/cancelRideRequest/{rideRequestId}` |

### Booking (`booking.queries.ts`)

| Hook | Method | Endpoint |
|------|--------|----------|
| `useGetBookings(rideId)` | GET | `/booking/getBookings/{rideId}` |
| `useGetBookingStatus(bookingId)` | GET | `/booking/getBookingStatus/{bookingId}` |
| `useCreateBooking()` | POST | `/booking/createBooking/{rideRequestId}/{rideId}` |
| `useAcceptBooking()` | PATCH | `/booking/acceptBooking/{bookingId}` |
| `useRejectBooking()` | PATCH | `/booking/rejectBooking/{bookingId}` |

### User (`user.queries.ts`)

| Hook | Method | Endpoint |
|------|--------|----------|
| `useUserDetails(userId)` | GET | `/user/getUserDetails/{userId}` |
| `useUserStats(userId)` | GET | `/user/stats/{userId}` |
| `useSearchUsers(query, userId)` | GET | `/user/search` |
| `useUpdateProfileImage()` | PATCH | `/user/updateProfileImage/{userId}` |
| `useUpdateUserDetails()` | PATCH | `/user/updateUserDetails/{userId}` |
| `useRegisterPushToken()` | PATCH | `/user/update-push-token/{userId}` |

### Study Hub (`studyhub.queries.ts`)

| Hook | Method | Endpoint |
|------|--------|----------|
| `useStudyHubFeed(userId)` | GET | `/study-hub/feed/{userId}` |
| `useGetGroupDetails(groupId, userId)` | GET | `/study-group/details/{groupId}/{userId}` |
| `useCreateStudyGroup()` | POST | `/study-group/create-group/{userId}` |
| `useJoinStudyGroup()` | POST | `/study-group/join-group/{groupId}/{userId}` |
| `useLeaveStudyGroup()` | PATCH | `/study-group/leave-group/{groupId}/{userId}` |
| `useRateStudyGroup()` | PATCH | `/study-group/rate/{groupId}/{userId}` |
| `usePendingInvites(userId)` | GET | `/study-group-invite/pending/{userId}` |
| `useSendInvite()` | POST | `/study-group-invite/send/{groupId}/{inviterId}/{inviteeId}` |
| `useAcceptInvite()` | PATCH | `/study-group-invite/accept/{inviteId}` |
| `useRejectInvite()` | PATCH | `/study-group-invite/reject/{inviteId}` |
| `useGetVaultDocuments(userId, filters)` | GET | `/document/vault/{userId}` |
| `useUploadDocument()` | POST | `/document/uploadDocument/{userId}` |
| `useLikeDocument()` | PATCH | `/document/likeDocument/{userId}/{documentId}` |
| `useDownloadDocument()` | GET | `/document/downloadDocument/{userId}/{documentId}` |

### Notifications (`notification.queries.ts`)

| Hook | Method | Endpoint |
|------|--------|----------|
| `useGetNotifications(userId)` | GET | `/notifications/user/{userId}` |
| `useHasUnread(userId)` | GET | `/notifications/has-unread/{userId}` |
| `useMarkAllRead()` | PATCH | `/notifications/mark-read/{userId}` |

### Academia

| Hook | Method | Endpoint |
|------|--------|----------|
| `useGetUniversities()` | GET | `/university/getWithFaculties` |
| `useGetCoursesByUser(userId)` | GET | `/course/getCoursesByUser/{userId}` |

---

## Custom Hooks

| Hook | Description |
|------|-------------|
| `useLocationPermissions` | Requests OS location permission using `Location.useForegroundPermissions()` (reactive — updates when user toggles from quick settings without leaving the app). Fetches and stores device location on grant. Mounted once in `carpool/_layout.tsx`. |
| `useCurrentLocation` | One-shot location fetch. Used for "Use My Location" buttons. |
| `useMapLocation` | Manages a `MapView` ref and exposes `animateToLocation` and `centerOnUserLocation`. |
| `useDownloadDocument` | Downloads a document from the API and saves it to device storage via Expo FileSystem. |

---

## HTTP Client & Interceptors

**Base instance** — `src/services/index.ts`:
- `baseURL` = `http://{LOCAL_IP}:8080/api/v1` (dev) or production URL
- All requests go through `authInterceptor.ts`

**`authInterceptor.ts`**:
- Attaches `Authorization: Bearer <token>` to every request
- On 401: attempts token refresh, retries the original request once
- On 402: triggers `premiumModalStore` (premium upsell)
- On 5xx / no response: triggers `networkErrorStore` (blocking error overlay)

---

## UI Components

### Layout & Navigation
| Component | Description |
|-----------|-------------|
| `GradientView` | Wraps every tab screen root — fades in on tab focus via Reanimated |
| `CustomTabBar` | Fully custom animated bottom tab bar (Reanimated `LinearTransition`, haptic feedback) |
| `CustomHeader` | Stack screen header with back button and title |

### Buttons & Inputs
| Component | Description |
|-----------|-------------|
| `PrimaryButton` | Gradient CTA button |
| `OutlineButton` | Bordered button, supports `destructive` variant |
| `StyledTextInput` | Themed input with icon and size variants |
| `NumberStepper` | +/− counter with min/max bounds |
| `SearchBar` | Search input with icon |
| `ToggleButton` | On/off toggle |

### Cards
| Component | Description |
|-----------|-------------|
| `Card` | Base white card with shadow |
| `AvailableRidesCard` | Ride listing card with fare preview |
| `BookingRequestCard` | Booking request card with deviation + estimated fare |

### Modals
| Component | Description |
|-----------|-------------|
| `ConfirmModal` | Destructive action confirmation dialog (used for cancel ride, sign out, etc.) |
| `LocationSearchModal` | Google Places location picker bottom sheet |
| `RideOutcomeModal` | Shown after ride completes or is cancelled |
| `PremiumModal` | Premium upsell triggered by HTTP 402 |
| `ImageModal` | Full-screen image viewer |

### Map
| Component | Description |
|-----------|-------------|
| `CustomMarker` | Styled map pin with icon and label |
| `RouteMapWithDeviation` | Map with driver route + passenger deviation overlay |

### Status & Feedback
| Component | Description |
|-----------|-------------|
| `LoadingIndicator` | Centered spinner |
| `EmptyState` | Empty list placeholder with message |
| `ErrorNotLoad` | Failed-to-load state with retry |
| `StatusBadge` | Colored pill for booking/ride status |
| `ErrorText` | Inline form error message |
| `UserAvatar` | Profile picture with optional camera overlay for editing |
| `NetworkErrorScreen` | Blocking overlay for network failures |

---

## Utilities

| File | Description |
|------|-------------|
| `fare.utils.ts` | `calculateFare(deviationKm, vehicleType, config)` — global fare formula |
| `location.utils.ts` | `formatShortAddress()`, `DEFAULT_LOCATION` constant |
| `time.utils.ts` | `timeAgo()` relative time formatting |
| `validation.ts` | `validateEmail()`, `validatePhone()` (Pakistani 03XXXXXXXXX format) |

---

## Constants (`src/constants/index.ts`)

- `LOCAL_IP` — set this to your machine's LAN IP before running on a physical device
- `GOOGLE_API_KEY` — Google Maps / Places API key
- `WEBSOCKET_URL` — WebSocket endpoint for STOMP
- Document type options: `PAST_PAPER`, `QUIZ`, `NOTES`, `ASSIGNMENT`, `PROJECT`, `REPORT`, `OTHER`
- Semester types: `FALL`, `SPRING`, `SUMMER`
- Years array: current year → 2007

---

## WebSocket (STOMP)

`src/services/stompService.ts` wraps `@stomp/stompjs`:

```typescript
stompService.connect()
stompService.subscribe('/topic/booking-status/123', callback)
stompService.unsubscribe('/topic/booking-status/123')
```

Topics used:
| Topic | Used in |
|-------|---------|
| `/topic/available-rides` | `AvailableRides` — refreshes ride list on new rides |
| `/topic/ride-requests/{rideId}` | `BookingRequests` — refreshes incoming booking requests |
| `/topic/booking-status/{bookingId}` | `RideDetails` — passenger watches for accept/reject/complete/cancel |

---

## Push Notifications

`PushTokenRegistrar` component (rendered in root `_layout.tsx`) calls `useRegisterPushToken` on mount, which sends the Expo push token to `PATCH /api/v1/user/update-push-token/{userId}`. The backend delivers push notifications via the Expo Push API.

---

## Key Patterns

- **Single `useLocationPermissions` mount** — called once in `carpool/_layout.tsx`, not in individual screens. Screens read `hasLocationPermission` from `locationStore`.
- **Fare config deduplication** — `useFareConfig()` has a 1-hour `staleTime`. All components calling it share one cached result with no extra network requests.
- **`as any` for typed routes with params** — Expo Router v3 requires `pathname: "..." as any` when using `router.push({ pathname, params })`.
- **`@Transactional` note** — lazy-loaded JPA fields are fetched on the backend; the mobile app always receives full DTOs.
- **402 = premium gate** — the Axios interceptor catches 402 and shows the premium modal automatically, no per-screen handling needed.

---

## RevenueCat Re-integration

RevenueCat was removed pending legal clearance. While disabled, `isElite` is hardcoded to `true` (everyone has full access) and the paywall UI is inert.

### Packages to re-add

```bash
npx expo install react-native-purchases react-native-purchases-ui
```

### Files to restore

| File | What to do |
|------|------------|
| `src/services/purchases.service.ts` | Restore full RC implementation (see git history) |
| `src/stores/purchasesStore.ts` | Restore RC-backed store (see git history) |
| `src/types/purchase.d.ts` | Restore `CustomerInfo` type from `react-native-purchases` |
| `src/components/ui/PremiumModal.tsx` | Restore `RevenueCatUI.presentPaywall()` in `handleUpgrade` |
| `src/components/screens/user/UserSettings.tsx` | Restore `RevenueCatUI.presentPaywall()` and `presentCustomerCenter()` handlers |
| `src/app/_layout.tsx` | Uncomment RC imports, `configurePurchases()`, and `<PurchasesInitializer/>` |

### RevenueCat dashboard setup (before re-enabling)

1. Create a project at [app.revenuecat.com](https://app.revenuecat.com)
2. Add iOS app (Bundle ID: `com.majestor.app`) and Android app (Package: `com.majestor.app`)
3. Connect App Store Connect / Google Play in the RC dashboard
4. Create an entitlement with identifier `Majestor Pro`
5. Create a product and attach it to the entitlement
6. Copy the **Live** API keys (iOS: `appl_...`, Android: `goog_...`)
7. Set them as EAS environment variables: `EXPO_PUBLIC_RC_IOS_KEY` and `EXPO_PUBLIC_RC_ANDROID_KEY`
8. In `purchases.service.ts`, read keys from `process.env.EXPO_PUBLIC_RC_IOS_KEY` / `process.env.EXPO_PUBLIC_RC_ANDROID_KEY`

### Backend sync (RevenueCat → `premiumUntil`)

Premium status on the backend is driven by `User.premiumUntil` (`Instant`). The sync is done **client-side** — after any purchase or restore the mobile app already has the expiration date from RC and pushes it to the backend directly. No webhooks needed.

**How it works:**
1. After `Purchases.purchasePackage()` or `Purchases.restorePurchases()` succeeds, read `customerInfo.entitlements.active['Majestor Pro'].expirationDate`
2. Call `PATCH /api/v1/user/sync-premium` (authenticated) with that timestamp
3. Backend sets `user.premiumUntil` from the value received
4. Also call sync on app open inside `PurchasesInitializer` after `getCustomerInfo()` — this handles renewals automatically

**Why this is enough:**
- Purchase → synced immediately
- Renewal → synced next app open
- Cancellation → `premiumUntil` is already set to end of paid period; `isElite()` returns false naturally once it passes

**Implementation checklist:**

*Backend (`apps/api`):*
- [ ] Add `PATCH /api/v1/user/sync-premium/{userId}` to `UserController` — accepts `{ premiumUntil: long }` (epoch ms)
- [ ] Add `syncPremium(Long userId, Instant premiumUntil)` to `UserService` — sets and saves `user.premiumUntil`

*Mobile (`apps/mobile`):*
- [ ] Add `syncPremium(userId, expirationMs)` to `src/services/user.api.ts`
- [ ] In `PurchasesInitializer` (`_layout.tsx`), call sync after `getCustomerInfo()` on login
- [ ] In `PremiumModal` and `UserSettings`, call sync after a successful `PURCHASED` or `RESTORED` paywall result
