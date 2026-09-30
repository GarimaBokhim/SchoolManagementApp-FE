'use client'

// Firestore-backed realtime chat for khaneypaniadmin.
//
// Firestore streams do not fit React Query's request/response model, so the
// live collections are plain onSnapshot subscriptions held in state. The staff
// roster, which is a REST call, still goes through React Query via
// useGetAllStaff.

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import { jwtDecode } from 'jwt-decode'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore'

import { db, ensureSignedIn, isFirebaseConfigured } from '@/lib/firebase'
import { useGetAllStaff } from '../../(employee)/staff/hooks'
import { StaffResponse } from '../../(employee)/staff/types/IStaff'
import {
  ChatListEntry,
  ChatMessage,
  ChatThread,
  ChatUser,
  DEFAULT_INSTITUTION,
  MAX_MESSAGE_LENGTH,
  chatMessageFromDoc,
  chatThreadFromDoc,
  chatUserFromDoc,
  isAdminRole,
  threadIdFor,
} from '../types/IChat'

const USERS_COLLECTION = 'chatUsers'
const THREADS_COLLECTION = 'chatThreads'
const MESSAGES_COLLECTION = 'messages'

/** One page big enough to hold a committee's whole team. The chat list has no
 *  pagination of its own and FilterStaff is the only listing endpoint, so the
 *  roster is pulled in a single call. */
const ROSTER_PAGE_SIZE = 200

const NAME_CLAIM =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
const ROLE_CLAIM =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

/** ASP.NET's JWT serializer emits the role claim as a single string when the
 *  user has exactly one role, but as a JSON array when they have more than one
 *  — same claim key, different shape. Handle both, as JwtClaims._parseRole
 *  does on the Flutter side. */
const parseRole = (raw: unknown): string => {
  if (Array.isArray(raw) && raw.length > 0) return String(raw[0])
  return raw == null ? '' : String(raw)
}

/**
 * The signed-in user as a chat directory entry, decoded from the stored JWT.
 *
 * Deliberately reads the token rather than the `userDetails` blob: chat ids
 * must be the JWT `sub` claim (what localStorage.userId holds and what the
 * Flutter client uses), whereas userDetails.id is the `nameidentifier` claim.
 * Those are not guaranteed to be the same value, and a mismatch would put the
 * two clients in different thread id spaces.
 */
export const useChatIdentity = (): ChatUser | null => {
  // useSyncExternalStore rather than an effect: localStorage is an external
  // store, and this reads it during the first client render instead of after a
  // paint, so the chat never flashes its signed-out state. The snapshot is the
  // token string (a primitive), keeping the comparison stable across renders;
  // decoding happens in the memo below.
  const token = useSyncExternalStore(
    subscribeToToken,
    getTokenSnapshot,
    getServerTokenSnapshot
  )

  return useMemo(() => {
    if (!token) return null
    try {
      const claims = jwtDecode<Record<string, unknown>>(token)
      const id = String(claims.sub ?? '')
      if (!id) return null

      return {
        id,
        name: String(claims[NAME_CLAIM] ?? ''),
        email: String(claims.email ?? ''),
        role: parseRole(claims[ROLE_CLAIM]),
        institutionId: String(claims.InstitutionId ?? '') || DEFAULT_INSTITUTION,
        photoUrl: '',
      }
    } catch (error) {
      console.error('[chat] could not decode token for chat identity', error)
      return null
    }
  }, [token])
}

/** Re-reads the token when another tab signs in or out. Same-tab writes do not
 *  fire `storage`, which is fine: a same-tab login navigates anyway. */
const subscribeToToken = (onChange: () => void) => {
  window.addEventListener('storage', onChange)
  return () => window.removeEventListener('storage', onChange)
}

const getTokenSnapshot = () => localStorage.getItem('token')

const getServerTokenSnapshot = () => null

/**
 * Publishes (or refreshes) this user's directory entry, so they are addressable
 * from the mobile app. Runs on mount and whenever identity changes, mirroring
 * ChatRepository.registerUser which the Flutter app calls on every login.
 *
 * Without this an admin who has only ever used the web would have no chatUsers
 * document, and staff on mobile would see them as a display-only row.
 */
export const useRegisterChatUser = (me: ChatUser | null) => {
  useEffect(() => {
    if (!db || !me?.id) return
    let cancelled = false

    const register = async () => {
      try {
        await ensureSignedIn()
        if (cancelled) return
        await setDoc(
          doc(db!, USERS_COLLECTION, me.id),
          {
            id: me.id,
            name: me.name,
            email: me.email,
            role: me.role,
            institutionId: me.institutionId,
            photoUrl: me.photoUrl,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        )
      } catch (error) {
        console.error('[chat] could not register chat user', error)
      }
    }

    register()
    return () => {
      cancelled = true
    }
  }, [me?.id, me?.name, me?.email, me?.role, me?.institutionId, me?.photoUrl, me])
}

/** Everyone in the caller's institution except themselves.
 *
 *  Scoped to the institution so separate committees never see each other;
 *  accounts whose JWT has no InstitutionId share DEFAULT_INSTITUTION. */
export const useChatDirectory = (me: ChatUser | null) => {
  const [directory, setDirectory] = useState<ChatUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!db || !me?.id) return
    let unsubscribed = false
    let unsubscribe: (() => void) | undefined

    const subscribe = async () => {
      try {
        await ensureSignedIn()
        if (unsubscribed) return

        unsubscribe = onSnapshot(
          query(
            collection(db!, USERS_COLLECTION),
            where('institutionId', '==', me.institutionId)
          ),
          (snap) => {
            setDirectory(
              snap.docs
                .map((d) => chatUserFromDoc(d.id, d.data()))
                .filter((u) => u.id !== me.id && u.name.length > 0)
                .sort((a, b) =>
                  a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                )
            )
            setLoading(false)
          },
          (err) => {
            console.error('[chat] directory listener failed', err)
            setError(err.message)
            setLoading(false)
          }
        )
      } catch (err) {
        setError((err as Error).message)
        setLoading(false)
      }
    }

    subscribe()
    return () => {
      unsubscribed = true
      unsubscribe?.()
    }
  }, [me?.id, me?.institutionId])

  return { directory, loading, error }
}

/** Every thread this user takes part in, keyed by thread id for an easy join
 *  against the contact list.
 *
 *  Sorted client-side, so the query needs no composite index and threads whose
 *  timestamp has not landed yet still appear. */
export const useChatThreads = (me: ChatUser | null) => {
  const [threads, setThreads] = useState<Record<string, ChatThread>>({})

  useEffect(() => {
    if (!db || !me?.id) return
    let unsubscribed = false
    let unsubscribe: (() => void) | undefined

    const subscribe = async () => {
      try {
        await ensureSignedIn()
        if (unsubscribed) return

        unsubscribe = onSnapshot(
          query(
            collection(db!, THREADS_COLLECTION),
            where('participants', 'array-contains', me.id)
          ),
          (snap) => {
            const next: Record<string, ChatThread> = {}
            for (const d of snap.docs) next[d.id] = chatThreadFromDoc(d)
            setThreads(next)
          },
          (err) => console.error('[chat] thread listener failed', err)
        )
      } catch (err) {
        console.error('[chat] could not subscribe to threads', err)
      }
    }

    subscribe()
    return () => {
      unsubscribed = true
      unsubscribe?.()
    }
  }, [me?.id])

  return threads
}

/** The messages of one thread, oldest first. */
export const useChatMessages = (threadId: string | null) => {
  // Keyed by thread id so switching conversations shows the new thread's
  // loading state rather than the previous thread's messages, without an
  // effect that synchronously clears state on every change.
  const [snapshot, setSnapshot] = useState<{
    threadId: string
    messages: ChatMessage[]
  } | null>(null)

  useEffect(() => {
    if (!db || !threadId) return

    let unsubscribed = false
    let unsubscribe: (() => void) | undefined

    const subscribe = async () => {
      try {
        await ensureSignedIn()
        if (unsubscribed) return

        unsubscribe = onSnapshot(
          query(
            collection(db!, THREADS_COLLECTION, threadId, MESSAGES_COLLECTION),
            orderBy('sentAt')
          ),
          (snap) =>
            setSnapshot({
              threadId,
              messages: snap.docs.map(chatMessageFromDoc),
            }),
          (err) => {
            console.error('[chat] message listener failed', err)
            // Settle as empty so the view stops loading and shows the
            // "no messages" state instead of spinning forever.
            setSnapshot({ threadId, messages: [] })
          }
        )
      } catch (err) {
        console.error('[chat] could not subscribe to messages', err)
        setSnapshot({ threadId, messages: [] })
      }
    }

    subscribe()
    return () => {
      unsubscribed = true
      unsubscribe?.()
    }
  }, [threadId])

  const fresh = snapshot?.threadId === threadId ? snapshot : null
  return {
    messages: fresh?.messages ?? [],
    loading: threadId !== null && fresh === null,
  }
}

export type SendResult = { ok: true } | { ok: false; error: string }

/**
 * Writes the message and updates the thread summary in one batch, so the chat
 * list preview can never drift from the thread's actual last message. The
 * thread doc is created on first send (merge), which is why there is no
 * separate "start conversation" call.
 */
export const useSendMessage = () => {
  const [sending, setSending] = useState(false)

  const send = useCallback(
    async (from: ChatUser, to: ChatUser, text: string): Promise<SendResult> => {
      const body = text.trim()
      if (!body) return { ok: true }
      if (body.length > MAX_MESSAGE_LENGTH) {
        return { ok: false, error: 'Message is too long to send.' }
      }
      if (!db) return { ok: false, error: 'Chat is not configured.' }

      setSending(true)
      try {
        await ensureSignedIn()

        const threadId = threadIdFor(from.id, to.id)
        const threadRef = doc(db, THREADS_COLLECTION, threadId)
        const messageRef = doc(
          collection(db, THREADS_COLLECTION, threadId, MESSAGES_COLLECTION)
        )

        // Ordering runs off the client clock rather than a server timestamp: a
        // serverTimestamp() reads back null in the local pre-ack snapshot, so
        // an optimistic message would sort to the wrong end of the list and
        // visibly jump once the server acknowledged it. The server value is
        // written alongside as the trustworthy record. Matches the Flutter
        // client, which must agree on this or the two would interleave.
        const now = Timestamp.now()

        const batch = writeBatch(db)
        batch.set(messageRef, {
          text: body,
          senderId: from.id,
          sentAt: now,
          serverSentAt: serverTimestamp(),
        })
        batch.set(
          threadRef,
          {
            participants: [from.id, to.id].sort(),
            institutionId: from.institutionId,
            lastMessage: body,
            lastMessageAt: now,
            lastMessageSenderId: from.id,
            // The sender has by definition seen their own message; stamping it
            // here keeps the row out of their own unread state. merge:true deep
            // merges the map, so the other participant's stamp survives.
            readAt: { [from.id]: now },
          },
          { merge: true }
        )

        await batch.commit()
        return { ok: true }
      } catch (error) {
        return { ok: false, error: mapFirebaseError(error) }
      } finally {
        setSending(false)
      }
    },
    []
  )

  return { send, sending }
}

/**
 * Stamps "user opened this thread", clearing the unread dot.
 *
 * Best-effort and guarded on the thread already existing: a thread with no
 * messages has no document to merge into, and creating one with only `readAt`
 * would be rejected by the rules, which require participants and lastMessage.
 */
export const useMarkRead = () => {
  return useCallback(async (threadId: string, myUserId: string) => {
    if (!db) return
    try {
      await ensureSignedIn()
      await setDoc(
        doc(db, THREADS_COLLECTION, threadId),
        { readAt: { [myUserId]: Timestamp.now() } },
        { merge: true }
      )
    } catch {
      // Ignored on purpose — a failure here must never block reading.
    }
  }, [])
}

const emailKey = (email: string) => email.trim().toLowerCase()

/**
 * Builds the chat list by folding the staff roster into the Firestore
 * directory, so a colleague shows up whether or not they have ever signed in
 * and whether or not there is a conversation with them yet.
 *
 * Who shows up follows the role: an admin sees the staff, and a staff member
 * sees the staff plus the admins — matching mergeChatRoster in the Flutter app.
 *
 * Each roster record is matched to a directory entry by id first, then by
 * email. A match means that person has signed in, so the directory's id — the
 * JWT `sub`, the only id both ends agree on — is used and the row is fully
 * messageable. No match means they have never signed in, and the row is marked
 * isPending: visible, but not messageable, because a StaffResponse.id cannot
 * address a thread.
 */
export const mergeChatRoster = ({
  me,
  directory,
  roster,
  threads,
}: {
  me: ChatUser
  directory: ChatUser[]
  roster: StaffResponse[]
  threads: Record<string, ChatThread>
}): ChatListEntry[] => {
  const visible = isAdminRole(me.role)
    ? directory.filter((u) => !isAdminRole(u.role))
    : directory

  const byId = new Map(visible.map((u) => [u.id, u]))
  const byEmail = new Map<string, ChatUser>()
  for (const u of visible) {
    const key = emailKey(u.email)
    if (key) byEmail.set(key, u)
  }

  const pending: StaffResponse[] = []
  for (const staff of roster) {
    // The directory stream drops nameless entries; keep the two consistent.
    if (!staff.fullName?.trim()) continue
    // Never offer a chat with yourself.
    const staffEmail = emailKey(staff.email ?? '')
    if (staff.id === me.id || (staffEmail && staffEmail === emailKey(me.email)))
      continue

    const match = byId.get(staff.id) ?? (staffEmail ? byEmail.get(staffEmail) : undefined)
    if (!match) pending.push(staff)
  }

  const entries: ChatListEntry[] = [
    ...visible.map((user) => ({
      user,
      thread: threads[threadIdFor(me.id, user.id)] ?? null,
      isPending: false,
    })),
    ...pending.map((staff) => ({
      user: {
        id: staff.id,
        name: staff.fullName,
        email: staff.email ?? '',
        // Role is left blank rather than guessed; roleLabel renders it as
        // 'Staff', which is what every roster record is.
        role: '',
        institutionId: me.institutionId,
        photoUrl: '',
      },
      thread: null,
      isPending: true,
    })),
  ]

  // Active conversations first (most recent first), then everyone else who can
  // be messaged, then the not-yet-signed-in tail — alphabetical within band.
  const band = (e: ChatListEntry) => {
    if (e.isPending) return 2
    return e.thread?.lastMessageAt ? 0 : 1
  }

  return entries.sort((a, b) => {
    const byBand = band(a) - band(b)
    if (byBand !== 0) return byBand

    const aAt = a.thread?.lastMessageAt
    const bAt = b.thread?.lastMessageAt
    if (aAt && bAt) {
      const byRecency = bAt.getTime() - aAt.getTime()
      if (byRecency !== 0) return byRecency
    }

    return a.user.name.toLowerCase().localeCompare(b.user.name.toLowerCase())
  })
}

/** The whole chat list, wired together: identity, directory, threads and the
 *  REST staff roster. */
export const useChatRoster = (me: ChatUser | null) => {
  const { directory, loading: directoryLoading, error } = useChatDirectory(me)
  const threads = useChatThreads(me)
  // Query shape matches AllStaffForm's so the two share a React Query cache
  // entry rather than each triggering their own fetch.
  const { data: staffPage, isLoading: rosterLoading } = useGetAllStaff(
    `?pageSize=${ROSTER_PAGE_SIZE}&pageIndex=1&IsPagination=true`
  )

  const entries = useMemo(() => {
    if (!me) return []
    return mergeChatRoster({
      me,
      directory,
      roster: staffPage?.Items ?? [],
      threads,
    })
  }, [me, directory, staffPage?.Items, threads])

  return {
    entries,
    threads,
    loading: directoryLoading || rosterLoading,
    error,
    isConfigured: isFirebaseConfigured,
  }
}

const mapFirebaseError = (error: unknown): string => {
  const code = (error as { code?: string })?.code
  switch (code) {
    case 'permission-denied':
      return 'You do not have access to this conversation.'
    case 'unavailable':
    case 'network-request-failed':
      return 'No connection. Messages will send once you are back online.'
    default:
      return (error as Error)?.message ?? 'Chat is unavailable right now.'
  }
}
