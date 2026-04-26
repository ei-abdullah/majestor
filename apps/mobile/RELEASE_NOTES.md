# Release Notes — Majestor Mobile

History of Google Play Store releases. Newest at the top.

---

## v1.0.0 — Initial Release

- **Release date:** 2026-04-25
- **Status:** Drafted
- **versionCode:** 1
- **versionName:** 1.0.0

### Release name (Play Store field — max 50 characters)

```
1.0.0 – Welcome to Majestor
```

### What's new (Play Store release notes — max 500 characters per locale)

```
Welcome to Majestor – your campus life, unified.

This is our first release. What's inside:

• Carpool: post or book rides with verified students from your university
• Study Hub: share past papers, notes, and assignments
• Study Groups: create or join groups and chat in real time
• Direct messaging with classmates and drivers
• Push notifications for bookings, invites, and group activity

Sign up with your university email to get started.
```

---

## Reference — other Play Store fields you'll need to fill in

These don't change every release but are easy to forget. Keep them here so they're versioned.

### App name (max 30 characters)
```
Majestor
```

### Short description (max 80 characters)
```
Carpool, share notes, and join study groups with verified students.
```

### Full description (max 4000 characters)
```
Majestor brings everything you need as a university student into one place.

CARPOOL
Find a ride to campus or share yours with classmates. Post a ride with your route, available seats, and fare — or book a seat on someone else's. Chat directly with the driver, track ride requests, and split costs fairly. Every user is a verified student from your university, so you always know who you're sharing the ride with.

STUDY HUB
Share past papers, lecture notes, assignments, projects, and reports with your peers. Browse a personal vault of your own uploads, or open the public library to find resources from across your university. Filter by course, document type, semester, and year to find exactly what you need.

STUDY GROUPS
Create or join study groups for your courses. Group chat is built in and runs in real time, so you can ask quick questions, share files, and coordinate study sessions. Invite classmates by username, mark groups as public or private, and discover trending groups at your university.

DIRECT MESSAGING
One-on-one chat with ride partners and group chat for study groups, all powered by WebSockets for instant delivery.

SMART NOTIFICATIONS
Get notified when someone books your ride, invites you to a study group, or sends you a message. Stay on top of campus life without checking the app constantly.

UNIVERSITY VERIFIED
Sign up only with your university email. Every student is verified, so the community stays trusted.

Built for students, by students.
```

---

## Template for future releases

Copy this block, paste it above v1.0.0, and fill in.

```markdown
## vX.Y.Z — <short title>

- **Release date:** YYYY-MM-DD
- **Status:** Drafted | Submitted | Live | Halted
- **versionCode:** N
- **versionName:** X.Y.Z

### Release name (max 50 characters)
\`\`\`
X.Y.Z – <short title>
\`\`\`

### What's new (max 500 characters per locale)
\`\`\`
What's new in this version:

• <feature or fix 1>
• <feature or fix 2>
• <feature or fix 3>

<Optional 1-line outro: "Thanks for using Majestor!" / etc.>
\`\`\`

### Notes for the team
- <internal notes — not shown to users>
```

---

## Style guide for release notes

Keep these consistent across versions so users learn the pattern.

- **Lead with user value, not internals.** "Faster ride loading" beats "Optimized React Query cache."
- **Bullets, not paragraphs.** Users scan; they don't read.
- **Verb-first bullets.** "Added", "Fixed", "Improved", "Removed".
- **One feature per bullet.** Don't bundle.
- **No version numbers in the bullets.** The release name already has it.
- **Avoid em-dashes (—).** They render as a question mark in some Play Store locales. Use a hyphen (-) or "and" instead. (Notice the release name uses an en-dash – which is safe.)
- **Don't mention bugs that were never user-visible.** "Fixed crash on profile load" is fine; "Fixed unused import in stompService" is not.
- **Stay under 500 characters.** Play Store cuts the rest off.