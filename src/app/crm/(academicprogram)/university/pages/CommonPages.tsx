'use client'

import { useState } from 'react'
import AllUniversity from './All'
import AllCourse from '../../course/pages/All'
import AllIntake from '../../intake/pages/All'
import AllCountry from '../../country/pages/All'
const AllClassDetails = () => {
    const tabs = [
        { id: 'country', label: 'Country' },
        { id: 'university', label: 'University' },
        { id: 'course', label: 'Coursse' },
        { id: 'intake', label: 'Intake' }
    ]

    const [activeTab, setActiveTab] = useState<string>('country')

    const renderContent = () => {
        switch (activeTab) {

            case 'country':
                return <AllCountry />
            case 'university':
                return <AllUniversity />

            case 'course':
                return <AllCourse />

            case 'intake':
                return <AllIntake />
            default:
                return <AllUniversity />
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

export default AllClassDetails