// app/crm/documents/pages/All.tsx
'use client'
import { useState } from 'react'
import AllDocument from '../_document/pages/All'
import AllDocumentType from '../_documentType/page/All'
import AllRequirementsForm from '../../university/requirements/components/AllRequirementsForm'
import AllIntakeForm from '../../university/intake/components/AllIntakeForm'


const AllDocuments = () => {
  const tabs = [
    { id: 'document', label: 'Documents' },
    { id: 'documentType', label: 'Document Types' },
    {id:'requirements', label:'Requirements'},
      { id: 'intake', label: 'Intake', color: 'gray' },
  ]

  const [activeTab, setActiveTab] = useState<string>('document')

  const renderContent = () => {
    switch (activeTab) {
      case 'document':
        return <AllDocument />
      case 'documentType':
        return <AllDocumentType />
      case 'requirements':
        return <AllRequirementsForm/>
      case 'intake':
        return <AllIntakeForm/>
      default:
        return <AllDocument />
    }
  }

  return (
    <div className="p-4 h-full">
      {/* Tabs */}
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

      {/* Content */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg h-[90%] p-6 bg-white dark:bg-gray-800 transition-all overflow-auto">
        {renderContent()}
      </div>
    </div>
  )
}

export default AllDocuments