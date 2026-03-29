# Majestor Study Hub: Implementation Roadmap (v2.0)

This document tracks the technical execution and current state of the Study Hub feature.

---

## 1. Current Progress (Backend Surgery)
The foundational data layer has been refactored to support the Freemium and Institutional Isolation models.

### ✅ Completed Tasks
- **Entity Refactoring**: 
    - `User.java`: Added `storageUsed`, `storageLimit`, `isFaculty`, and `premiumUntil`.
    - `Document.java`: Added `destination`, `isPremiumOnly`, and `totalFileSize` (Long/Bytes).
    - `StudyGroup.java`: Added `isOfficial` and course relationships.
- **Storage Tracking**:
    - `Utils.java`: Defined 100MB (Free), 500MB (Faculty), and 5GB (Elite) constants.
    - `DocumentService.java`: Implemented quota enforcement and `storageUsed` updates for `PERSONAL_VAULT` uploads.
- **Access Control**:
    - `DocumentService.java`: Added `validateAccess` to enforce the Elite paywall on premium documents.
    - `DocumentController.java`: Updated `downloadDocument` to require `userId` for validation.
- **DTO & Mapping**:
    - `AuthUserDTO.java`: Includes storage metrics and premium status.
    - `AuthMapper.java`: Correctly populates the DTO during login/signup.
    - `DocumentMapper.java`: Supports `studyGroupId` and optional `courseId`.

---

## 2. Pending Implementation (Logic Layer)
The following business rules need to be implemented in the Service layer:

### A. Study Group Limits
- **Join Limit**: Free students are restricted to joining **1 group**.
- **Creation Limit**: Free students are restricted to creating **1 group**.
- **Elite/Faculty Bypass**: Users with `isFaculty=true` or an active `premiumUntil` date skip these checks.

### B. Institutional Isolation
- All Study Hub feeds (Joined, Official, Trending) must be filtered by the user's `facultyId` and `universityId`.
- **Repository Queries**: Implement `@Query` methods in `StudyGroupRepository` to fetch groups within the user's academic bubble.

### C. Study Hub Feed API
- Create a `GET /api/v1/study-hub/feed` endpoint that returns a consolidated response:
    - `joinedGroups`: List of groups where the user is an active member.
    - `officialGroups`: List of instructor-led groups (`isOfficial=true`).
    - `trendingGroups`: Top-rated groups in the user's university.

---

## 3. Pending Implementation (Mobile UI)
The React Native app requires the following screens and updates:

### A. Study Hub Home
- **Feed Sections**: Implement the 3-section horizontal/vertical layout.
- **Vault Access**: Add "Personal Vault" and "Open Vault" navigation tiles.
- **Badges**: Integrate "FACULTY" and "ELITE" visual indicators on user profiles.

### B. Document Viewer & Paywall
- **Paywall Overlay**: Add a blur effect and "Upgrade to Elite" CTA for `isPremiumOnly` documents.
- **Storage Bar**: Implement a visual progress bar in the Personal Vault showing `%` of 100MB used.

### C. Study Group Interaction
- **Join/Leave Flow**: Connect the UI buttons to the new backend endpoints.
- **Group Chat**: Initialize the STOMP connection using the existing `stompService.ts`.

---

## 4. Development Standards
- **Storage**: Always use `Long` for file sizes (stored in bytes) to prevent floating-point errors.
- **Security**: Never expose the full S3 URL; always use presigned URIs via `Utils.java`.
- **Environment**: Mobile uses `__DEV__` to toggle between local IP (`192.168.18.40`) and production.
