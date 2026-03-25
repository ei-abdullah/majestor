# Majestor Academia Study Hub - Feature Prototype

This document outlines the visual structure and user flow for the new "Study Hub" feature, integrating real-time study groups, faculty content, and monetization.

---

## 1. The Study Hub (Main Feed)
The entry point for students. Official groups are course-specific and identified by the creator's `isFaculty` status.

```text
__________________________________________________________
|  [🔍 Search courses, codes, or groups...]             |
|________________________________________________________|
|                                                        |
|  🌟 OFFICIAL FACULTY GROUPS (Course-Specific)         |
|  ____________________________________________________  |
|  | [🎓 CS101]          | [🎓 CS302]          | [🎓.. |
|  | Intro to Computing  | Database Systems    |       |
|  | By: Dr. Ahmed       | By: Dr. Ahmed       |       |
|  | 👥 124 | 📄 15      | 👥 45 | 📄 12       |       |
|  |____________________|____________________|_______|  |
|                                                        |
|  🔥 TRENDING PEER GROUPS                               |
|  ____________________________________________________  |
|  | 👥 Algorithm Masters [CS301]          [ 🟢 5 LIVE ] |
|  | Shared by: Murat | 📄 42 docs | ⭐ 4.9             |
|  |____________________________________________________|
|  ____________________________________________________  |
|  | 👥 Physics Study Squad [PH102]        [ 🟢 2 LIVE ] |
|  | Shared by: Sara  | 📄 12 docs | ⭐ 4.5             |
|  |____________________________________________________|
|                                                        |
|  [ + CREATE NEW GROUP ] <-- (Free: 1/1 | Elite: ∞)     |
|________________________________________________________|
```
**Description:** This is the primary dashboard for the Academia side of the app. It acts as a directory for all **Study Groups** available within the user's Faculty. Official groups (created by users where `isFaculty = true`) are featured at the top, while student-led groups are ranked by real-time popularity below.

---

## 2. Study Group Details (The "Vault" & Chat)
Each group contains a dedicated space for document sharing ("The Vault") and real-time discussion.

```text
__________________________________________________________
|  < [ CS101 - Dr. Ahmed ]                 [ 👥 124 ]    |
|________________________________________________________|
|   [ CHAT ]    [[ 📄 VAULT ]]    [ 📊 STATS ]           |
|________________________________________________________|
|                                                        |
|  📂 FOLDERS: [Past Papers] [Lectures] [Assignments]    |
|                                                        |
|  📄 Midterm_CheatSheet.pdf                             |
|     (Uploaded by: Dr. Ahmed)        [ 🔒 PREMIUM ]     |  <-- Locked Access
|  ____________________________________________________  |
|  📄 OS_Notes_Solved.pdf                                |
|     (Uploaded by: Murat)            [ 📥 DOWNLOAD ]    |  <-- Free Access
|  ____________________________________________________  |
|  📄 Chapter_5_Review.pdf                               |
|     (Uploaded by: Dr. Ahmed)        [ 🔒 PREMIUM ]     |
|                                                        |
|  [ 📤 UPLOAD DOCUMENT ] <-- (Free for everyone!)       |
|________________________________________________________|
```
**Description:** This is the "Classroom" view. Once a user joins a group, they gain access to a real-time Chat for peer-to-peer discussion and a **Vault** (a course-specific library). The Vault organizes files into folders. Access to specific files is determined by the uploader's status: Faculty-uploaded documents are exclusive to Premium users.

---

## 3. Subscription & Paywall (Majestor Elite)
Triggered when a free user reaches a group limit or attempts to access faculty content.

```text
__________________________________________________________
|                                                        |
|               ✨ UNLOCK MAJESTOR ELITE ✨              |
|                                                        |
|          [ 🔒 ] This document is protected.            |
|       It was verified by Faculty: Dr. Ahmed            |
|                                                        |
|   Join 500+ students getting better grades with:       |
|                                                        |
|   ✅ Unlimited Study Groups (Currently: 3/3)           |
|   ✅ Full Access to Faculty Vaults                    |
|   ✅ Real-time Audio Study Huddles                    |
|   ✅ AI-Powered Exam Summaries                        |
|                                                        |
|   [     BECOME ELITE - $4.99/mo     ]                  |
|          (Cancel anytime)                              |
|________________________________________________________|
```
**Description:** A high-conversion modal that appears when a user hits a functional wall (e.g., reaching the 3-group limit or clicking a locked Faculty document). it highlights the benefits of the "Majestor Elite" tier to incentivize upgrades.

---

## 4. The Faculty Feed (Locked Institutional View)
A discovery engine for all academic content within the user's University and Faculty.

```text
__________________________________________________________
|  [ 🏛️ [User's University] - [User's Faculty] ]        |
|________________________________________________________|
|  [🔍 Search documents in your faculty... ]             |
|________________________________________________________|
|                                                        |
|  RECENT DOCUMENTS IN YOUR FACULTY                      |
|  ____________________________________________________  |
|  📄 Calc_Integration_Hacks.pdf                         |
|     Group: [MT102 - Calculus]       [ 👀 VIEW ]        |
|  ____________________________________________________  |
|  📄 Resume_Template_CS.docx                            |
|     Group: [Career & Internships]   [ 👀 VIEW ]        |
|  ____________________________________________________  |
|                                                        |
|  [ 💡 Suggested: Join "CS201" to see 50 more docs ]    |
|________________________________________________________|
```
**Description:** This screen provides a "Discovery" experience. Unlike the Study Hub (which focuses on Groups), the Faculty Feed focuses on **Documents**. It allows users to search and browse *every* public document recently uploaded across their entire Faculty, regardless of which group it belongs to. Access is strictly limited to the user's own institution.

---

## 5. The Upload Document Flow
A context-aware screen that allows users to pick where their data lives.

```text
__________________________________________________________
|  X CANCEL            [ 📤 UPLOAD ]                    |
|________________________________________________________|
|                                                        |
|  [ 📑 SELECT FILE ] -> "My_Lecture_Notes.pdf"          |
|                                                        |
|  WHERE TO UPLOAD?                                      |
|  ( ) Personal Vault (Private - Only you see it)        |
|  (•) Study Group: [ CS101 - Intro to Computing ]       |
|  ( ) Faculty Feed (Public - Only your Faculty sees it) |
|                                                        |
|  ADD TAGS: [#Notes] [#Midterm] [#Important]            |
|                                                        |
|  [         CONFIRM & UPLOAD TO GROUP         ]         |
|________________________________________________________|
```
**Description:** The centralized upload interface. It is "context-aware," meaning it knows which groups the user belongs to. Users can choose to keep a file private (Personal Vault), share it with a specific Course Group, or post it to the general Faculty Feed for everyone in their department to see.

---

## 6. User's Personal Vault (My Docs)
The private workspace for documents not yet shared with a group.

```text
__________________________________________________________
|  [ 👤 MY PROFILE ]                                     |
|________________________________________________________|
|   [ My Rides ]    [[ 📁 MY VAULT ]]    [ My Stats ]    |
|________________________________________________________|
|                                                        |
|  📊 STORAGE: [||||||||||----------] 50% (Free Tier)    |
|                                                        |
|  📁 Unsorted Uploads (4)                               |
|  📁 Scanned Assignments (2)                            |
|                                                        |
|  📄 My_Draft_Notes.pdf                                 |
|     [ 📤 SHARE TO GROUP ]    [ 🗑️ DELETE ]            |
|                                                        |
|  ✨ [ Upgrade to Elite for unlimited storage ]         |
|________________________________________________________|
```
**Description:** Located within the user's profile, this is a private "Cloud Drive." It stores documents that the user has uploaded but hasn't yet shared with the community. It uses a storage-limit model (e.g., 100MB for free users) to drive subscriptions.

---

## 7. Feature Summary & Monetization Logic

| Feature | Free Student | Faculty Member | Majestor Elite (Premium) |
| :--- | :--- | :--- | :--- |
| **Visibility Scope** | **Locked (Uni & Faculty)** | **Locked (Uni & Faculty)** | **Locked (Uni & Faculty)** |
| **Group Creation** | Limit: 1 Group | **Unlimited** | **Unlimited** |
| **Group Joining** | Limit: 3 Groups | **Unlimited** | **Unlimited** |
| **Faculty Documents**| Preview Only | Full Access | Full Access |
| **Personal Storage** | 100MB Limit | 500MB Limit | 5GB + Folders |

---

## 8. Technical Requirements (Architecture)

1.  **Backend (JPA/Spring)**:
    -   **Strict Multi-Tenancy**: All `StudyGroup` and `Document` queries MUST be filtered by the `universityId` and `facultyId` of the authenticated user.
    -   **StudyGroup Entity**: 
        -   `courseId`: Link to specific Course.
        -   `creatorId`: Link to the `User` who created it.
        -   `isOfficial`: Boolean (Derived logic: True if `creator.isFaculty == true`).
        -   `popularityScore`, `courseCode`.
    -   **SubscriptionService**: To track user tier (`FREE`, `ELITE`).
    -   **Document Entity**: Add `studyGroupId` and `isPremiumOnly` flag.
2.  **Real-Time (STOMP)**:
    -   WebSocket topics for "Studying Now" presence and live document sync events.
3.  **Mobile (React Native)**:
    -   Conditional rendering of download buttons vs. lock icons.
    -   Animated "Elite Upgrade" modals.
