# Majestor API

Spring Boot REST API for the Majestor platform. Handles authentication, carpool ride management, study hub, document storage, real-time messaging, and push notifications.

---

## Stack

- **Java 21** / Spring Boot 3.5.6
- **PostgreSQL** via Spring Data JPA / Hibernate
- **Spring Security** + JWT (HS256)
- **AWS S3** for file storage
- **WebSocket / STOMP** for real-time chat and booking status
- **Gmail SMTP** for transactional email
- **Swagger / SpringDoc OpenAPI** for interactive API docs

---

## Running

```bash
# Dev (requires PostgreSQL running locally or via Docker)
./mvnw spring-boot:run

# Build JAR
./mvnw clean package -DskipTests

# Run JAR
java -jar target/api-0.0.1-SNAPSHOT.jar
```

API is available at `http://localhost:8080`.
Swagger UI: `http://localhost:8080/swagger-ui.html`

### Spring Profiles

| Profile | DDL | DB |
|---------|-----|----|
| `dev` (default) | `create-drop` | `localhost:5432/majestor_db` |
| `prod` | `update` | `${DATABASE_URL}` |

Set via `SPRING_PROFILES_ACTIVE=prod`.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `JWT_SECRET_KEY` | Base64-encoded HMAC-SHA secret |
| `S3_BUCKET_NAME` | AWS S3 bucket name |
| `S3_BUCKET_REGION` | AWS region (e.g. `us-east-1`) |
| `S3_ACCESS_KEY` | AWS access key ID |
| `S3_SECRET_KEY` | AWS secret access key |
| `SUPPORT_EMAIL` | Gmail address used for sending email |
| `APP_PASSWORD` | Gmail app password |
| `DATABASE_URL` | Full JDBC URL (prod only) |
| `DATABASE_USERNAME` | DB username (prod only) |
| `DATABASE_PASSWORD` | DB password (prod only) |

---

## Module Structure

```
modules/
├── auth/           Login, signup, email verification, password reset, token refresh
├── user/           Profile management, avatar upload, push token, user search
├── academia/
│   ├── university/ Universities and faculties
│   └── course/     Courses per user
├── carpool/
│   ├── ride/       Post rides, complete/cancel, fare config
│   ├── rideRequest/ Submit and cancel ride requests
│   ├── booking/    Create, accept, reject bookings
│   ├── message/    WebSocket 1-on-1 carpool chat
│   └── fare/       FareConfig entity + admin endpoint
├── studyhub/
│   ├── studygroup/ Create, join, leave, rate study groups + invites
│   ├── document/   Upload, download, like documents
│   └── groupchat/  WebSocket group chat
└── notification/   In-app notifications + Expo push delivery
```

---

## API Endpoints

### Auth — `/api/v1/auth`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/login` | Login with email + password → access + refresh tokens |
| POST | `/signup` | Register new account → sends verification email |
| POST | `/signup/verify` | Verify email with token |
| GET | `/signup/verify?token=` | Email verification landing page (HTML) |
| POST | `/forgetPassword?email=` | Send password reset email |
| POST | `/refresh` | Exchange refresh token for new access token |

### User — `/api/v1/user`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/getUserDetails/{userId}` | Get full user profile |
| PATCH | `/updateProfileImage/{userId}` | Upload profile picture (multipart) |
| PATCH | `/updateUserDetails/{userId}` | Update phone, personal email, etc. |
| PATCH | `/update-push-token/{userId}` | Register Expo push notification token |
| GET | `/search?query=&requestingUserId=` | Search users by name/email |
| GET | `/stats/{userId}` | Ride count, group count, document count |

### Carpool — Rides — `/api/v1/ride`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/uploadRide/{userId}` | Driver posts a new ride |
| GET | `/recentRides` | Active rides posted within the last 10 minutes |
| PATCH | `/completeRide/{rideId}/{bookingId}` | Mark ride as completed |
| PATCH | `/cancelBookedRide/{rideId}/{bookingId}` | Cancel an accepted booking |
| PATCH | `/cancelPostedRide/{rideId}` | Driver cancels a posted ride with no accepted booking |
| GET | `/fare-config` | Get current fare rates (CAR + BIKE) |
| PATCH | `/fare-config/{vehicleType}` | Update fare rate for a vehicle type (admin) |

### Carpool — Ride Requests — `/api/v1/rideRequest`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/uploadRideRequest/{userId}` | Passenger submits a ride request |
| PATCH | `/cancelRideRequest/{rideRequestId}` | Cancel a pending ride request |

### Carpool — Bookings — `/api/v1/booking`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/createBooking/{rideRequestId}/{rideId}` | Passenger books a matching ride |
| GET | `/getBookings/{rideId}` | Driver fetches all booking requests for their ride |
| GET | `/getBookingStatus/{bookingId}` | Passenger polls their booking status |
| PATCH | `/acceptBooking/{bookingId}` | Driver accepts a booking |
| PATCH | `/rejectBooking/{bookingId}` | Driver rejects a booking |

### Carpool — Chat (WebSocket / STOMP)

| Mapping | Description |
|---------|-------------|
| `@MessageMapping("/message")` | Broadcast to `/topic/public` |
| `@MessageMapping("/private-message")` | Send to `/user/{receiverName}/private` |

Connect to: `ws://localhost:8080/ws`

### Study Hub — Groups — `/api/v1/study-group`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/create-group/{userId}` | Create a new study group |
| POST | `/join-group/{studyGroupId}/{userId}` | Join an existing group |
| PATCH | `/leave-group/{studyGroupId}/{userId}` | Leave a group |
| GET | `/details/{studyGroupId}/{userId}` | Get group details and members |
| PATCH | `/rate/{studyGroupId}/{userId}` | Rate a study group |

### Study Hub — Invites — `/api/v1/study-group-invite`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/send/{groupId}/{inviterId}/{inviteeId}` | Send a group invite |
| PATCH | `/accept/{inviteId}` | Accept an invite |
| PATCH | `/reject/{inviteId}` | Reject an invite |
| GET | `/pending/{userId}` | Get all pending invites for a user |

### Study Hub — Documents — `/api/v1/document`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/uploadDocument/{userId}` | Upload document with images (multipart) |
| GET | `/vault/{userId}` | Get documents (filterable by destination, course, type, year, semester, likes) |
| PATCH | `/likeDocument/{userId}/{documentId}` | Like / unlike a document |
| GET | `/downloadDocument/{userId}/{documentId}` | Download document images |

### Study Hub — Feed — `/api/v1/study-hub`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/feed/{userId}` | Trending groups, official groups, recent documents |

### Study Hub — Group Chat (WebSocket / STOMP)

| Mapping | Description |
|---------|-------------|
| `/api/v1/group-message` | Group chat messages via STOMP |

### Notifications — `/api/v1/notifications`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/user/{userId}` | Get all notifications for a user |
| PATCH | `/mark-read/{userId}` | Mark all notifications as read |
| GET | `/has-unread/{userId}` | Check for unread notifications |

### Academia

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/university/getWithFaculties` | All universities with nested faculties |
| GET | `/api/v1/course/getCoursesByUser/{userId}` | Courses associated with user |

---

## Entities & Relationships

```
User
├─ 1:N → Ride (as ridePoster)
├─ 1:N → RideRequest
├─ 1:N → Booking
├─ 1:N → Document (as uploader)
├─ 1:N → StudyGroup (as host)
├─ 1:N → StudyGroupMember
├─ 1:N → StudyGroupInvite (inviter + invitee)
├─ 1:N → Rating
└─ 1:N → Notification

University → 1:N → Faculty → 1:N → Course

Ride (rideStatus: BOOKED | ACCEPTED | COMPLETED | CANCELLED)
├─ M:1 ← User (ridePoster)
└─ 1:N → Booking

RideRequest (status: PENDING | ACCEPTED | REJECTED | CANCELLED)
└─ M:1 ← User

Booking (status: PENDING | ACCEPTED | REJECTED | COMPLETED | CANCELLED)
├─ M:1 ← Ride
└─ M:1 ← RideRequest

FareConfig (vehicleType: CAR | BIKE, pricePerKm)

Document (type: PAST_PAPER | QUIZ | NOTES | ASSIGNMENT | PROJECT | REPORT | OTHER)
(destination: PERSONAL_VAULT | PUBLIC_VAULT | GROUP_VAULT)
├─ M:1 ← User
├─ M:1 ← Course
├─ M:1 ← StudyGroup
├─ 1:N → DocumentImage
└─ 1:N → Like

StudyGroup
├─ M:1 ← User (host)
├─ M:1 ← Course
├─ 1:N → StudyGroupMember
├─ 1:N → Rating
├─ 1:N → Document
└─ 1:N → StudyGroupInvite

Notification (type: RIDE_BOOKING | STUDY_GROUP_INVITE | DOCUMENT_LIKE | MESSAGE)
└─ M:1 ← User
```

---

## Security

- All `/api/v1/**` routes require a valid JWT in the `Authorization: Bearer <token>` header
- **Public routes** (no token required):
  - `/api/v1/auth/**`
  - `GET /api/v1/university/getWithFaculties`
  - `/ws/**`
  - `/swagger-ui/**`, `/v3/api-docs/**`
- JWT access tokens expire in **30 minutes**; refresh tokens in **30 days**
- Passwords hashed with BCrypt
- CORS: all origins allowed (tighten in production)

---

## Infrastructure

### JWT (`infra/jwt/`)
- `JwtService` — generate, validate, extract claims from tokens
- `JwtFilter` — servlet filter that attaches `Authentication` to the security context

### S3 (`infra/s3/`)
- `S3Service` — upload, download, delete files
- `DELETE /api/v1/s3/emptyBucket/{bucketName}` — dev utility to clear bucket

### Email (`infra/emailservice/`)
- `EmailService` — sends via Gmail SMTP (async)
- `HtmlPageService` — generates HTML for verification/reset landing pages

### WebSocket (`infra/websocket/`)
- STOMP over SockJS at `/ws`
- Simple in-memory message broker
- Topics: `/topic/public`, `/topic/booking-status/{bookingId}`, `/topic/available-rides`, `/topic/ride-requests/{rideId}`
- User queues: `/user/{username}/private`

### Exception Handling (`infra/exception/`)
All exceptions return a structured JSON response:
```json
{
  "timestamp": "...",
  "status": 404,
  "message": "Resource not found",
  "details": "..."
}
```

Custom exceptions: `ResourceNotFoundException` (404), `DuplicateResourceException` (409), `TierLimitExceededException` (402).

### Async (`infra/config/AsyncConfig.java`)
`@Async` is used in `NotificationService` — push notifications and emails fire-and-forget and are not rolled back if the outer transaction fails.

---

## Key Patterns

- **Controller → Service → Repository → Entity** — no logic in controllers or repositories
- **DTOs** live in `dto/` sub-packages; entities are never exposed directly
- **`@Transactional`** is required on any service method that touches lazy-loaded JPA relations — missing it causes `LazyInitializationException`
- **`@PostConstruct`** is used in `FareConfigService` to seed default fare rates and in `DataInitializer` to seed universities, faculties, and courses on first startup
- **Nullable relations** — course association on study groups is optional (`@ManyToOne` nullable); always guard `courseId != null` before querying
- **Sender null-check** — `SYSTEM` notifications have no sender; always null-check `notification.getSender()` before accessing sender fields