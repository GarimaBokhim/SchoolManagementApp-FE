// components/ScheduleAppointment.tsx
'use client'

import React, { useState } from 'react'
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns'

// Mock data for appointments with just 4 statuses
const mockAppointments = [
  {
    id: 1,
    clientName: 'Nimesh Lawati',
    time: '09:00 AM',
    endTime: '09:30 AM',
    purpose: 'Admission Inquiry',
    date: new Date(2026, 2, 16), // March 16, 2026
    status: 'confirmed',
    avatar: 'JS'
  },
  {
    id: 2,
    clientName: 'Garima Rai',
    time: '11:30 AM',
    endTime: '12:15 PM',
    purpose: 'Counseling',
    date: new Date(2026, 2, 16),
    status: 'pending',
    avatar: 'EW'
  },
  {
    id: 3,
    clientName: 'Suman Rai',
    time: '02:00 PM',
    endTime: '02:45 PM',
    purpose: 'Follow-up Meeting',
    date: new Date(2026, 2, 16),
    status: 'confirmed',
    avatar: 'MB'
  },
  {
    id: 4,
    clientName: 'Bhabin Sapkota',
    time: '10:00 AM',
    endTime: '10:30 AM',
    purpose: 'Document Submission',
    date: new Date(2026, 2, 17),
    status: 'confirmed',
    avatar: 'SD'
  },
  {
    id: 5,
    clientName: 'Nitesh Kafle',
    time: '03:30 PM',
    endTime: '04:15 PM',
    purpose: 'Visa Consultation',
    date: new Date(2026, 2, 17),
    status: 'cancelled',
    avatar: 'RJ'
  },
  {
    id: 6,
    clientName: 'Pankaj Pokhrel',
    time: '01:00 PM',
    endTime: '01:45 PM',
    purpose: 'Course Selection',
    date: new Date(2026, 2, 18),
    status: 'confirmed',
    avatar: 'LA'
  },
  {
    id: 7,
    clientName: 'Asmita Basnet',
    time: '10:00 AM',
    endTime: '10:50 AM',
    purpose: 'Scholarship Interview',
    date: new Date(2026, 2, 16),
    status: 'in-progress',
    avatar: 'DC'
  },
  {
    id: 8,
    clientName: 'Ichya Chamlagain',
    time: '04:00 PM',
    endTime: '04:30 PM',
    purpose: 'Application Review',
    date: new Date(2026, 2, 16),
    status: 'pending',
    avatar: 'MG'
  },
  {
    id: 9,
    clientName: 'Gaurab Sapkota',
    time: '09:00 AM',
    endTime: '09:45 AM',
    purpose: 'Visa Interview Prep',
    date: new Date(2026, 2, 17),
    status: 'in-progress',
    avatar: 'JW'
  },
  {
    id: 10,
    clientName: 'Sujan Shrestha',
    time: '02:00 PM',
    endTime: '02:30 PM',
    purpose: 'Document Verification',
    date: new Date(2026, 2, 17),
    status: 'cancelled',
    avatar: 'PL'
  },
  {
    id: 11,
    clientName: 'Rajesh Rai',
    time: '11:00 AM',
    endTime: '11:45 AM',
    purpose: 'Course Counseling',
    date: new Date(2026, 2, 18),
    status: 'pending',
    avatar: 'TB'
  },
  {
    id: 12,
    clientName: 'Balen Shah',
    time: '03:00 PM',
    endTime: '03:30 PM',
    purpose: 'Fee Payment Discussion',
    date: new Date(2026, 2, 18),
    status: 'in-progress',
    avatar: 'JK'
  },
]

// Time slots for the time column
const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
]

const ScheduleAppointment = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 16)) // March 16, 2026
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 2, 16))

  // Get week days starting from current date
  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 }) // Start from Monday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }

  const weekDays = getWeekDays()

  // Get appointments for a specific date and time
  const getAppointmentsForDateTime = (date: Date, time: string) => {
    return mockAppointments.filter(apt => isSameDay(apt.date, date) && apt.time === time)
  }

  const goToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1))
  }

  const goToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Status color mapping for entire card - Matching exactly with legend
  const getStatusCardColor = (status: string) => {
    switch(status) {
      case 'confirmed':
        return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50'
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/50'
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/50'
      default:
        return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
    }
  }

  // Status legend items - Just 4 statuses
  const statusLegend = [
    { status: 'confirmed', label: 'Confirmed', color: 'bg-green-500' },
    { status: 'pending', label: 'Pending', color: 'bg-yellow-500' },
    { status: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
    { status: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header with navigation, centered legend, and add button */}
      <div className="flex items-center justify-between mb-6">
        {/* Left side - Navigation */}
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousWeek}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-200 min-w-40 text-center">
            {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
          </span>
          <button
            onClick={goToNextWeek}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Center - Legend (no background box) */}
        <div className="flex items-center gap-4">
          {statusLegend.map((item) => (
            <div key={item.status} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Right side - Add button */}
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add</span>
        </button>
      </div>

      {/* Calendar Grid with Time Column */}
      <div className="flex-1 grid grid-cols-8 gap-2 min-h-0">
        {/* Time Column */}
        <div className="flex flex-col">
          <div className="h-[72px] bg-transparent"></div> {/* Spacer for header alignment */}
          <div className="space-y-2">
            {timeSlots.map((time) => (
              <div key={time} className="h-[120px] flex items-start justify-end pr-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Day Columns */}
        {weekDays.map((day, index) => (
          <div key={index} className="flex flex-col h-full">
            {/* Day header */}
            <div 
              className={`text-center p-2 rounded-t-lg ${
                isSameDay(day, selectedDate) 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="text-xs font-medium">
                {format(day, 'EEE')}
              </div>
              <div className="text-lg font-bold">
                {format(day, 'd')}
              </div>
            </div>

            {/* Time slots container */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg p-1 space-y-2 overflow-y-auto">
              {timeSlots.map((time) => {
                const appointments = getAppointmentsForDateTime(day, time)
                
                return (
                  <div key={time} className="min-h-[120px]">
                    {appointments.length > 0 ? (
                      appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`rounded-lg shadow-sm border-2 p-2 transition-all cursor-pointer ${getStatusCardColor(appointment.status)}`}
                        >
                          {/* Time range - NEW */}
                          <div className="text-[10px] font-medium text-gray-600 dark:text-gray-300 mb-1">
                            {appointment.time} - {appointment.endTime}
                          </div>
                          
                          {/* Client info */}
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                              {appointment.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                                {appointment.clientName}
                              </h4>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                {appointment.purpose}
                              </p>
                            </div>
                          </div>

                          {/* Actions - Small icons */}
                          <div className="flex items-center justify-end space-x-1 mt-2">
                            <button className="p-1 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded transition-colors">
                              <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button className="p-1 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded transition-colors">
                              <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Empty slot with add button
                      <button className="w-full h-full min-h-[120px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-400 dark:text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScheduleAppointment