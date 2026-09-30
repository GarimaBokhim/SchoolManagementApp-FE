// Web mirror of the Flutter chat models. Every field name here matches
// water_bill_manager/lib/app/app_core/features/chat/data/*.dart exactly —
// both clients read and write the same documents, so a rename on one side
// silently breaks the other.
//
// Firestore layout:
//   chatUsers/{appUserId}                        — the directory
//   chatThreads/{threadId}                       — one per pair, summary
//   chatThreads/{threadId}/messages/{messageId}  — the messages

import { DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore'

/** The role string the REST API puts on the JWT for a committee admin. */
export const KHANEYPANI_ADMIN_ROLE = 'khaneypaniadmin'

/** Institution bucket for accounts whose JWT carries no `InstitutionId`.
 *  Without a fallback those users land in a bucket of their own and see an
 *  empty contact list. Must stay identical to kDefaultInstitution in Dart. */
export const DEFAULT_INSTITUTION = 'default'

/** Longest message the security rules accept — kept in sync with
 *  firestore.rules so a rejected write cannot surprise the user. */
export const MAX_MESSAGE_LENGTH = 2000

/** One person in the chat directory (`chatUsers/{id}`).
 *
 *  This collection — not the staff API — is the source of truth for who can be
 *  messaged. Each user writes their own entry on login, which is what makes a
 *  stable id available to both ends of a conversation: StaffResponse.id and the
 *  JWT `sub` do not reliably line up, so thread ids built from staff-list ids
 *  would never match the ones the other side computed. */
export interface ChatUser {
  /** The app's own user id — the JWT `sub`. Also the document id. */
  id: string
  name: string
  email: string
  role: string
  institutionId: string
  photoUrl: string
}

/** The summary half of a conversation — one `chatThreads/{threadId}` doc.
 *  Denormalised so the chat list renders previews and unread state from a
 *  single query rather than opening a messages subcollection per row. */
export interface ChatThread {
  id: string
  /** Exactly two app user ids, sorted — see threadIdFor. */
  participants: string[]
  lastMessage: string
  lastMessageAt: Date | null
  lastMessageSenderId: string
  /** Per-participant "last opened the thread" stamps, keyed by user id. */
  readAt: Record<string, Date>
}

/** A single message at `chatThreads/{threadId}/messages/{id}`. */
export interface ChatMessage {
  id: string
  text: string
  senderId: string
  sentAt: Date
  /** True while the write is still only in the local cache — drives the
   *  "Sending…" state on the bubble. */
  isPending: boolean
}

/** One row of the chat list: a person, plus the thread with them if one has
 *  been started. `thread` is null until the first message is sent either way. */
export interface ChatListEntry {
  user: ChatUser
  thread: ChatThread | null
  /** True when this person came from the staff roster (the REST API) and has no
   *  `chatUsers` entry, because they have never signed in.
   *
   *  Their user id is a StaffResponse.id, which is NOT an addressable chat id.
   *  The row is still shown so the roster reads as the whole team, but it must
   *  never open a conversation: a message written against that id lands in a
   *  thread document the other person's client never computes, and is lost. */
  isPending: boolean
}

/** Deterministic thread id for a pair of users: both ends sort the two ids and
 *  join them, so each side addresses the same document without a lookup or a
 *  "find or create" round trip.
 *
 *  The separator is two underscores, and firestore.rules enforces that the
 *  document id equals participants[0] + '__' + participants[1]. */
export const threadIdFor = (a: string, b: string): string => {
  const pair = [a, b].sort()
  return `${pair[0]}__${pair[1]}`
}

export const isAdminRole = (role: string): boolean =>
  role.trim().toLowerCase() === KHANEYPANI_ADMIN_ROLE

export const roleLabel = (user: ChatUser): string =>
  isAdminRole(user.role) ? 'Admin' : 'Staff'

/** True when the other person has said something since this user last opened
 *  the thread. */
export const isUnreadFor = (
  thread: ChatThread | null,
  userId: string
): boolean => {
  if (!thread || !thread.lastMessageAt) return false
  if (thread.lastMessageSenderId === userId) return false
  const seen = thread.readAt[userId]
  return !seen || thread.lastMessageAt > seen
}

/** The other participant's id, or null on a malformed doc. */
export const otherParticipant = (
  thread: ChatThread,
  myUserId: string
): string | null => thread.participants.find((p) => p !== myUserId) ?? null

/** Up to two initials for the placeholder avatar, e.g. 'Ram Thapa' → 'RT'. */
export const initialsOf = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

const toDate = (value: unknown): Date | null =>
  value instanceof Timestamp ? value.toDate() : null

export const chatUserFromDoc = (
  id: string,
  data: DocumentData | undefined
): ChatUser => ({
  id,
  name: (data?.name as string) ?? '',
  email: (data?.email as string) ?? '',
  role: (data?.role as string) ?? '',
  institutionId: (data?.institutionId as string) ?? DEFAULT_INSTITUTION,
  photoUrl: (data?.photoUrl as string) ?? '',
})

export const chatThreadFromDoc = (
  doc: QueryDocumentSnapshot<DocumentData>
): ChatThread => {
  const data = doc.data()
  const rawReadAt = (data.readAt as Record<string, unknown>) ?? {}
  const readAt: Record<string, Date> = {}
  for (const [key, value] of Object.entries(rawReadAt)) {
    const at = toDate(value)
    if (at) readAt[key] = at
  }

  return {
    id: doc.id,
    participants: ((data.participants as unknown[]) ?? []).map(String),
    lastMessage: (data.lastMessage as string) ?? '',
    lastMessageAt: toDate(data.lastMessageAt),
    lastMessageSenderId: (data.lastMessageSenderId as string) ?? '',
    readAt,
  }
}

export const chatMessageFromDoc = (
  doc: QueryDocumentSnapshot<DocumentData>
): ChatMessage => {
  const data = doc.data()
  return {
    id: doc.id,
    text: (data.text as string) ?? '',
    senderId: (data.senderId as string) ?? '',
    // Ordering and display both run off the client clock — a serverTimestamp()
    // reads back null in the local pre-ack snapshot, so an optimistic message
    // would sort to the wrong end of the list and visibly jump once the server
    // acknowledged it. Falls back to the server value for older documents.
    sentAt: toDate(data.sentAt) ?? toDate(data.serverSentAt) ?? new Date(),
    isPending: doc.metadata.hasPendingWrites,
  }
}
