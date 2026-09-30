'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Clock, Send } from 'lucide-react'
import { Toast } from '@/components/Toast/toast'
import { useChatMessages, useMarkRead, useSendMessage } from '../hooks'
import {
  ChatUser,
  MAX_MESSAGE_LENGTH,
  initialsOf,
  roleLabel,
  threadIdFor,
} from '../types/IChat'

const stampOf = (at: Date): string =>
  at.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

const dayLabel = (at: Date): string => {
  const now = new Date()
  if (at.toDateString() === now.toDateString()) return 'Today'
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (at.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return at.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: at.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  })
}

type Props = {
  me: ChatUser
  peer: ChatUser
  onBack: () => void
}

const ChatConversation = ({ me, peer, onBack }: Props) => {
  const threadId = threadIdFor(me.id, peer.id)
  const { messages, loading } = useChatMessages(threadId)
  const { send, sending } = useSendMessage()
  const markRead = useMarkRead()

  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Jump to the newest message whenever the thread or its contents change.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, threadId])

  // Clear the unread dot once the thread is open and actually has messages —
  // stamping readAt on a thread with no document would be rejected by the
  // security rules, which require participants and lastMessage.
  useEffect(() => {
    if (messages.length > 0) markRead(threadId, me.id)
  }, [threadId, me.id, messages.length, markRead])

  const handleSend = async () => {
    const body = draft.trim()
    if (!body || sending) return

    // Clear optimistically: Firestore's local cache renders the message
    // immediately, so leaving the text in the box would read as a failed send.
    setDraft('')
    const result = await send(me, peer, body)
    if (!result.ok) {
      Toast.error(result.error)
      setDraft(body)
    }
  }

  let lastDay = ''

  return (
    <div className="flex h-full flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer rounded p-1 text-gray-500 hover:bg-gray-100 md:hidden dark:hover:bg-gray-700"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
          {initialsOf(peer.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-800 dark:text-gray-100">
            {peer.name}
          </p>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {roleLabel(peer)}
            {peer.email ? ` · ${peer.email}` : ''}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-2 overflow-y-auto bg-gray-50 px-4 py-4 dark:bg-gray-900">
        {loading && messages.length === 0 ? (
          <p className="pt-8 text-center text-sm italic text-gray-500">
            Loading messages…
          </p>
        ) : messages.length === 0 ? (
          <p className="pt-8 text-center text-sm italic text-gray-500">
            No messages yet. Say hello to {peer.name.split(' ')[0]}.
          </p>
        ) : (
          messages.map((message) => {
            const mine = message.senderId === me.id
            const day = dayLabel(message.sentAt)
            const showDay = day !== lastDay
            lastDay = day

            return (
              <div key={message.id}>
                {showDay && (
                  <div className="my-3 text-center">
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-[11px] text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {day}
                    </span>
                  </div>
                )}
                <div className={mine ? 'flex justify-end' : 'flex justify-start'}>
                  <div
                    className={
                      'max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ' +
                      (mine
                        ? 'rounded-br-sm bg-blue-600 text-white'
                        : 'rounded-bl-sm bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100')
                    }
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                    <div
                      className={
                        'mt-1 flex items-center justify-end gap-1 text-[10px] ' +
                        (mine ? 'text-blue-100' : 'text-gray-400')
                      }
                    >
                      {message.isPending && <Clock className="h-3 w-3" />}
                      <span>{stampOf(message.sentAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-gray-200 p-3 dark:border-gray-700">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
            onKeyDown={(e) => {
              // Enter sends, Shift+Enter makes a new line.
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            rows={1}
            placeholder={`Message ${peer.name.split(' ')[0]}…`}
            className="max-h-32 flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim() || sending}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {draft.length > MAX_MESSAGE_LENGTH - 200 && (
          <p className="mt-1 text-right text-[11px] text-gray-400">
            {draft.length} / {MAX_MESSAGE_LENGTH}
          </p>
        )}
      </div>
    </div>
  )
}

export default ChatConversation
