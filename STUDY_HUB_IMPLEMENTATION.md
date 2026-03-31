# Majestor Study Hub: Implementation Roadmap (v3.0)

This document tracks the technical execution and current state of the Study Hub feature.

---

## 1. ✅ Backend Architecture (COMPLETE)
The foundational data and logic layers are production-ready.

### Completed Tasks
- **Institutional Isolation**: All queries (Vaults, Feed, Groups) are strictly filtered by `facultyId`.
- **Freemium Enforcement**: 
    - 1 Joined Group limit for Free students.
    - 1 Created Group limit for Free students.
    - Storage quota (100MB/500MB/5GB) enforced on `PERSONAL_VAULT`.
- **The "Teaser" Model**: Non-members see exactly 3 documents in `GetGroupDetailsResponseDTO` with `isPreview: true`.
- **Vault Engine**: Unified parametric service handling Public vs. Private queries.
- **Popularity Logic**: Real-time decimal-accurate rating toggle (Likes/Members * 5).
- **Null Safety**: All mappers and filters handle documents with `null` courses (Private Vault items).

---

## 2. 📱 Mobile UI Implementation (NEXT PHASE)
The React Native app requires the following screens and updates:

### A. Study Hub Home (`StudyHubScreen.tsx`)
- **Feed Sections**: 
    - `joinedGroups` (Horizontal Scroll)
    - `officialGroups` (Horizontal Scroll)
    - `trendingGroups` (Vertical List with Popularity Stars)
- **Vault Entry**: Large "My Personal Vault" and "Faculty Open Vault" tiles.
- **Action**: Floating Action Button (FAB) for "Create Group".

### B. Vault Screens (`VaultFeedScreen.tsx`)
- **Generic Component**: Reusable screen that switches between `PERSONAL_VAULT` and `PUBLIC_VAULT` based on route params.
- **Filters**: Implementation of the `FiltersDTO` (Search, Year, DocType, Like Sorting).
- **Personal Metrics**: Display of the storage progress bar (Bytes to MB conversion).

### C. Study Group Detail (`StudyGroupDetailScreen.tsx`)
- **Teaser UI**: Render the first 3 documents with a "Join to See More" blur/overlay.
- **Interaction**: 
    - Join/Leave button logic.
    - Like/Rate toggle logic (Optimistic UI update).
    - Navigation to Group Chat.

### D. Document Interaction
- **Upload Flow**: Multipart/form-data integration with camera/gallery picker.
- **Viewer**: Presigned URI rendering and ZIP download trigger.

---

## 3. 📡 API Mapping (React Native Queries)
| Action | Hook/Query | Endpoint |
| :--- | :--- | :--- |
| **Get Feed** | `useStudyHubFeed` | `POST /api/v1/study-hub/feed/{userId}` |
| **Get Vault** | `useVaultDocuments` | `GET /api/v1/document/vault/{userId}` |
| **Get Group** | `useGroupDetails` | `GET /api/v1/studygroup/details/{groupId}/{userId}` |
| **Join/Leave** | `useGroupMembership` | `POST /join-group` | `PATCH /leave-group` |
| **Rate** | `useRateGroup` | `PATCH /api/v1/studygroup/rate/{groupId}/{userId}` |

---

## 4. Development Standards
- **Validation**: Intercept `402 Payment Required` errors to trigger the `EliteUpgradeModal`.
- **Optimization**: Use `react-query` for caching the Hub Feed to minimize redundant API calls.
- **Environment**: Ensure `__DEV__` points to `192.168.18.40:8080`.
