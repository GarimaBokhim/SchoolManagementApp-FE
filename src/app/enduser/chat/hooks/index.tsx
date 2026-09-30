'use client'

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { jwtDecode } from 'jwt-decode'
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import { schoolDb, ensureSignedIn, isSchoolFirebaseConfigured } from '@/lib/firebase'
import {
  AppUserModel,
  ConversationModel,
  EndUserChatEntry,
  MessageModel,
  conversationFromDoc,
  conversationIdFor,
  messageFromDoc,
} from '../types/IChat'

const CONVERSATIONS_COLLECTION = 'conversations'
const MESSAGES_COLLECTION = 'messages'

const subscribeToToken = (onChange: () => void) => {
  window.addEventListener('storage', onChange)
  return () => window.removeEventListener('storage', onChange)
}

const getTokenSnapshot = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
const getServerTokenSnapshot = () => null

/**
 * Current signed-in user derived from stored JWT / localStorage.
 */
export const useCurrentEndUser = (): AppUserModel | null => {
  const token = useSyncExternalStore(
    subscribeToToken,
    getTokenSnapshot,
    getServerTokenSnapshot
  )

  return useMemo(() => {
    if (!token) return null
    try {
      const claims = jwtDecode<Record<string, unknown>>(token)
      const storedId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
      const id = String(claims.sub ?? storedId ?? '')
      if (!id) return null

      let userName = ''
      if (claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']) {
        userName = String(claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'])
      } else if (claims.name) {
        userName = String(claims.name)
      } else if (claims.unique_name) {
        userName = String(claims.unique_name)
      }

      const email = String(claims.email ?? '')

      return {
        id,
        userName: userName || email || 'User',
        email,
      }
    } catch (error) {
      console.error('[enduser chat] Error decoding token:', error)
      return null
    }
  }, [token])
}

/**
 * Fetches user directory from REST API (/api/Authentication/all-users)
 */
export const useAllDirectoryUsers = (currentUserId?: string) => {
  return useQuery({
    queryKey: ['enduserChatDirectoryUsers', currentUserId],
    queryFn: async () => {
      const response = await api.get<{
        Items?: Array<{
          Id?: string
          id?: string
          UserName?: string
          userName?: string
          Email?: string
          email?: string
          Address?: string
          address?: string
        }>
        items?: Array<{
          Id?: string
          id?: string
          UserName?: string
          userName?: string
          Email?: string
          email?: string
          Address?: string
          address?: string
        }>
      }>('/api/Authentication/all-users?pageSize=200&pageIndex=1&IsPagination=true')

      const rawItems = response.data?.Items ?? response.data?.items ?? (Array.isArray(response.data) ? response.data : [])
      
      const users: AppUserModel[] = rawItems
        .map((item: any) => ({
          id: item.Id ?? item.id ?? '',
          userName: item.UserName ?? item.userName ?? item.Email ?? item.email ?? 'User',
          email: item.Email ?? item.email ?? '',
          address: item.Address ?? item.address ?? '',
        }))
        .filter((u: AppUserModel) => u.id && u.id !== currentUserId)

      return users
    },
    enabled: typeof window !== 'undefined',
    staleTime: 1000 * 60 * 5, // 5 mins
  })
}

/**
 * Real-time listener for conversations the current user participates in.
 */
export const useConversations = (currentUserId?: string) => {
  const [conversations, setConversations] = useState<Record<string, ConversationModel>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!schoolDb || !currentUserId) {
      setLoading(false)
      return
    }

    let unsubscribed = false
    let unsubscribe: (() => void) | undefined

    const subscribe = async () => {
      try {
        await ensureSignedIn()
        if (unsubscribed) return

        const q = query(
          collection(schoolDb!, CONVERSATIONS_COLLECTION),
          where('participantIds', 'array-contains', currentUserId)
        )

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const next: Record<string, ConversationModel> = {}
            for (const d of snapshot.docs) {
              next[d.id] = conversationFromDoc(d)
            }
            setConversations(next)
            setLoading(false)
          },
          (err) => {
            console.error('[enduser chat] conversations stream error:', err)
            setError(err.message)
            setLoading(false)
          }
        )
      } catch (err) {
        console.error('[enduser chat] failed to subscribe to conversations:', err)
        setError((err as Error).message)
        setLoading(false)
      }
    }

    subscribe()

    return () => {
      unsubscribed = true
      unsubscribe?.()
    }
  }, [currentUserId])

  return { conversations, loading, error }
}

/**
 * Real-time listener for messages in a single conversation.
 */
export const useConversationMessages = (conversationId: string | null) => {
  const [messages, setMessages] = useState<MessageModel[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!schoolDb || !conversationId) {
      setMessages([])
      setLoading(false)
      return
    }

    setLoading(true)
    let unsubscribed = false
    let unsubscribe: (() => void) | undefined

    const subscribe = async () => {
      try {
        await ensureSignedIn()
        if (unsubscribed) return

        const q = query(
          collection(schoolDb!, CONVERSATIONS_COLLECTION, conversationId, MESSAGES_COLLECTION),
          orderBy('sentAt')
        )

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            setMessages(snapshot.docs.map(messageFromDoc))
            setLoading(false)
          },
          (err) => {
            console.error('[enduser chat] messages stream error:', err)
            setError(err.message)
            setLoading(false)
          }
        )
      } catch (err) {
        console.error('[enduser chat] failed to subscribe to messages:', err)
        setError((err as Error).message)
        setLoading(false)
      }
    }

    subscribe()

    return () => {
      unsubscribed = true
      unsubscribe?.()
    }
  }, [conversationId])

  return { messages, loading, error }
}

/**
 * Hook to send a message via batched write to conversations/{id}/messages and conversations/{id}.
 */
export const useSendMessage = () => {
  const [sending, setSending] = useState(false)

  const send = useCallback(
    async (
      sender: AppUserModel,
      recipient: AppUserModel,
      text: string
    ): Promise<{ ok: boolean; error?: string }> => {
      const trimmed = text.trim()
      if (!trimmed) return { ok: true }
      if (!schoolDb) return { ok: false, error: 'Firebase is not configured.' }

      setSending(true)
      try {
        await ensureSignedIn()

        const convId = conversationIdFor(sender.id, recipient.id)
        const convRef = doc(schoolDb, CONVERSATIONS_COLLECTION, convId)
        const messageRef = doc(
          collection(schoolDb, CONVERSATIONS_COLLECTION, convId, MESSAGES_COLLECTION)
        )

        const batch = writeBatch(schoolDb)

        // 1. Create message doc with serverTimestamp()
        batch.set(messageRef, {
          senderId: sender.id,
          text: trimmed,
          sentAt: serverTimestamp(),
        })

        // 2. Upsert conversation summary doc
        batch.set(
          convRef,
          {
            participantIds: [sender.id, recipient.id].sort(),
            lastMessage: trimmed,
            lastSenderId: sender.id,
            lastMessageAt: serverTimestamp(),
          },
          { merge: true }
        )

        await batch.commit()
        return { ok: true }
      } catch (error) {
        console.error('[enduser chat] error sending message:', error)
        return {
          ok: false,
          error: (error as Error)?.message ?? 'Failed to send message.',
        }
      } finally {
        setSending(false)
      }
    },
    []
  )

  return { send, sending }
}

/**
 * Combines directory users and real-time conversation models into sorted list entries.
 */
export const useEndUserChatRoster = (currentUser: AppUserModel | null) => {
  const { data: directoryUsers = [], isLoading: directoryLoading } = useAllDirectoryUsers(currentUser?.id)
  const { conversations, loading: convLoading, error } = useConversations(currentUser?.id)

  const entries: EndUserChatEntry[] = useMemo(() => {
    if (!currentUser) return []

    const list: EndUserChatEntry[] = directoryUsers.map((user) => {
      const convId = conversationIdFor(currentUser.id, user.id)
      return {
        user,
        conversation: conversations[convId] ?? null,
      }
    })

    // Sort: Active conversations first (newest lastMessageAt first), then alphabetical
    return list.sort((a, b) => {
      const aTime = a.conversation?.lastMessageAt?.getTime() ?? 0
      const bTime = b.conversation?.lastMessageAt?.getTime() ?? 0

      if (aTime && bTime) {
        return bTime - aTime
      }
      if (aTime) return -1
      if (bTime) return 1

      return a.user.userName.toLowerCase().localeCompare(b.user.userName.toLowerCase())
    })
  }, [currentUser, directoryUsers, conversations])

  return {
    entries,
    loading: directoryLoading || convLoading,
    error,
    isConfigured: isSchoolFirebaseConfigured,
  }
}
