'use client'

import { useState } from 'react'
import AllChat from './All'

const AllChatDetails = () => {
    const tabs = [
        { id: 'chat', label: 'Chat' },
    ]

    const [activeTab, setActiveTab] = useState<string>('chat')

    const renderContent = () => {
        switch (activeTab) {
            case 'chat':
                return <AllChat />
            default:
                return <AllChat />
        }
    }

    return (
        <div className="p-4 h-full">
            <div className="bg-blue-100 rounded-t-xl px-4 pt-4 flex gap-1">
                {tabs.map((t) => {
                    const isActive = activeTab === t.id
                    return (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={
                                'px-6 py-2 text-sm font-medium transition-all ' +
                                (isActive
                                    ? 'text-blue-700 border-b-2 border-blue-700 font-semibold'
                                    : 'text-blue-600 hover:bg-blue-200 rounded-sm')
                            }
                        >
                            {t.label}
                        </button>
                    )
                })}
            </div>

            {/* Content — fixed height so the message list scrolls internally
                rather than growing the page. */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg h-[calc(100%-3.5rem)] p-4 bg-white dark:bg-gray-800 transition-all">
                {renderContent()}
            </div>
        </div>
    )
}

export default AllChatDetails
