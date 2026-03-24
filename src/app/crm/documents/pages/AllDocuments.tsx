'use client'
import { useState } from 'react'
import AllDocument from '../page/All'
import AllDocumentType from '../page/AllDoucumetType'

const AllDocuments = () => {
  const tabs = [
    { id: 'document', label: 'Document' },
    { id: 'documentType', label: 'Document Types' },
  ]

  const [activeTab, setActiveTab] = useState<string>('document')

  const renderContent = () => {
    switch (activeTab) {
      case 'document':     return <AllDocument />
      case 'documentType': return <AllDocumentType />
      default:             return <AllDocument />
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
                'px-6 py-2 text-sm font-medium ' +
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

export default AllDocuments