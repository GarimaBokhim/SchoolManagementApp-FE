'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Clock, Send } from 'lucide-react'
import { Toast } from '@/components/Toast/toast'
import { AppUserModel, conversationIdFor } from '../types/IChat'
import { useConversationMessages, useSendMessage } from '../hooks'
import { ChatAvatar } from './ChatAvatar'

interface ChatConversationProps {
  currentUser: AppUserModel
  peer: AppUserModel
  onBack: () => void
}

const formatMessageTime = (date: Date | null): string => {
  if (!date) return ''
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

const getDayLabel = (date: Date | null): string => {
  if (!date) return ''
  const now = new Date()
  if (date.toDateString() === now.toDateString()) return 'Today'

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
  })
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  currentUser,
  peer,
  onBack,
}) => {
  const convId = conversationIdFor(currentUser.id, peer.id)
  const { messages, loading } = useConversationMessages(convId)
  const { send, sending } = useSendMessage()

  const [draft, setDraft] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, convId])

  const handleSend = async () => {
    const textToSend = draft.trim()
    if (!textToSend || sending) return

    setDraft('')
    const result = await send(currentUser, peer, textToSend)
    if (!result.ok) {
      Toast.error(result.error || 'Failed to send message')
      setDraft(textToSend)
    }
  }

  let lastDay = ''

  return (
    <div className="flex h-full flex-1 flex-col bg-slate-50 dark:bg-gray-900">
      {/* Top Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden dark:hover:bg-gray-700"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <ChatAvatar userId={peer.id} name={peer.userName} size={40} />

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-900 dark:text-gray-100">
            {peer.userName}
          </p>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {peer.email || peer.address || 'User'}
          </p>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {loading && messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-gray-400 italic">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-400 p-6">
            <ChatAvatar userId={peer.id} name={peer.userName} size={54} className="mb-3 opacity-80" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              No messages yet
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Say hello to start the conversation with {peer.userName}.
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isMine = message.senderId === currentUser.id
            const day = getDayLabel(message.sentAt)
            const showDayDivider = day && day !== lastDay
            if (day) lastDay = day

            return (
              <React.Fragment key={message.id}>
                {showDayDivider && (
                  <div className="my-3 flex justify-center">
                    <span className="rounded-full bg-gray-200/80 px-3 py-1 text-[11px] font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {day}
                    </span>
                  </div>
                )}

                <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm transition-all ${
                      isMine
                        ? 'rounded-br-xs bg-[#5D6AFB] text-white'
                        : 'rounded-bl-xs bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed">
                      {message.text}
                    </p>

                    <div
                      className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                        isMine ? 'text-indigo-100' : 'text-gray-400'
                      }`}
                    >
                      {message.isPending ? (
                        <>
                          <Clock className="h-3 w-3 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>{formatMessageTime(message.sentAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer */}
      <div className="border-t border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={`Message ${peer.userName}...`}
            rows={1}
            className="max-h-32 flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim() || sending}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#5D6AFB] text-white transition hover:bg-[#4C58DE] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
