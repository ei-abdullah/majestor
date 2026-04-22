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

## License

MIT
