'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { format, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns'
import { FlatAppointment } from './ISchedule'
import { useScheduleAppointments } from './hooks/UseSchedule'

const statusLegend = [
  { status: 'confirmed', label: 'Confirmed', color: 'bg-green-500' },
  { status: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { status: 'cancelled', label: 'Cancelled', color: 'bg-red-500' },
  { status: 'in-progress', label: 'In Progress', color: 'bg-blue-500' },
  { status: 'show', label: 'Show', color: 'bg-purple-500' },
]

const getStatusCardColor = (status: string) => {
  const s = status?.toLowerCase();
  if (s === 'confirmed') return 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50';
  if (s === 'pending') return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-900/50';
  if (s === 'cancelled') return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/50';
  if (s === 'in-progress') return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/50';
  if (s === 'show') return 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-900/50';
  return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700';
}

const getInitials = (name: string) => {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const parseHour = (timeStr: string): number => {
  if (!timeStr) return -1;

  // 12-hour format — has AM or PM
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    const [hourStr] = timeStr.split(':');
    const period = timeStr.includes('PM') ? 'PM' : 'AM';
    let hour = parseInt(hourStr, 10);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return hour;
  }

  // 24-hour format — "HH:MM:SS" or "HH:MM"
  return parseInt(timeStr.split(':')[0], 10);
}

/**
 * Formats a raw time string (any format) into a display string like "10:35 PM"
 */
const formatDisplayTime = (timeStr: string): string => {
  if (!timeStr) return '';
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr;
  const parts = timeStr.split(':');
  const hour = parseInt(parts[0], 10);
  const minute = parts[1] || '00';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour.toString().padStart(2, '0')}:${minute} ${ampm}`;
}

/**
 * Converts a 24h hour number to a slot label like "10:00 AM"
 */
const hourToSlotLabel = (hour: number): string => {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour.toString().padStart(2, '0')}:00 ${ampm}`;
}

const appointmentMatchesSlot = (appointment: FlatAppointment, slotHour: number): boolean => {
  if (!appointment.startTime) return false;
  return parseHour(appointment.startTime) === slotHour;
}

const ScheduleAppointment = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [weekStart, setWeekStart] = useState(new Date())

  const { data: appointments = [], isLoading, error } = useScheduleAppointments()

  useEffect(() => {
    const today = new Date()
    setWeekStart(today)
    setSelectedDate(today)
  }, [])

  /**
   * Dynamically build time slots based on actual appointment hours.
   * Falls back to 9 AM–5 PM if no data yet.
   */
  const timeSlots: number[] = useMemo(() => {
    if (appointments.length === 0) {
      return Array.from({ length: 9 }, (_, i) => i + 9) // 9–17
    }
    const hours = appointments.map((apt) => parseHour(apt.startTime)).filter((h) => h >= 0)
    const minHour = Math.min(...hours, 9)
    const maxHour = Math.max(...hours, 17)
    return Array.from({ length: maxHour - minHour + 1 }, (_, i) => i + minHour)
  }, [appointments])

  const getWeekDays = () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const weekDays = getWeekDays()

  const goToPreviousWeek = () => setWeekStart(subWeeks(weekStart, 1))
  const goToNextWeek = () => setWeekStart(addWeeks(weekStart, 1))
  const goToToday = () => {
    const today = new Date()
    setWeekStart(today)
    setSelectedDate(today)
  }

  const getAppointmentsForDateTime = (date: Date, slotHour: number): FlatAppointment[] => {
    return appointments.filter(
      (apt) => isSameDay(apt.date, date) && appointmentMatchesSlot(apt, slotHour)
    )
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400">Failed to load appointments. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        {/* Left — Navigation */}
        <div className="flex items-center space-x-2">
          <button onClick={goToPreviousWeek} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-200 min-w-40 text-center">
            {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
          </span>
          <button onClick={goToNextWeek} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button onClick={goToToday} className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Today
          </button>
        </div>

        {/* Center — Legend */}
        <div className="flex items-center gap-4">
          {statusLegend.map((item) => (
            <div key={item.status} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full ${item.color}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Right — Add button */}
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add</span>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-8 gap-2 min-h-0 overflow-y-auto">

        {/* Time Column */}
        <div className="flex flex-col">
          <div className="h-[72px] bg-transparent" />
          <div className="space-y-2">
            {timeSlots.map((hour) => (
              <div key={hour} className="h-[120px] flex items-start justify-end pr-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {hourToSlotLabel(hour)}
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
              onClick={() => setSelectedDate(day)}
              className={`text-center p-2 rounded-t-lg cursor-pointer ${
                isSameDay(day, selectedDate)
                  ? 'bg-blue-600 text-white'
                  : isSameDay(day, new Date())
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-b-2 border-emerald-500'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <div className="text-xs font-medium">
                {isSameDay(day, new Date()) ? 'Today' : format(day, 'EEE')}
              </div>
              <div className="text-lg font-bold">{format(day, 'd')}</div>
            </div>

            {/* Time slots */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg p-1 space-y-2 overflow-y-auto">
              {timeSlots.map((hour) => {
                const slotAppointments = getAppointmentsForDateTime(day, hour)
                return (
                  <div key={hour} className="min-h-[120px]">
                    {slotAppointments.length > 0 ? (
                      slotAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`rounded-lg shadow-sm border-2 p-2 transition-all cursor-pointer ${getStatusCardColor(appointment.status)}`}
                        >
                          {/* Time range */}
                          <div className="text-[10px] font-medium text-gray-600 dark:text-gray-300 mb-1">
                            {formatDisplayTime(appointment.startTime)} - {formatDisplayTime(appointment.endTime)}
                          </div>

                          {/* Client info */}
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                              {getInitials(appointment.leadName)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                                {appointment.leadName}
                              </h4>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                {appointment.counselorName}
                              </p>
                            </div>
                          </div>

                          {/* Notes */}
                          {appointment.notes && appointment.notes !== 'string' && (
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 truncate">
                              {appointment.notes}
                            </p>
                          )}

                          {/* Actions */}
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