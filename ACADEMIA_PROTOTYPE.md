# Majestor Academia Study Hub - Visual Prototype (v2.1)

This prototype reflects the final design specifications for the Majestor Academia ecosystem.

---

## 📱 1. Study Hub Home (Main Entry)
The central directory for all course-based communities in your Faculty.

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
**Description:** The detailed view for a group. It acts as a dashboard for accessing the Group Chat and the Document Vault.

---

## 📱 3. Group Chat (Real-Time Communication)
The interactive layer where students and faculty collaborate.

```text
__________________________________________________________
|  < [ CS101 CHAT ]                        [ 🟢 12 ]    |
|________________________________________________________|
|                                                        |
|  [📄 Dr. Ahmed shared 'Lab_1.pdf']                     |
|                                                        |
|  (Avatar) Murat: Yo, anyone solved Q3 yet?            |
|                                                        |
|  (Avatar) Sara: Yea, check the Vault, just uploaded it!|
|                                                        |
|  (Avatar) Dr. Ahmed: Make sure to follow the rubric.   |
|                                                        |
|  [ 🖊️ Murat is typing... ]                             |
|  ____________________________________________________  |
|  [ 😃 ] [ Type a message...             ] [ 📎 ] [ 🎤 ] |
|________________________________________________________|
```
**Description:** A dedicated messaging interface for each group. Powered by WebSockets, it features real-time uploader alerts, typing indicators, and presence counts.

---

## 📱 4. Document Viewer (The Product)
High-fidelity viewing of academic resources.

```text
__________________________________________________________
|  X CLOSE      [ Midterm_Prep.pdf ]      [ 📥 ] [ 💬 ] |
|________________________________________________________|
|                                                        |
|  ____________________________________________________  |
|  |                                                  |  |
|  |                  [ PAGE 1 / 15 ]                 |  |
|  |                                                  |  |
|  |             ( Document Image View )              |  |
|  |                                                  |  |
|  |__________________________________________________|  |
|                                                        |
|  [ < PREV ]          [ SYNC SCROLL ]          [ NEXT > ]|
|________________________________________________________|
```
**Description:** The final destination for documents. It renders the `DocumentImage` list as a swipeable gallery. Includes specialized tools like "Sync Scroll" for real-time collaborative review.

---

## 📱 5. Create Study Group
The starting point for a new community.

```text
__________________________________________________________
|  X CANCEL            [ ✅ CREATE ]                    |
|________________________________________________________|
|                                                        |
|  GROUP NAME:                                           |
|  [ "Murat's Study Squad" ]                             |
|                                                        |
|  GROUP EMOJI: [ 📚 ] [ 💻 ] [ 🧠 ] [ ⚡ ]              |
|                                                        |
|  LINK TO COURSE:                                       |
|  [ 🔍 Search Course Name (e.g. Algorithms) ]           |
|                                                        |
|  VISIBILITY:                                           |
|  (•) Public (Visible on Hub)                           |
|  ( ) Private (Invite Only)                             |
|                                                        |
|  [        START STUDY GROUP        ]                   |
|________________________________________________________|
```

---

## 📱 6. Closed (Personal) Vault
Private cloud storage for every student.

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

---

## 📱 9. Elite Paywall (The Upsell)
Triggered by limits or locked content.

```text
__________________________________________________________
|                                                        |
|               ✨ UNLOCK MAJESTOR ELITE ✨              |
|                                                        |
|   Join Majestor Elite to unlock:                       |
|                                                        |
|   ✅ Unlimited Study Groups                            |
|   ✅ Full Access to Faculty Documents                  |
|   ✅ 5GB Personal Cloud Storage                        |
|   ✅ Real-time Voice Study Huddles                     |
|                                                        |
|   [     BECOME ELITE - $4.99/mo     ]                  |
|________________________________________________________|
```
