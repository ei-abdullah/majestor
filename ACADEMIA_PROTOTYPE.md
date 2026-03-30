# Majestor Academia Study Hub - Visual Prototype (v2.2)

This prototype reflects the final design and **API Integration Map** for the Majestor Academia ecosystem.

---

## 📡 0. Global API Integration Map
| Action | Method | Endpoint |
| :--- | :--- | :--- |
| **Hub Feed** | `POST` | `/api/v1/study-hub/feed/{userId}` |
| **Vault Docs** | `GET` | `/api/v1/document/vault/{userId}?destination={VAULT_TYPE}` |
| **Group Detail** | `GET` | `/api/v1/studygroup/details/{groupId}/{userId}` |
| **Upload Doc** | `POST` | `/api/v1/document/uploadDocument/{userId}` |
| **Create Group** | `POST` | `/api/v1/studygroup/create-group/{userId}` |
| **Join Group** | `POST` | `/api/v1/studygroup/join-group/{groupId}/{userId}` |
| **Rate Group** | `PATCH` | `/api/v1/studygroup/rate/{groupId}/{userId}` |

---

## 📱 1. Study Hub Home (Main Entry)
The central directory for all course-based communities in your Faculty.

**API Integration:** 
*   **Call:** `POST /api/v1/study-hub/feed/{userId}`
*   **Logic:** Aggregates `joinedGroups`, `officialGroups`, and `trendingGroups` (sorted by `Double popularityScore`).

```text
__________________________________________________________
|  [🔍 Search courses or groups...]                     |
|________________________________________________________|
|                                                        |
|  👥 JOINED GROUPS                                      |
|  ____________________________________________________  |
|  | [📚 CS101] | [💻 CS302] | [📂 VIEW ALL ] <---------|-- (Swipe to End)
|  | Intro Prg. | Databases  | (Full List)  |           |
|  |____________|____________|______________|           |
|                                                        |
|  🌟 OFFICIAL FACULTY GROUPS                            |
|  ____________________________________________________  |
|  | [🎓 CS101] | [🎓 MT204] | [🎓 VIEW ALL ] <---------|-- (Swipe to End)
|  | Dr. Ahmed  | Calculus   | (Full List)  |           |
|  |____________|____________|______________|           |
|                                                        |
|  🔥 TRENDING PEER GROUPS                               |
|  ____________________________________________________  |
|  | 👥 Algorithm Masters [CS301]          [ 🟢 5 LIVE ] |
|  | By: Murat | 📄 42 docs | ⭐ 4.9                     |
|  |____________________________________________________|
|                                                        |
|  [ VIEW ALL TRENDING ]                                 |
|                                                        |
|  ________________________    ________________________  |
|  |      📁 PERSONAL      |    |       🔓 OPEN        |  |
|  |         VAULT         |    |        VAULT         |  |
|  |______________________|    |______________________|  |
|                                                        |
|  [ + CREATE NEW GROUP ] <-- (Free: 1/1 | Elite: ∞)     |
|________________________________________________________|
```
**Description:** The primary Academia tab. Navigation is optimized via horizontal "End of Scroll" buttons for Joined and Official groups. The bottom row serves as the gateway to the Vault ecosystem.

---

## 📱 2. Study Group Details (The "Classroom")
The social and academic heart of a specific course.

**API Integration:**
*   **Call:** `GET /api/v1/studygroup/details/{groupId}/{userId}`
*   **Teaser Logic:** If `isCurrentUserMember` is `false`, only 3 documents are visible (`isPreview: true`). Joining unlocks the full `documents[]` array.

```text
__________________________________________________________
|  < [ CS101 - Dr. Ahmed ]                 [ 👥 124 ]    |
|________________________________________________________|
|  HOST: Dr. Ahmed (Faculty)                             |
|________________________________________________________|
|   [ 💬 CHAT ]    [ ✅ JOINED ]    [ 📄 15 DOCS ]       |
|________________________________________________________|
|                                                        |
|  FILTER: [Past Papers] [Lectures] [Notes] [Reset]      |
|________________________________________________________|
|                                                        |
|  📄 Midterm_CheatSheet.pdf                             |
|     (Uploaded by: Dr. Ahmed)        [ 🔒 PREMIUM ]     |
|  ____________________________________________________  |
|  📄 Lab_Exercise_1.pdf                                 |
|     (Uploaded by: Murat)            [ 📥 DOWNLOAD ]    |
|                                                        |
|  [ 📤 UPLOAD TO GROUP ] <-- (Passes GroupID as Prop)   |
|________________________________________________________|
```

---

## 📱 6. Closed (Personal) Vault
Private cloud storage for every student.

**API Integration:**
*   **Call:** `GET /api/v1/document/vault/{userId}?destination=PERSONAL_VAULT`
*   **Quota Logic:** Displays `user.storageUsed` vs `user.storageLimit`. Enforced during `uploadDocument` calls.

```text
__________________________________________________________
|  [ 📁 MY PERSONAL VAULT ]                              |
|________________________________________________________|
|                                                        |
|  STORAGE USED:                                         |
|  [██████████░░░░] 72% Used                             |
|  ( 72 MB / 100 MB )                                    |
|________________________________________________________|
|                                                        |
|  📄 Lab_Report_Draft.docx                              |
|     [ 📤 SHARE ] [ 🗑️ DELETE ]                         |
|________________________________________________________|
```

---

## 📱 7. Open Vault (Faculty Feed)
The public "Commons" where the community shares resources.

**API Integration:**
*   **Call:** `GET /api/v1/document/vault/{userId}?destination=PUBLIC_VAULT`
*   **Filters:** Supports `searchQuery`, `year`, `docType`, and `sortByLikes`.

```text
__________________________________________________________
|  [ 🔓 FACULTY OPEN VAULT ]                             |
|________________________________________________________|
|  [🔍 Search all public resources... ]                  |
|________________________________________________________|
|                                                        |
|  📄 Integration_Hacks.pdf                              |
|     From: [Calculus II Group]       [ 📥 DOWNLOAD ]    |
|________________________________________________________|
```

---

## 📱 8. Upload Document (Context-Aware)
The intelligent gateway for adding content.

**API Integration:**
*   **Call:** `POST /api/v1/document/uploadDocument/{userId}`
*   **Payload:** `multipart/form-data` containing `destination` (Enum) and file array.

```text
__________________________________________________________
|  X CANCEL            [ 📤 UPLOAD ]                    |
|________________________________________________________|
|                                                        |
|  UPLOAD DESTINATION:                                   |
|  [ PRIVATE ] [ PUBLIC ] [ STUDY GROUP ]                |
|                                                        |
|  IF GROUP:                                             |
|  [ Select Group: Algorithms A (Auto-Selected) ]        |
|                                                        |
|  [ ✅ ] Mark as Premium Only (Elite Access)            |
|        (Checked by default)                            |
|                                                        |
|  [         CONFIRM & UPLOAD         ]                  |
|________________________________________________________|
```
