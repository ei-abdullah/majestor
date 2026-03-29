# Majestor: Study Hub Technical Specification (v1.0)

## 1. Feature Overview
The Study Hub is a real-time academic marketplace and collaboration center designed for university students and faculty. It combines context-aware document storage with course-specific study groups, all protected by strict institutional isolation and a "Freemium" monetization model.

---

## 2. Monetization & Tier-Based Constraints
The system operates on three distinct tiers: **Free Student**, **Faculty**, and **Elite (Premium)**.

| Feature | Free Student | Faculty (`isFaculty=true`) | Elite (Subscription) |
| :--- | :--- | :--- | :--- |
| **Personal Vault** | 100 MB Limit | 500 MB Limit | 5 GB Limit |
| **Study Group Creation** | Max 1 Group | Unlimited | Unlimited |
| **Study Group Joins** | Max 1 Group | Unlimited | Unlimited |
| **Document Visibility** | Public/Personal | **Premium-by-Default** | Public/Personal |
| **Access Control** | Limited to Free Content | Unlimited Access | Unlimited Access |

---

## 3. Data Architecture (Backend)

### Core Entities
1. **User**: Tracks `storageUsed`, `storageLimit`, `isFaculty`, and `premiumUntil`.
2. **Document**:
    - **Destination**: `PERSONAL_VAULT`, `PUBLIC_VAULT`, `STUDY_GROUP`.
    - **isPremiumOnly**: Boolean flag (True for Faculty uploads by default).
    - **totalFileSize**: Stored in bytes (`Long`).
3. **StudyGroup**: Courses-specific groups with an `isOfficial` flag for Faculty-led groups.
4. **StudyGroupMember**: Junction table tracking `joinedAt` and `leftAt`.
5. **Course/Faculty/University**: The hierarchical backbone for isolation.

### Institutional Isolation Logic
- **Rule**: Users can only see/join content where `Content.Faculty.University == User.Faculty.University`.
- **Query Strategy**: Filter all `GET` requests by `user.faculty.id`.

---

## 4. Document Storage & Quota Rules
Storage is only calculated and enforced under specific conditions:
1. **Quota Consumption**: Only uploads to `PERSONAL_VAULT` increment `user.storageUsed`.
2. **Quota Check**: Before upload, verify `(user.storageUsed + incomingFiles.size) <= user.storageLimit`.
3. **Public/Group Uploads**: Documents uploaded to the `PUBLIC_VAULT` or a `STUDY_GROUP` do **not** count towards the user's personal storage limit.

---

## 5. Study Group Business Logic
1. **Official Status**: Only users with the `FACULTY` role or `isFaculty=true` can create "Official" groups.
2. **The "Join" Limit**: 
    - Free students are blocked from joining a group if `ActiveMemberships >= 1`.
    - Elite and Faculty bypass this check.
3. **Ratings**: Users can rate study groups (1-5 stars) to influence the `popularityScore` used for the "Trending" feed.

---

## 6. Planned API Endpoints

### Documents (`/api/v1/document`)
- `POST /uploadDocument/{userId}`: Handles multi-part uploads with quota enforcement.
- `GET /downloadDocument/{userId}/{documentId}`: Includes `validateAccess` check for Premium content.
- `GET /getAllDocuments/{userId}`: Returns filtered feed based on Faculty/Course/Search.

### Study Hub (`/api/v1/study-hub`) [TODO]
- `GET /feed`: Returns `Joined`, `Official`, and `Trending` groups.
- `POST /groups/create`: Creates a group (checks creation limits).
- `POST /groups/{id}/join`: Joins a group (checks join limits).
- `GET /groups/{id}/vault`: Fetches all documents associated with a specific study group.

---

## 7. Mobile UI Requirements
The frontend reuses existing NativeWind components with a focus on:
- **Visual Cues**: "FACULTY" and "ELITE" badges on user profiles.
- **Paywall**: A blurred "Premium Content" overlay with an "Upgrade to Elite" CTA.
- **Dynamic Hints**: Signup form shows allowed email domains based on selected university.
- **Real-time Chat**: STOMP/WebSocket integration for Study Group messaging.

---

## 8. Development State
- [x] **Database Modeling**: Sequential IDs, Byte-based storage, Nullable relationships.
- [x] **Entity Refactoring**: `User`, `Document`, `StudyGroup` updated.
- [x] **Utility Logic**: `Utils.java` updated with correct 100MB/500MB/5GB constants.
- [x] **Storage Tracking**: Implemented in `DocumentService`.
- [ ] **Study Hub Logic**: Repositories and Services pending (Join/Create limits).
- [ ] **Mobile Integration**: Navigation and new screens (Hub, Create, Paywall).
