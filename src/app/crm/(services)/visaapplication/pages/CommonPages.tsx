'use client'

import { useState } from 'react'
import AllVisaApplication from './All'
import AllVisaStatus from '../../visastatus/pages/All'
const AllVisaApplicationDetails = () => {
    const tabs = [
        { id: 'visaApplication', label: 'VisaApplication' },
        { id: 'visastatus', label: 'VisaStatus' },
    ]

    const [activeTab, setActiveTab] = useState<string>('visaApplication')

    const renderContent = () => {
        switch (activeTab) {
            case 'instantInvoice':
                return <AllVisaApplication />
            case 'visastatus':
                return <AllVisaStatus />
            default:
                return <AllVisaApplication />
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

export default AllVisaApplicationDetails