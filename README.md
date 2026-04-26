# Majestor

A university platform with two core features: **Carpool** (ride sharing between students) and **Study Hub** (study groups, document sharing, group chat). Built with Spring Boot and React Native (Expo).

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.30-000020.svg)](https://expo.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-316192.svg)](https://www.postgresql.org/)

---

## Repository Structure

```
majestor/
├── apps/
│   ├── api/          # Spring Boot REST API (port 8080)
│   └── mobile/       # React Native + Expo app
├── docker-compose.yml
└── README.md
```

Each app has its own README with full setup and architecture details:
- [`apps/api/README.md`](apps/api/README.md) — Backend
- [`apps/mobile/README.md`](apps/mobile/README.md) — Mobile app

---

## Quick Start

### Prerequisites

- Java 21+
- Node.js 18+
- Docker (for PostgreSQL)
- Expo Go app on your phone (for mobile dev)

### 1. Start the database

```bash
docker-compose up -d
```

### 2. Start the API

```bash
cd apps/api
./mvnw spring-boot:run
```

API runs at `http://localhost:8080`. Swagger UI at `http://localhost:8080/swagger-ui.html`.

### 3. Start the mobile app

```bash
cd apps/mobile
npm install
npm start
```

Scan the QR code with Expo Go. Before running on a physical device, set your machine's LAN IP in `apps/mobile/src/constants/index.ts` → `LOCAL_IP`.

---

## Features

### Carpool

- Students post rides with start/end location, vehicle details, and seat count
- Passengers submit ride requests with pickup/dropoff locations
- Driver sees deviation on a map for each booking request and estimated fare
- Real-time booking status updates via WebSocket (STOMP)
- 1-on-1 chat between driver and passenger after booking is accepted
- Fare calculated as `pricePerKm × deviationKm` — see [Fare System](#fare-system)

### Study Hub

- Create and join study groups (public/private, official university groups)
- Upload documents (past papers, notes, assignments) to personal, public, or group vault
- Filter vault by course, type, year, semester
- Like documents and sort by popularity
- Group chat via WebSocket
- Invite other students to your study group
- Rate study groups

### User

- University email signup with email verification
- JWT authentication with refresh tokens
- Profile management (avatar, phone, personal email)
- Push notifications via Expo Push API
- Premium tier with storage limits

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile framework | React Native 0.81.5 + Expo 54 |
| Language (mobile) | TypeScript |
| Navigation | Expo Router v3 (file-based) |
| Server state | TanStack Query v5 |
| Client state | Zustand |
| Styling | NativeWind (Tailwind) |
| HTTP client | Axios |
| Backend framework | Spring Boot 3.5.6 |
| Language (backend) | Java 21 |
| Database | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| Auth | JWT (HS256, 30min access / 30day refresh) |
| File storage | AWS S3 |
| Real-time | WebSocket / STOMP |
| Email | Gmail SMTP |
| Error tracking | Sentry (both apps) |
| Push notifications | Expo Push API |

---

## Fare System

Carpool fares are calculated based on the extra distance the driver travels to serve the passenger — not the full trip.

```
fare = pricePerKm × |deviationKm|

deviationKm = |passenger's route distance − driver's route distance|
```

### Default Rates

| Vehicle | Price per Km | Example (3.1 km detour) |
|---------|-------------|--------------------------|
| CAR     | Rs 24/km    | 24 × 3.1 = **Rs 74**    |
| BIKE    | Rs 13/km    | 13 × 3.1 = **Rs 40**    |

### How rates are derived

`pricePerKm` is the fuel cost per km, calculated from Pakistan petrol prices (~Rs 270/liter) divided by average vehicle mileage:

**CAR — Rs 24/km**
- Petrol ≈ Rs 270/liter
- Average car mileage ≈ 13 km/liter
- 270 ÷ 13 ≈ Rs 20/km (base fuel cost) + Rs 4/km (driver margin) = **Rs 24/km**

**BIKE — Rs 13/km**
- Petrol ≈ Rs 270/liter
- Average bike mileage ≈ 45 km/liter
- 270 ÷ 45 ≈ Rs 6/km (base fuel cost) + Rs 7/km (driver margin) = **Rs 13/km**

Rates are stored in the `fare_configs` DB table and can be updated via the admin endpoint without touching code:

```bash
curl -X PATCH http://localhost:8080/api/v1/ride/fare-config/CAR \
  -H "Content-Type: application/json" \
  -d '{ "pricePerKm": 22 }'
```

---

## Environment Variables

Create a `.env` file (never committed). See each app's README for the full list.

| Variable | Used By | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | API | DB username |
| `POSTGRES_PASSWORD` | API | DB password |
| `POSTGRES_DB` | API | DB name |
| `JWT_SECRET_KEY` | API | Base64-encoded HMAC secret |
| `S3_BUCKET_NAME` | API | AWS S3 bucket |
| `S3_BUCKET_REGION` | API | AWS region |
| `S3_ACCESS_KEY` | API | AWS access key |
| `S3_SECRET_KEY` | API | AWS secret key |
| `SUPPORT_EMAIL` | API | Gmail address for sending email |
| `APP_PASSWORD` | API | Gmail app password |
| `DATABASE_URL` | API (prod) | Full JDBC URL for production DB |

---

## API Base Path

All endpoints are prefixed with `/api/v1/`.

Public routes (no auth required):
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/signup`
- `GET  /api/v1/auth/signup/verify`
- `POST /api/v1/auth/forgetPassword`
- `POST /api/v1/auth/refresh`
- `GET  /api/v1/university/getWithFaculties`
- `/ws/**` (WebSocket)

All other routes require `Authorization: Bearer <token>`.

---

## Roadmap

Prioritized post-v1.0 plan. Order is by impact-per-effort, not chronology.

### 🔴 Critical hardening (this week)

These are pre-existing risks now amplified by being live in production.

- [ ] **Fix IDOR vulnerability** in `UserController` and audit all controllers that take an `{id}` path param. Pull authenticated user from `SecurityContextHolder` and verify ownership before allowing reads/writes. (See `UserController.java:20`.)
- [ ] **Restrict Google Maps API key** in Google Cloud Console — Android package + SHA-1 restriction, API restrictions to Maps/Places/Directions only, daily quota cap. Key is currently in source (`apps/mobile/src/constants/index.ts`).
- [ ] **Move admin credentials out of source.** `DataInitializer.java` hardcodes admin email + password. Read from `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars; fail to boot if missing.
- [ ] **Implement `forgetPassword`.** Endpoint exists and is documented as public, but `AuthService.forgetPassword()` has an empty body. Live users who forget their password are permanently locked out.
- [ ] **Make `DataInitializer` idempotent.** Currently runs unconditionally on every startup. Wrap each init method with a `count() == 0` guard, or move seed data into a Flyway `V2__seed_data.sql` migration.

### 🟡 v1.1 — biggest product unlocks (next 2 weeks)

The four features most likely to materially improve retention and adoption.

- [ ] **Ride ratings + driver profile.** After a completed ride, prompt both sides for a 1–5 star rating and optional one-line review. Surface average rating + total rides on driver profiles and on every ride listing. Single biggest trust unlock for Carpool.
- [ ] **Women-only rides toggle.** Flag on ride posts and ride requests. "Female passengers only" rides are visible only to female users. Requires verified `gender` on signup. Important for the Pakistani university context.
- [ ] **New-document push notifications by course.** When a user uploads a document tagged with a course another user has enrolled in, push them. Push infra already exists — only need course-to-user matching logic. Daily engagement driver.
- [ ] **Class timetable.** Users add their classes (course + day + time + location). Home screen shows "Next class: SE-201 in 23 mins." Pairs with carpool ("ride to your 9am") and study groups. The feature most likely to turn the app into a daily habit.

### 🟢 v1.2 — growth & engagement (month 2)

- [ ] **Recurring rides.** "Repeat: Mon/Wed/Fri at 8am for 16 weeks." Auto-generates daily instances; passengers book individual ones. Removes the friction of posting the same commute every day.
- [ ] **Document bookmarks ("Save for later").** Private save action, separate from public Like. Most study hub usage is "I'll need this for finals" — bookmarks are the right primitive.
- [ ] **Referral system.** "Invite a friend with university email → both get 1 month of Elite when they sign up." Track via referral code on signup payload. Per-university leaderboard. Word-of-mouth is the dominant acquisition channel for campus apps; make it explicit.
- [ ] **Define what Elite unlocks, concretely.** Replace vague "premium resources" copy in `PremiumModal` with a concrete table: free vs. Elite limits on study groups, storage, document uploads, etc.

### 🛡️ Trust & safety (Carpool)

- [ ] **SOS button during a ride.** Held-down emergency button on the live ride screen — shares location + ride details with a pre-set emergency contact and `support@majestor.org`. Table-stakes for ride-sharing.
- [ ] **One-time vehicle verification.** First ride post requires uploading vehicle registration + license. Manual admin review. "Verified vehicle" badge on listings.

### 📊 Observability & quality (background work)

- [ ] **Add product analytics** (PostHog or Mixpanel). Track ~10 events: signup_completed, ride_posted, ride_booked, group_joined, document_uploaded, message_sent, etc. Don't over-instrument.
- [ ] **Watch Play Console Vitals weekly** once installs cross a few hundred. ANR rate, crash rate, slow rendering, slow startup.
- [ ] **API monitoring beyond Sentry.** Alert on 5xx rate > 1% over 10 minutes. Digital Ocean's built-in app metrics is enough for v1.
- [ ] **Pragmatic test coverage.** Backend integration tests for the 5 most-used endpoints (Spring Boot + Testcontainers). Mobile: skip unit tests, add a single Maestro/Detox end-to-end smoke test in CI.

### 🔭 Future bets — only if user data validates them

These are natural extensions but should not be built without seeing demand in analytics first.

- [ ] **Campus marketplace** — used textbooks, calculators, lab coats.
- [ ] **Lost & found board.**
- [ ] **Tutor matching** — Elite-only feature pairing seniors with juniors.
- [ ] **Faculty/admin announcements** — official university news pushed to enrolled students.
- [ ] **Study sessions calendar** — "Group SE-201 meeting at library, 7pm Thursday" with RSVP.
- [ ] **Multi-university scaling.** Move single-university seed data into per-university SQL migrations or a tiny admin UI. Currently `DataInitializer` hardcodes one university.

### Philosophy

- **Build trust features (ratings, SOS, verification) before growth features.** A carpool app with one bad story is dead.
- **Ship v1.1 with analytics enabled.** Solo developers waste the most time building features users don't want; analytics is the cheapest insurance against that.
- **Don't promote betas to production while testing tracks have older non-compliant builds active.** Google reviews the union of all tracks (learned this the hard way during the v1.0 launch).

---

## License

MIT
