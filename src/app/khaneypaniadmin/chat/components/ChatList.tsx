'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import {
  ChatListEntry,
  initialsOf,
  isUnreadFor,
  roleLabel,
} from '../types/IChat'

/** Short relative stamp for the list preview: time today, weekday this week,
 *  date beyond that. */
const previewTime = (at: Date | null): string => {
  if (!at) return ''
  const now = new Date()
  const sameDay = at.toDateString() === now.toDateString()
  if (sameDay) {
    return at.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }
  const days = (now.getTime() - at.getTime()) / 86_400_000
  if (days < 7) return at.toLocaleDateString([], { weekday: 'short' })
  return at.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

type Props = {
  entries: ChatListEntry[]
  myUserId: string
  selectedUserId: string | null
  onSelect: (entry: ChatListEntry) => void
  loading: boolean
}

const Avatar = ({ name, muted }: { name: string; muted: boolean }) => (
  <div
    className={
      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ' +
      (muted
        ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
        : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200')
    }
  >
    {initialsOf(name)}
  </div>
)

const ChatList = ({
  entries,
  myUserId,
  selectedUserId,
  onSelect,
  loading,
}: Props) => {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return entries
    return entries.filter(
      (e) =>
        e.user.name.toLowerCase().includes(term) ||
        e.user.email.toLowerCase().includes(term)
    )
  }, [entries, search])

  return (
    <div className="flex h-full w-full flex-col border-r border-gray-200 dark:border-gray-700 md:w-80">
      <div className="border-b border-gray-200 p-3 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && entries.length === 0 ? (
          <p className="p-4 text-center text-sm italic text-gray-500">
            Loading staff…
          </p>
        ) : filtered.length === 0 ? (
          <p className="p-4 text-center text-sm italic text-gray-500">
            {search ? 'No one matches that search.' : 'No staff found.'}
          </p>
        ) : (
          filtered.map((entry) => {
            const unread = isUnreadFor(entry.thread, myUserId)
            const selected = entry.user.id === selectedUserId

            return (
              <button
                key={entry.user.id}
                type="button"
                onClick={() => onSelect(entry)}
                disabled={entry.isPending}
                title={
                  entry.isPending
                    ? 'This person has not signed in to the app yet, so they cannot be messaged.'
                    : undefined
                }
                className={
                  'flex w-full items-center gap-3 border-b border-gray-100 px-3 py-3 text-left transition-colors dark:border-gray-800 ' +
                  (entry.isPending
                    ? 'cursor-not-allowed opacity-60'
                    : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ') +
                  (selected ? ' bg-blue-50 dark:bg-gray-800' : '')
                }
              >
                <Avatar name={entry.user.name} muted={entry.isPending} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        'truncate text-sm text-gray-800 dark:text-gray-100 ' +
                        (unread ? 'font-bold' : 'font-medium')
                      }
                    >
                      {entry.user.name}
                    </span>
                    <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                      {entry.isPending ? 'Invited' : roleLabel(entry.user)}
                    </span>
                  </div>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {entry.isPending
                      ? 'Has not signed in yet'
                      : entry.thread?.lastMessage || 'No messages yet'}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-[10px] text-gray-400">
                    {previewTime(entry.thread?.lastMessageAt ?? null)}
                  </span>
                  {unread && (
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ChatList
