'use client'

import { useState } from 'react'
import AllParticipation from '../../_Participents/pages/All'
import AllActivity from '../../_Activities/pages/All'
import EventSchedule from './static_event_page_for_now/EventSchedule'


const AllCurricularActivities = () => {
  const tabs = [
    { id: 'event', label: 'Event' },        
    { id: 'activity', label: 'Activity' },
    { id: 'participation', label: 'Participation' },
  ]

  const [activeReport, setActiveReport] = useState<string>('event')

  const renderReport = () => {
    switch (activeReport) {
      case 'event':
        return <EventSchedule />
      case 'activity':
        return (
          <div className="text-center">
            <AllActivity />
          </div>
        )
      case 'participation':
        return (
          <div className="text-center">
            <AllParticipation />
          </div>
        )
      default:
        return <EventSchedule />
    }
  }

  return (
    <div className="p-4 h-full">
      <div className="bg-blue-100 rounded-t-xl px-4 pt-4 flex gap-1">
        {tabs.map((t) => {
          const isActive = activeReport === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActiveReport(t.id)}
              className={
                'px-6 py-2 text-sm font-medium ' +
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
      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg h-[90%] p-6 bg-white dark:bg-gray-800 transition-all overflow-auto">
        {renderReport()}
      </div>
    </div>
  )
}

export default AllCurricularActivities