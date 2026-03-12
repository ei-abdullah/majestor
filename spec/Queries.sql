# Majestor - Useful PostgreSQL Queries

---

## 👥 All Users (with university & faculty)
```sql
SELECT
    u.id,
    u.username,
    u.email,
    u.phone,
    u.personal_email,
    u.has_onboarded,
    u.is_verified,
    un.name  AS university,
    f.name   AS faculty,
    u.created_at
FROM users u
LEFT JOIN universities un ON u.university_id = un.id
LEFT JOIN faculties f     ON u.faculty_id = f.id
ORDER BY u.id DESC;
```

---

## 🚗 Users Who Posted Rides
```sql
SELECT DISTINCT
    u.id,
    u.username,
    u.email,
    COUNT(r.id) AS total_rides_posted
FROM users u
INNER JOIN rides r ON r.ride_poster_id = u.id
GROUP BY u.id, u.username, u.email
ORDER BY total_rides_posted DESC;
```

---

## 🎒 Users Who Booked a Ride (via ride_requests + bookings)
```sql
SELECT DISTINCT
    u.id,
    u.username,
    u.email,
    COUNT(b.id) AS total_bookings
FROM users u
INNER JOIN ride_requests rr ON rr.ride_requester_id = u.id
INNER JOIN bookings b       ON b.booked_ride_request = rr.id
GROUP BY u.id, u.username, u.email
ORDER BY total_bookings DESC;
```

---

## 📄 Users Who Uploaded Documents
```sql
SELECT DISTINCT
    u.id,
    u.username,
    u.email,
    COUNT(d.id) AS total_documents_uploaded
FROM users u
INNER JOIN documents d ON d.uploader_id = u.id
GROUP BY u.id, u.username, u.email
ORDER BY total_documents_uploaded DESC;
```

---

## ❤️ Users Who Liked Documents
```sql
SELECT DISTINCT
    u.id,
    u.username,
    u.email,
    COUNT(l.id) AS total_likes_given
FROM users u
INNER JOIN likes l ON l.user_id = u.id
GROUP BY u.id, u.username, u.email
ORDER BY total_likes_given DESC;
```

---

## 📊 Full User Activity Summary
```sql
SELECT
    u.id,
    u.username,
    u.email,
    u.is_verified,
    COUNT(DISTINCT r.id)   AS rides_posted,
    COUNT(DISTINCT rr.id)  AS ride_requests,
    COUNT(DISTINCT b.id)   AS bookings,
    COUNT(DISTINCT d.id)   AS documents_uploaded,
    COUNT(DISTINCT l.id)   AS likes_given
FROM users u
LEFT JOIN rides r          ON r.ride_poster_id = u.id
LEFT JOIN ride_requests rr ON rr.ride_requester_id = u.id
LEFT JOIN bookings b       ON b.booked_ride_request = rr.id
LEFT JOIN documents d      ON d.uploader_id = u.id
LEFT JOIN likes l          ON l.user_id = u.id
GROUP BY u.id, u.username, u.email, u.is_verified
ORDER BY u.id DESC;
```

---

## 🗓️ Daily User Checkup — Who Was Active & What Did They Do Each Day
-- One row per user per day. Shows a summary of everything they did that day.
-- To filter a specific day, uncomment the WHERE clause and change the date.
```sql
SELECT
    activity_date,
    u.username,
    u.email,
    SUM(rides_posted)        AS rides_posted,
    SUM(ride_requests)       AS ride_requests,
    SUM(bookings)            AS bookings,
    SUM(documents_uploaded)  AS documents_uploaded,
    SUM(likes_given)         AS likes_given
FROM (

    SELECT
        ride_poster_id                                                    AS user_id,
        (created_at AT TIME ZONE 'Asia/Karachi')::date                   AS activity_date,
        1 AS rides_posted, 0 AS ride_requests, 0 AS bookings, 0 AS documents_uploaded, 0 AS likes_given
    FROM rides

    UNION ALL

    SELECT
        ride_requester_id,
        (created_at AT TIME ZONE 'Asia/Karachi')::date,
        0, 1, 0, 0, 0
    FROM ride_requests

    UNION ALL

    SELECT
        rr.ride_requester_id,
        (b.created_at AT TIME ZONE 'Asia/Karachi')::date,
        0, 0, 1, 0, 0
    FROM bookings b
    INNER JOIN ride_requests rr ON rr.id = b.booked_ride_request

    UNION ALL

    SELECT
        uploader_id,
        (created_at AT TIME ZONE 'Asia/Karachi')::date,
        0, 0, 0, 1, 0
    FROM documents

    UNION ALL

    SELECT
        l.user_id,
        (doc.created_at AT TIME ZONE 'Asia/Karachi')::date,
        0, 0, 0, 0, 1
    FROM likes l
    INNER JOIN documents doc ON doc.id = l.document_id

) AS activity
INNER JOIN users u ON u.id = activity.user_id
-- WHERE activity_date = CURRENT_DATE        -- today (PKT)
-- WHERE activity_date = '2026-03-11'        -- specific day
GROUP BY activity_date, u.id, u.username, u.email
ORDER BY activity_date DESC, u.username ASC;
```

---

## ✅ Active Users Today — Anyone Who Did Anything
-- Just names & emails of users who did at least one thing today.
-- Change CURRENT_DATE to any date e.g. '2026-03-10' for a specific day.
```sql
SELECT DISTINCT
    u.username,
    u.email
FROM users u
WHERE u.id IN (

    SELECT ride_poster_id FROM rides
    WHERE (created_at AT TIME ZONE 'Asia/Karachi')::date = CURRENT_DATE

    UNION

    SELECT ride_requester_id FROM ride_requests
    WHERE (created_at AT TIME ZONE 'Asia/Karachi')::date = CURRENT_DATE

    UNION

    SELECT rr.ride_requester_id FROM bookings b
    INNER JOIN ride_requests rr ON rr.id = b.booked_ride_request
    WHERE (b.created_at AT TIME ZONE 'Asia/Karachi')::date = CURRENT_DATE

    UNION

    SELECT uploader_id FROM documents
    WHERE (created_at AT TIME ZONE 'Asia/Karachi')::date = CURRENT_DATE

    UNION

    SELECT user_id FROM likes
    WHERE (created_at AT TIME ZONE 'Asia/Karachi')::date = CURRENT_DATE

)
ORDER BY u.username ASC;
```
