'use client'

import { useState } from 'react'
import AllVisaApplicationsForm from '../process/component/AllvisaApplicationForm'
import AllVisaStatusForm from '../visastatus/component/Allvisastatus'

const AllProcesses = () => {
  const classesTabs = [
    { id: 'VisaApplication', label: 'Visa Application' },
    { id: 'Visastatus', label: 'Visa Status' },
  ]

  const [activeTab, setActiveTab] = useState<string>('VisaApplication')

  const renderContent = () => {
    switch (activeTab) {
      case 'VisaApplication':
        return <AllVisaApplicationsForm />
      case 'Visastatus':
        return <AllVisaStatusForm />
      default:
        return <AllVisaApplicationsForm />
    }
  }

  return (
    <div className="p-4 h-full">
      {/* Tabs */}
      <div className="bg-blue-100 rounded-t-xl px-4 pt-4 flex gap-1">
        {classesTabs.map((tab) => {
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

export default AllProcesses
