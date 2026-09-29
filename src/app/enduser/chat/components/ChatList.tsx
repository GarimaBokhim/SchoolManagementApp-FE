'use client'

import React, { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { EndUserChatEntry } from '../types/IChat'
import { ChatAvatar } from './ChatAvatar'

interface ChatListProps {
  entries: EndUserChatEntry[]
  currentUserId: string
  selectedUserId: string | null
  onSelect: (entry: EndUserChatEntry) => void
  loading: boolean
}

const formatPreviewTime = (date: Date | null): string => {
  if (!date) return ''
  const now = new Date()
  const isSameDay = date.toDateString() === now.toDateString()

  if (isSameDay) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' })
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export const ChatList: React.FC<ChatListProps> = ({
  entries,
  currentUserId,
  selectedUserId,
  onSelect,
  loading,
}) => {
  const [search, setSearch] = useState('')

  const filteredEntries = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(
      (e) =>
        e.user.userName.toLowerCase().includes(q) ||
        e.user.email.toLowerCase().includes(q)
    )
  }, [entries, search])

  return (
    <div className="flex h-full w-full flex-col border-r border-gray-200 dark:border-gray-700 md:w-80 bg-white dark:bg-gray-800">
      {/* Search Header */}
      <div className="border-b border-gray-200 p-3 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* List items */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
        {loading && entries.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500 italic">
            Loading directory...
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500 italic">
            {search ? 'No users found matching your search.' : 'No users available.'}
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const isSelected = entry.user.id === selectedUserId
            const lastMsg = entry.conversation?.lastMessage
            const lastMsgTime = entry.conversation?.lastMessageAt

            return (
              <button
                key={entry.user.id}
                type="button"
                onClick={() => onSelect(entry)}
                className={`flex w-full items-center gap-3 px-3 py-3.5 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-l-4 border-indigo-600'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <ChatAvatar userId={entry.user.id} name={entry.user.userName} size={42} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {entry.user.userName}
                    </span>
                    <span className="text-[11px] text-gray-400 shrink-0 ml-2">
                      {formatPreviewTime(lastMsgTime ?? null)}
                    </span>
                  </div>

                  <p className="truncate text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {lastMsg || entry.user.email || 'No messages yet'}
                  </p>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
