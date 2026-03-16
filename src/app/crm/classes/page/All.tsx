'use client'

import { useState } from 'react'
import AllClassesTab from './AllClasses'
import AllRegistrationsTab from './AllRegistration'


const AllClasses = () => {
  const tabs = [
    { id: 'class', label: 'Class' },
    { id: 'registration', label: 'Training Registration' },
  ]

  const [activeTab, setActiveTab] = useState<string>('class')

  const renderContent = () => {
    switch (activeTab) {
      case 'class': return <AllClassesTab />
      case 'registration': return <AllRegistrationsTab />
      default: return <AllClassesTab />
    }
  }

  return (
    <div className="p-4 h-full">
      <div className="bg-blue-100 rounded-t-xl px-4 pt-4 flex gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                'px-6 py-2 text-sm font-medium transition-all ' +
                (isActive
                  ? 'text-blue-700 border-b-2 border-blue-700 font-semibold'
                  : 'text-blue-600 hover:bg-blue-200 rounded-sm')
              }
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg h-[90%] p-6 bg-white dark:bg-gray-800 transition-all overflow-auto">
        {renderContent()}
      </div>
    </div>
  )
}

export default AllClasses