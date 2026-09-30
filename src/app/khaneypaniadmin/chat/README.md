# 💬 KhaneyPani Admin — Chat Feature

A real-time, **Firestore-backed** messaging system that enables two-way communication between admin users (web) and staff (Flutter mobile app). Both clients read and write the same Firestore documents.

---

## 📁 Directory Structure

```
chat/
├── page.tsx                  # Next.js route entry point (/khaneypaniadmin/chat)
├── components/
│   ├── ChatList.tsx           # Left-panel: searchable list of contacts + previews
│   └── ChatConversation.tsx   # Right-panel: message thread + compose box
├── hooks/
│   └── index.tsx              # All Firestore subscriptions and write helpers
├── pages/
│   ├── All.tsx                # Main layout: wires list ↔ conversation together
│   └── CommonPages.tsx        # Tab wrapper rendered by page.tsx
└── types/
    └── IChat.tsx              # Shared data models, converters, and pure helpers
```

---

## 🔥 Firestore Data Model

The schema is intentionally **identical to the Flutter app** so the web and mobile clients are in the same document space.

```
chatUsers/{appUserId}                        ← user directory (one per user)
chatThreads/{threadId}                       ← one thread per pair (summary)
chatThreads/{threadId}/messages/{messageId}  ← individual messages
```

### chatUsers (Directory)

| Field          | Type      | Description                                             |
|----------------|-----------|---------------------------------------------------------|
| id             | string    | JWT sub claim — the stable, app-wide user id            |
| name           | string    | Display name                                            |
| email          | string    | Used as a fallback key when matching staff roster rows  |
| role           | string    | khaneypaniadmin or staff role string                    |
| institutionId  | string    | Scopes the directory; defaults to "default"             |
| photoUrl       | string    | Avatar URL (empty on web today)                         |

### chatThreads (Thread Summary)

| Field                  | Type                        | Description                                    |
|------------------------|-----------------------------|------------------------------------------------|
| participants           | string[]                    | Exactly two user ids, sorted                   |
| lastMessage            | string                      | Denormalised preview text                       |
| lastMessageAt          | Timestamp                   | Used for ordering and unread detection          |
| lastMessageSenderId    | string                      | Sender of the last message                      |
| readAt                 | Record<userId, Timestamp>   | Per-user "last opened" stamps                   |

### messages (Sub-collection)

| Field          | Type        | Description                                                        |
|----------------|-------------|--------------------------------------------------------------------|
| text           | string      | Message body (max 2000 chars)                                      |
| senderId       | string      | Id of the author                                                   |
| sentAt         | Timestamp   | Client clock — used for ordering (never null in optimistic UI)     |
| serverSentAt   | Timestamp   | Server timestamp — stored as the trustworthy record                |

> **Why client clock?** serverTimestamp() resolves to null in the local Firestore cache snapshot,
> which would cause an optimistic message to sort to the wrong end of the list before the server
> acknowledgment arrives. Using Timestamp.now() keeps ordering stable. The Flutter client uses
> the same approach.

---

## 🏗️ Architecture & Data Flow

```
page.tsx
  └── CommonPages.tsx
        └── All.tsx (AllChat)
              ├── useChatIdentity        — reads JWT from localStorage
              ├── useRegisterChatUser    — upserts own chatUsers doc
              ├── useChatRoster          — merges directory + roster + threads
              │     ├── useChatDirectory  — onSnapshot: chatUsers
              │     ├── useChatThreads    — onSnapshot: chatThreads
              │     └── useGetAllStaff   — REST + React Query cache
              ├── ChatList               — left panel (contact list)
              └── ChatConversation       — right panel (message thread)
                    ├── useChatMessages  — onSnapshot: messages subcollection
                    ├── useSendMessage   — writeBatch: message + thread summary
                    └── useMarkRead      — setDoc merge: readAt stamp
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| Plain onSnapshot subscriptions (not React Query) | Firestore push model does not fit RQ request/response lifecycle |
| JWT sub as chat user id | userDetails.id (nameidentifier) is not guaranteed to equal sub; mismatched ids would put web and mobile in different thread address spaces |
| useSyncExternalStore for token reads | Reads localStorage during the first render — no extra paint, no flash |
| Deterministic thread id (a__b sorted) | Both clients compute the same doc path without a round-trip lookup |
| Batch write (message + thread summary) | Ensures the list preview is never out of sync with the actual last message |

---

## 🔑 Authentication & Firebase

Firebase is configured in src/lib/firebase.ts.

- The web app authenticates via **ASP.NET JWT** (not Firebase).
- Firestore rules require request.auth != null, so the client calls signInAnonymously() on every chat session via ensureSignedIn().
- The anonymous UID is **not** the app user id — identity travels as plain document fields (senderId, participants).

> **Future upgrade path:** A backend endpoint can mint a Firebase custom token (signInWithCustomToken)
> using the Admin SDK with uid = JWT sub. This enables participant-scoped Firestore security rules
> (already commented out in firestore.rules).

### Required Environment Variables

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Add these to your .env.local file and to Vercel project settings for deployed builds.
If they are missing, the chat page displays a clear configuration notice instead of throwing a runtime error.

---

## 🪝 Hooks Reference

All hooks live in hooks/index.tsx.

| Hook | Returns | Description |
|---|---|---|
| useChatIdentity() | ChatUser or null | Decodes the JWT from localStorage into a ChatUser |
| useRegisterChatUser(me) | void | Upserts the admin's entry in chatUsers on mount |
| useChatDirectory(me) | { directory, loading, error } | Live onSnapshot of all users in the same institution |
| useChatThreads(me) | Record<string, ChatThread> | Live onSnapshot of all threads this user participates in |
| useChatMessages(threadId) | { messages, loading } | Live onSnapshot of one thread's messages, oldest-first |
| useSendMessage() | { send, sending } | Atomic batch write: new message + thread summary update |
| useMarkRead() | (threadId, userId) => Promise | Stamps readAt to clear the unread indicator |
| useChatRoster(me) | { entries, threads, loading, error, isConfigured } | Merges directory + REST staff roster + threads into a sorted list |

---

## 🧩 Components Reference

### ChatList

The left panel. Shows a searchable list of contacts with:
- **Unread dot** — shown when the peer sent a message after the current user last opened the thread
- **Preview text** — last message or "No messages yet"
- **Timestamp** — relative: time (today), weekday (this week), short date (older)
- **Role badge** — Admin, Staff, or Invited (for not-yet-signed-in staff)
- Pending (not-yet-signed-in) rows are **disabled** and show a tooltip explaining why

### ChatConversation

The right panel. Shows a message thread with:
- **Date separators** — "Today", "Yesterday", or a date string between day groups
- **Message bubbles** — blue (mine) / white (theirs), with a Clock icon while pending
- **Compose box** — auto-clears on send; restores draft text if the send fails; Enter sends, Shift+Enter adds a newline
- **Character counter** — appears when within 200 chars of the 2000-char limit
- **Auto-scroll** — jumps to the newest message whenever the thread or its messages change
- **Mark-read** — stamps readAt as soon as there is at least one message in the open thread

---

## 🗂️ Contact List Merging (mergeChatRoster)

The chat list is built by combining two data sources:

1. **Firestore chatUsers** — users who have signed in (addressable by their JWT sub)
2. **REST staff roster** (useGetAllStaff) — the full team from the back-end API

Matching is done first by **id**, then by **email**. The result is sorted into three bands:

| Band | Criteria |
|---|---|
| 0 — Active | Has a thread; sorted by most recent message first |
| 1 — Contactable | In the directory but no thread yet; sorted alphabetically |
| 2 — Pending | On the staff roster but never signed in; shown but not clickable |

**Role visibility rules** (mirrored from the Flutter mergeChatRoster):
- An **admin** sees only non-admin (staff) rows
- A **staff member** sees all users (staff + admins)

---

## 🔒 Security Notes

- Firestore queries are scoped by institutionId — separate committees never see each other's contacts or threads.
- The MAX_MESSAGE_LENGTH constant (2000) is kept in sync with firestore.rules so a rejected write never surprises the user.
- Thread ids are validated by firestore.rules: the document id must equal participants[0] + '__' + participants[1].

---

## 🤝 Cross-Platform Compatibility

This web chat mirrors the Flutter mobile app (water_bill_manager). The following must stay in sync across both codebases:

| Contract | Web location | Flutter location |
|---|---|---|
| Firestore collection names | hooks/index.tsx | chat_repository.dart |
| Document field names | types/IChat.tsx | Flutter data models |
| Thread id formula (sort, join with __) | threadIdFor() | Flutter threadIdFor() |
| Timestamp strategy (client clock for ordering) | useSendMessage | Flutter send logic |
| institutionId default value ("default") | DEFAULT_INSTITUTION | kDefaultInstitution in Dart |
| MAX_MESSAGE_LENGTH (2000) | IChat.tsx | firestore.rules |
