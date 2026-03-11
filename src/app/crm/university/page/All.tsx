'use client'
import { useState } from 'react'
import AllUniversity from '../univer-sity/pages/All'
import AllCourse from '../courses/pages/All'
import AllIntake from '../intake/pages/All'
import AllRequirements from '../requirements/all'

const AllAcademicsProgram = () => {
  const tabs = [
    { id: 'university', label: 'University', color: 'gray' },
    { id: 'course', label: 'Course', color: 'gray' },
    { id: 'intake', label: 'Intake', color: 'gray' },
    { id: 'requirements', label: 'Requirements', color: 'gray' },
  ]

  const [activeTab, setActiveTab] = useState<string>('university')

  const renderContent = () => {
    switch (activeTab) {
      case 'university':
        return (
          <div className="text-center">
            <AllUniversity />
          </div>
        )
      case 'course':
        return (
          <div className="text-center">
            <AllCourse />
          </div>
        )
      case 'intake':
        return (
          <div className="text-center">
            <AllIntake />
          </div>
        )
      case 'requirements':
        return (
          <div className="text-center">
            <AllRequirements />
          </div>
        )
      default:
        return (
          <div className="text-center">
            <AllUniversity />
          </div>
        )
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

export default AllAcademicsProgram
