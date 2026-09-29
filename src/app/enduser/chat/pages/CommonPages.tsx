'use client'

import React, { useState } from 'react'
import AllChat from './All'

const AllChatDetails: React.FC = () => {
  const tabs = [{ id: 'chat', label: 'Chat' }]
  const [activeTab, setActiveTab] = useState<string>('chat')

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="bg-indigo-50/70 dark:bg-gray-800 rounded-t-xl px-4 pt-3 flex gap-1 border-b border-indigo-100 dark:border-gray-700">
        {tabs.map((t) => {
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-2 text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'text-[#5D6AFB] border-b-2 border-[#5D6AFB] font-semibold'
                  : 'text-gray-600 hover:bg-indigo-100/60 rounded-t-md dark:text-gray-300'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      <div className="border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-xl h-[calc(100%-3.2rem)] p-3 bg-white dark:bg-gray-800 transition-all">
        {activeTab === 'chat' && <AllChat />}
      </div>
    </div>
  )
}

export default AllChatDetails
