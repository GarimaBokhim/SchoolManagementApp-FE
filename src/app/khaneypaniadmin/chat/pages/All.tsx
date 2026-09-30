'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import ChatConversation from '../components/ChatConversation'
import ChatList from '../components/ChatList'
import { useChatIdentity, useChatRoster, useRegisterChatUser } from '../hooks'
import { ChatUser } from '../types/IChat'

const Notice = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className="flex h-full items-center justify-center p-8">
    <div className="max-w-md text-center">
      <h3 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{children}</p>
    </div>
  </div>
)

const AllChat = () => {
  const me = useChatIdentity()
  // Publish our own directory entry so staff on the mobile app can start a
  // conversation with this admin.
  useRegisterChatUser(me)

  const { entries, loading, error, isConfigured } = useChatRoster(me)
  const [peer, setPeer] = useState<ChatUser | null>(null)

  if (!isConfigured) {
    return (
      <Notice title="Chat is not configured">
        The NEXT_PUBLIC_FIREBASE_* variables are missing. Add them to{' '}
        <code>.env</code> (and to the Vercel project settings for deployed
        builds), then restart the dev server.
      </Notice>
    )
  }

  if (!me) {
    return (
      <Notice title="You need to be signed in to chat">
        Your session could not be read. Try signing out and back in.
      </Notice>
    )
  }

  if (error) {
    return (
      <Notice title="Chat is unavailable">
        {error} — check that Firestore rules are deployed and that anonymous
        sign-in is enabled for the water-bill-manager-dev project.
      </Notice>
    )
  }

  return (
    <div className="flex h-full overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      {/* On narrow screens the list and the thread take turns; from md up they
          sit side by side. */}
      <div className={peer ? 'hidden md:flex' : 'flex w-full md:w-auto'}>
        <ChatList
          entries={entries}
          myUserId={me.id}
          selectedUserId={peer?.id ?? null}
          onSelect={(entry) => setPeer(entry.user)}
          loading={loading}
        />
      </div>

      {peer ? (
        <ChatConversation me={me} peer={peer} onBack={() => setPeer(null)} />
      ) : (
        <div className="hidden flex-1 items-center justify-center bg-gray-50 md:flex dark:bg-gray-900">
          <div className="text-center">
            <MessageSquare className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select a staff member to start chatting.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllChat
