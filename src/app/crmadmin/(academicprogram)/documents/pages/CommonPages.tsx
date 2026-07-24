'use client'

import { useState } from 'react'
import AllDocumentsType from '../../documentstype/pages/All'
import ApplicantDetails from './ApplicantDetails'
const AllDocumentsDetails = () => {
    const tabs = [
        { id: 'documents', label: 'Documents' },
        { id: 'documentType', label: 'DocumentType' },

    ]

    const [activeTab, setActiveTab] = useState<string>('documents')
    const renderContent = () => {
        switch (activeTab) {
            case 'documents':
                return <ApplicantDetails />
            case 'documentType':
                return <AllDocumentsType />


            default:
                return <AllDocumentsType />
        }
    }

    return (
        <div className="p-4 h-full">

            {/* Tabs */}
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

            {/* Content */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg h-[90%] p-6 bg-white dark:bg-gray-800 transition-all overflow-auto">
                {renderContent()}
            </div>
        </div>
    )
}

export default AllDocumentsDetails