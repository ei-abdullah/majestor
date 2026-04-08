# Majestor: Feature Improvement Roadmap

This document outlines the proposed technical and functional improvements for the **Carpool** and **Study Hub** modules based on the current codebase implementation.

---

## 🚗 Carpool Feature Improvements

### 1. Proximity-Based Ranking (Priority)
*   **Backend:** Implement the **Haversine Formula** in `RideService` to calculate distances between the passenger's pickup coordinates and the driver's start location.
*   **API:** Update `GET /recentRides` to accept `pickupLat` and `pickupLng` as optional parameters.
*   **Ranking Logic:** Sort rides by: 
    1. **Premium Status** (Elite posters first).
    2. **Proximity** (Closest pickup first).
    3. **Recency** (Newest first).

### 2. Destination-Aware Matching
*   **Problem:** Currently, passengers see all rides regardless of destination.
*   **Improvement:** Add a filter to only show rides where the driver's destination is within a specific radius (e.g., 3km) of the passenger's drop-off point.

### 3. Dynamic Seat Management
*   **Problem:** Rides are marked `ACCEPTED` and hidden after one booking, even if seats remain.
*   **Improvement:** Modify `BookingService` to decrement `availableSeats`. Keep the ride `ACTIVE` in listings until all seats are filled, enabling true multi-passenger carpooling.

### 4. Premium Integration (Elite Tier)
*   **Visuals:** Add "Elite" badges to ride cards for premium posters.
*   **Incentives:** Provide premium posters with lower platform fees (if applicable) or higher visibility in the feed.

### 5. Live GPS & Safety
*   **Tracking:** Use WebSockets (`stompService`) to broadcast the driver's live location to the passenger once a booking is accepted.
*   **Reputation:** Implement a post-ride **Rating & Review** system for both drivers and passengers to build trust.

### 6. Fare Standardization
*   **Problem:** Fares are currently hardcoded in the frontend.
*   **Improvement:** Move the fare calculation logic to the backend. This allows for dynamic pricing based on vehicle type (Car vs. Bike) and peak hours.

---

## 📚 Study Hub Feature Improvements

### 1. Advanced Search & Discovery
*   **Global Search:** Implement a search bar that queries documents across all accessible Study Groups and the Public Vault simultaneously.
*   **Group Discovery:** Add a search/filter feature for Study Groups by name, course code, or faculty, rather than relying solely on the "Trending" feed.

### 2. Document Lifecycle Management
*   **Edit/Delete:** Add functionality for users to delete their own documents or edit titles/descriptions after uploading.
*   **Reporting:** Implement a "Flag Content" system to report copyrighted, incorrect, or inappropriate materials for faculty/admin review.

### 3. Refined Popularity Algorithm
*   **Velocity Tracking:** Update the `popularityScore` in `StudyGroupService` to include a **Time-Decay** factor. This ensures that new, active groups can outrank old, stagnant groups that happen to have many members.

### 4. Engagement & Collaboration
*   **Document Comments:** Allow users to comment on specific documents to ask questions or provide corrections.
*   **Pinned Content:** Allow Study Group hosts to "pin" important documents or announcements to the top of the group view.

### 5. Quota & Tier Transparency
*   **Storage Meter:** Add a visual progress bar in the `PersonalVault.tsx` screen showing exactly how much of the 100MB/500MB/5GB limit is used.
*   **Proactive Limits:** Show a "Limit Reached" notice on the Study Hub home screen *before* a user tries to create a group, rather than throwing an error after they've filled out the form.

### 6. Contributor Analytics
*   **Gamification:** Show "Total Downloads" and "Total Likes" on a user's profile to incentivize high-quality academic contributions.

### 7. Cross-Disciplinary Groups
*   **Fluid Isolation:** Allow Study Groups to be associated with multiple faculties or marked as "University-Wide" for courses shared between departments (e.g., General Education or Basic Sciences).

---

## 🛠️ Cross-Module Enhancements
*   **Offline Support:** Integrate Push Notifications (FCM/Expo) so users receive alerts for Carpool bookings or Study Group messages even when the app is closed.
*   **Unified Premium View:** A dedicated "Elite Dashboard" where users can manage their subscription and see all their tier-based benefits across both modules.
