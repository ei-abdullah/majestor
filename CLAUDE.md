# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Majestor

A university platform with two main apps: a React Native mobile app (`apps/mobile`) and a Spring Boot REST API (`apps/api`). A minimal Next.js web app (`apps/web`) also exists but is not the focus. The platform's core features are **Carpool** (ride sharing between students) and **Study Hub** (study groups, document sharing, group chat).

## Commands

### Backend (`apps/api`)
```bash
./mvnw spring-boot:run        # run dev server on :8080
./mvnw clean package          # build jar
./mvnw test                   # run all tests
```
Spring profile `dev` uses `create-drop` DDL; `prod` uses `update`. Set via `SPRING_PROFILES_ACTIVE`.

### Mobile (`apps/mobile`)
```bash
npm start                     # start Expo dev server
npm run android               # run on Android
npm run ios                   # run on iOS
npm run lint                  # ESLint
```

### Local IP
The dev API URL is hardcoded to `192.168.18.40:8080` in `apps/mobile/src/constants/index.ts`. Change `LOCAL_IP` to match your machine's LAN IP before running the app on a physical device.

## Architecture

### Backend (`apps/api`)

**Module layout** — every feature lives under `modules/<name>/`:
```
modules/
  auth/          AuthController, JWT login/signup/refresh
  user/          UserController, UserService, UserRepository
  academia/      University + Course entities (referenced by users & study groups)
  carpool/       ride/, booking/, rideRequest/, message/ sub-modules
  studyhub/      StudyHubController (feed), studygroup/, document/, groupchat/
  notification/  NotificationService, push via Expo Push API
```

**Infrastructure layer** (`infra/`): JWT filter chain (`jwt/`), S3 file storage (`s3/`), WebSocket STOMP broker (`websocket/`), global exception handler (`exception/`), email (`emailservice/`).

**Patterns**:
- Each module follows Controller → Service → Repository → Entity. DTOs live in `dto/` sub-packages.
- `@Transactional` is required on any service method that touches lazy-loaded JPA relations (e.g. `user.getFaculty()`). Missing it causes `LazyInitializationException`.
- `@Async` is used in `NotificationService` — notifications fire-and-forget. They are not rolled back if the outer transaction fails.
- `SYSTEM` notifications have no sender; `notification.getSender()` can be null — always null-check before accessing sender fields.
- Course association is optional on study groups (`@ManyToOne` nullable). Always guard `courseId != null` before calling `courseRepository.findById()`.

**API base path**: `/api/v1/`

### Mobile (`apps/mobile`)

**Routing** — Expo Router v3 file-based routing under `src/app/`:
```
(auth)/          login, signup, onboarding screens
(tabs)/          tab navigator root
  index          Home screen
  carpool/       ride browsing, posting, booking, requests
  studyhub/      feed, group detail, upload, group lists
  user/          settings, notifications
chat/            1-on-1 carpool chat (Stack)
groupchat/       study group WebSocket chat (Stack)
error.tsx        global React error boundary (exports `ErrorBoundary`)
```

**Route typing**: Expo Router v3 typed routes are enabled. Use `"..." as Href` for plain `router.push()` strings. Use `pathname: "..." as any` when passing `params` alongside the pathname.

**State**:
- **Server state** — TanStack Query (React Query v5). Query hooks live in `src/queries/`. API functions live in `src/services/*.api.ts`. Mutations call `queryClient.invalidateQueries` on success.
- **Client state** — Zustand stores in `src/stores/`. `authStore` is persisted to AsyncStorage. `networkErrorStore` drives the global network error overlay.

**HTTP client** — Axios instance in `src/services/index.ts` with an auth interceptor (`authInterceptor.ts`) that attaches JWT and handles 401 token refresh. A 402 response triggers the premium upsell modal. A 500+ or no-response error sets `networkErrorStore` to show a blocking error overlay.

**UI patterns**:
- `GradientView` wraps every tab screen root — it uses `useFocusEffect` + Reanimated to fade in on tab focus.
- `CustomTabBar` is a fully custom animated tab bar (Reanimated `LinearTransition`, haptic feedback).
- NativeWind (Tailwind) for utility classes; inline `style` props for dynamic/complex styles.
- `CustomHeader` is used across sub-stack screens via each tab's `_layout.tsx`.

**Push notifications** — `PushTokenRegistrar` component (rendered in `_layout.tsx`) calls `useRegisterPushToken` on mount to register the Expo push token with the backend (`PATCH /api/v1/user/update-push-token/{userId}`).

**WebSocket** — STOMP over SockJS (`src/services/stompService.ts`) connects to `/ws`. Used for carpool chat and study group group chat.

### Key cross-cutting concerns

| Concern | Where |
|---|---|
| JWT secret, DB creds, AWS keys | `.env` (never committed) |
| Error tracking | Sentry — both backend (manual capture) and mobile (`@sentry/react-native`, wraps root layout) |
| File uploads | AWS S3 via `DocumentService`; mobile sends `multipart/form-data` |
| Notification delivery | `NotificationService` calls Expo Push API (`exp.host/--/api/v2/push/send`) |
| Premium gating | 402 HTTP status triggers `premiumModalStore` on mobile |