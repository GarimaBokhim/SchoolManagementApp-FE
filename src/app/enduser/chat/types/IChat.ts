import { DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore'

/**
 * Model representing a user from the backend REST API (/api/Authentication/all-users)
 * Matches the Flutter AppUserModel in lib/features/chat/data/app_user_model.dart
 */
export interface AppUserModel {
  id: string
  userName: string
  email: string
  address?: string
}

/**
 * Model representing a conversation document in conversations/{conversationId}
 * Matches lib/features/chat/data/conversation_model.dart
 */
export interface ConversationModel {
  id: string
  participantIds: string[]
  lastMessage: string
  lastSenderId: string
  lastMessageAt: Date | null
}

/**
 * Model representing a message document in conversations/{conversationId}/messages/{messageId}
 * Matches lib/features/chat/data/message_model.dart
 */
export interface MessageModel {
  id: string
  senderId: string
  text: string
  sentAt: Date | null
  isPending: boolean
}

/**
 * Directory entry merged with conversation info for the chat list UI.
 */
export interface EndUserChatEntry {
  user: AppUserModel
  conversation: ConversationModel | null
}

/**
 * Deterministic conversation ID for two users.
 * Sorts both user IDs alphabetically and joins them with an underscore '_'.
 * Matches ChatRepository.conversationIdFor in mobile: "${ids[0]}_${ids[1]}"
 */
export const conversationIdFor = (userA: string, userB: string): string => {
  const ids = [userA, userB].sort()
  return `${ids[0]}_${ids[1]}`
}

/**
 * Deterministic avatar color palette matching Flutter mobile ChatAvatar widget.
 */
export const AVATAR_PALETTE = [
  '#6366F1', // Indigo
  '#22C55E', // Green
  '#F97316', // Orange
  '#EC4899', // Pink
  '#A855F7', // Purple
  '#06B6D4', // Cyan
]

export const getAvatarColor = (userId: string): string => {
  if (!userId) return AVATAR_PALETTE[0]
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length
  return AVATAR_PALETTE[index]
}

export const getInitial = (name?: string): string => {
  if (!name || !name.trim()) return '?'
  return name.trim().charAt(0).toUpperCase()
}

export const toDate = (value: unknown): Date | null => {
  if (value instanceof Timestamp) return value.toDate()
  if (value instanceof Date) return value
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d
  }
  return null
}

export const conversationFromDoc = (
  doc: QueryDocumentSnapshot<DocumentData>
): ConversationModel => {
  const data = doc.data()
  return {
    id: doc.id,
    participantIds: ((data.participantIds as unknown[]) ?? []).map(String),
    lastMessage: (data.lastMessage as string) ?? '',
    lastSenderId: (data.lastSenderId as string) ?? '',
    lastMessageAt: toDate(data.lastMessageAt),
  }
}

export const messageFromDoc = (
  doc: QueryDocumentSnapshot<DocumentData>
): MessageModel => {
  const data = doc.data()
  return {
    id: doc.id,
    senderId: (data.senderId as string) ?? '',
    text: (data.text as string) ?? '',
    sentAt: toDate(data.sentAt),
    isPending: doc.metadata.hasPendingWrites || data.sentAt == null,
  }
}
