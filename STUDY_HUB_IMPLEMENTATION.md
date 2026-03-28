# Majestor Study Hub: Implementation Guide

This document maps your **current implementation** to the new **Study Hub** model.

---

## 1. The "Faculty Feed" (Currently `Document.tsx`)
This screen moves from being a generic list to a scoped "Search Engine" for your specific Faculty.

### ✅ What Stays:
*   **Search Bar:** Keep the existing search logic.
*   **Filters:** Keep Year, Type, and Sort filters.
*   **Component:** Continue using `DocumentList.tsx`.

### 🛠️ What Changes:
*   **Visual Context:** Each `DocumentCard` must now display its source (e.g., *"From: Algorithms Group"* or *"From: Public Feed"*).
*   **Role Check:** The "View" button should check if the doc is `isPremiumOnly` and if the user is `Elite`.

---

## 2. The "Contextual Upload" (Currently `UploadDocument.tsx`)
The upload flow becomes smarter by knowing "where" the file is going.

### ✅ What Stays:
*   **Image Upload:** The `ImageCarousel` and `ImageUpload` logic.
*   **Core Details:** Title, Type, Semester, and Year.

### 🛠️ What Changes:
*   **Destination Picker (New):** A new dropdown/toggle:
    *   `STUDY_GROUP`: Links the file to a specific course group (Default).
    *   `FACULTY_FEED`: Makes the file public to the whole faculty.
    *   `PERSONAL_VAULT`: Keeps the file private (Only the uploader sees it).
*   **Course Logic:** The `courseId` is currently `@NotNull`. We must make it optional if the user selects `PERSONAL_VAULT`.
*   **Monetization Logic:** If the uploader has `isFaculty = true`, the system should default the document to `isPremiumOnly = true`.

---

## 3. The New Components (To be created)
These features do not exist in your current code and must be built from scratch.

### 🆕 `StudyGroup` Module:
*   **StudyHubHome:** A horizontal scrolling list of Faculty Groups and a vertical list of Peer Groups.
*   **StudyGroupDetails:** A screen containing a real-time Chat tab and a Vault (Document list) tab.

---

## 4. Database & API Requirements (The "Surgery")

### `Course` Entity
*   Add `String code` (e.g., "CS101").
*   Add `Long universityId` and `Long facultyId` (to ensure courses are scoped to the institution).

### `Document` Entity
*   Add `Long studyGroupId` (nullable).
*   Add `Boolean isPremiumOnly` (default false).
*   Add `String destination` (Enum: `GROUP`, `FEED`, `PRIVATE`).

### `StudyGroup` Entity (New)
*   `String name`
*   `Long courseId`
*   `Long creatorId`
*   `Boolean isOfficial` (derived from creator status).
*   `Integer popularityScore`.

---

## 5. Implementation Order (Recommended)
1.  **Backend:** Update `Course` entity (Add code and scope).
2.  **Backend:** Update `Document` entity (Add group link and premium flag).
3.  **Backend:** Create `StudyGroup` entity and CRUD services.
4.  **Mobile:** Update `UploadDocument.tsx` with the new Destination logic.
5.  **Mobile:** Transform `Document.tsx` into the Scoped Faculty Feed.
6.  **Mobile:** Build the new `StudyGroup` Hub.
