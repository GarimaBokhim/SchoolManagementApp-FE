'use client'

import React, { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { AppUserModel } from '../types/IChat'
import { useCurrentEndUser, useEndUserChatRoster } from '../hooks'
import { ChatList } from '../components/ChatList'
import { ChatConversation } from '../components/ChatConversation'

const Notice = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className="flex h-full items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg">
    <div className="max-w-md text-center">
      <h3 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{children}</p>
    </div>
  </div>
)

export const AllChat: React.FC = () => {
  const currentUser = useCurrentEndUser()
  const { entries, loading, error, isConfigured } = useEndUserChatRoster(currentUser)
  const [selectedPeer, setSelectedPeer] = useState<AppUserModel | null>(null)

  if (!isConfigured) {
    return (
      <Notice title="Chat is not configured">
        The <code>NEXT_PUBLIC_FIREBASE_*</code> environment variables are missing.
        Please add them to <code>.env.local</code> and restart the development server.
      </Notice>
    )
  }

  if (!currentUser) {
    return (
      <Notice title="Sign-in Required">
        Unable to resolve user session. Please sign out and log back in.
      </Notice>
    )
  }

  if (error) {
    return (
      <Notice title="Chat Service Error">
        {error} — please ensure Firebase connection and rules are properly configured.
      </Notice>
    )
  }

  return (
    <div className="flex h-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-sm">
      {/* Contact List */}
      <div className={selectedPeer ? 'hidden md:flex' : 'flex w-full md:w-auto'}>
        <ChatList
          entries={entries}
          currentUserId={currentUser.id}
          selectedUserId={selectedPeer?.id ?? null}
          onSelect={(entry) => setSelectedPeer(entry.user)}
          loading={loading}
        />
      </div>

      {/* Conversation Thread or Empty State */}
      {selectedPeer ? (
        <ChatConversation
          currentUser={currentUser}
          peer={selectedPeer}
          onBack={() => setSelectedPeer(null)}
        />
      ) : (
        <div className="hidden flex-1 flex-col items-center justify-center bg-slate-50 p-6 md:flex dark:bg-gray-900">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 dark:bg-indigo-950/50 mb-3">
            <MessageSquare className="h-8 w-8" />
          </div>
          <h4 className="text-base font-semibold text-gray-700 dark:text-gray-200">
            Your Messages
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs text-center">
            Select a colleague or contact from the left panel to start messaging.
          </p>
        </div>
      )}
    </div>
  )
}

export default AllChat
