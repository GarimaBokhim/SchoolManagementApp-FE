'use client'

import { useState } from 'react'
import AllWaterExpenses from './All'
const AllWaterExpensesDetails = () => {
    const tabs = [
        { id: 'WaterExpenses', label: 'WaterExpenses' },
        // { id: 'WaterBillingRule', label: 'WaterBillingRule' },
        // { id: 'WaterBillingRuleSlab', label: 'WaterBillingRuleSlab' },
    ]

    const [activeTab, setActiveTab] = useState<string>('WaterExpenses')

    const renderContent = () => {
        switch (activeTab) {
            case 'WaterExpenses':
                return <AllWaterExpenses />
            // case 'WaterBillingRule':
            //     return <AllWaterBillingRule />
            // case 'WaterBillingRuleSlab':
            //     return <AllWaterBillingRuleSlab />
            default:
                return <AllWaterExpenses />
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

            {/* Content */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg h-[90%] p-6 bg-white dark:bg-gray-800 transition-all overflow-auto">
                {renderContent()}
            </div>
        </div>
    )
}

export default AllWaterExpensesDetails
