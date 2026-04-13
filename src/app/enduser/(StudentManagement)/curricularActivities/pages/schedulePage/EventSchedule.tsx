'use client'

import React, { useState, useEffect } from 'react'
import { format, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns'
import { FlatEventSchedule } from '../types/Ievent'
import { useScheduleEvents, useActivitiesByEvent } from '../hooks/useEventSchedule'

const EVENT_TYPE_MAP: Record<number, { label: string; cardColor: string; dotColor: string }> = {
  1:  { label: 'Academic',    cardColor: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 hover:bg-blue-200',         dotColor: 'bg-blue-500'   },
  2:  { label: 'Sports',      cardColor: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 hover:bg-green-200',     dotColor: 'bg-green-500'  },
  3:  { label: 'Culture',     cardColor: 'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700 hover:bg-pink-200',           dotColor: 'bg-pink-500'   },
  4:  { label: 'Seminar',     cardColor: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700 hover:bg-yellow-200', dotColor: 'bg-yellow-500' },
  5:  { label: 'Workshop',    cardColor: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 hover:bg-orange-200', dotColor: 'bg-orange-500' },
  6:  { label: 'Competition', cardColor: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700 hover:bg-red-200',               dotColor: 'bg-red-500'    },
  7:  { label: 'Meeting',     cardColor: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700 hover:bg-purple-200', dotColor: 'bg-purple-500' },
  8:  { label: 'Celebration', cardColor: 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 hover:bg-indigo-200', dotColor: 'bg-indigo-500' },
  9:  { label: 'Holiday',     cardColor: 'bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700 hover:bg-teal-200',           dotColor: 'bg-teal-500'   },
  10: { label: 'Examination', cardColor: 'bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700 hover:bg-gray-200',           dotColor: 'bg-gray-500'   },
  99: { label: 'Other',       cardColor: 'bg-slate-100 dark:bg-slate-900/30 border-slate-300 dark:border-slate-700 hover:bg-slate-200',     dotColor: 'bg-slate-500'  },
}

// Activity category label map
const ACTIVITY_CATEGORY_MAP: Record<number, string> = {
  1: 'Sports',
  2: 'Academic',
  3: 'Creative Art',
  4: 'Environmental',
  5: 'Performing Arts',
  6: 'Technical',
  7: 'Social Service',
  8: 'Vocational',
}

const getEventTypeInfo = (eventsType: number) =>
  EVENT_TYPE_MAP[eventsType] ?? {
    label: 'Other',
    cardColor: 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-200',
    dotColor: 'bg-gray-500',
  }

const getInitials = (name: string) => {
  if (!name) return '??'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDisplayTime = (timeStr: string): string => {
  if (!timeStr) return ''
  if (timeStr.includes('AM') || timeStr.includes('PM')) return timeStr
  const parts = timeStr.split(':')
  const hour = parseInt(parts[0], 10)
  const minute = parts[1] || '00'
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour.toString().padStart(2, '0')}:${minute} ${ampm}`
}

// ── Event Modal ───────────────────────────────────────────────────

const EventModal = ({
  event,
  onClose,
}: {
  event: FlatEventSchedule | null
  onClose: () => void
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all')

  // Fetch real activities for this event
  const {
    data: activities = [],
    isLoading: activitiesLoading,
  } = useActivitiesByEvent(event?.eventsId ?? null)

  // Reset tab when event changes
  useEffect(() => {
    setActiveTab('all')
  }, [event?.eventsId])

  if (!event) return null

  const typeInfo = getEventTypeInfo(event.eventsType)

  // Determine upcoming/completed by comparing activityDate to today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const enriched = activities.map((a) => {
    const actDate = a.activityDate ? new Date(a.activityDate) : null
    const status = actDate && actDate < today ? 'completed' : 'upcoming'
    return { ...a, status }
  })

  const filtered =
    activeTab === 'all'
      ? enriched
      : enriched.filter((a) => a.status === activeTab)

  const tabs: { key: 'all' | 'upcoming' | 'completed'; label: string }[] = [
    { key: 'all',       label: `All Activities (${enriched.length})` },
    { key: 'upcoming',  label: `Upcoming (${enriched.filter(a => a.status === 'upcoming').length})` },
    { key: 'completed', label: `Completed (${enriched.filter(a => a.status === 'completed').length})` },
  ]

  return (
    // Same margin as AddActivityModal to respect sidebar
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0">
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Card */}
        <div className={`p-6 border-b ${typeInfo.cardColor} rounded-t-xl`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${typeInfo.dotColor}`}>
                  {typeInfo.label}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  🕐 {formatDisplayTime(event.eventTime)}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {event.title}
              </h2>

              <div className="space-y-2 mt-4">
                {event.venue && event.venue !== 'string' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <span>📍</span> {event.venue}
                  </p>
                )}
                {event.organizer && event.organizer !== 'string' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <span>🧑‍💼</span> Organized by: {event.organizer}
                  </p>
                )}
                {event.participants && event.participants !== 'string' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <span>👥</span> Participants: {event.participants}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span>📅</span> {format(event.date, 'MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 px-2 font-medium text-sm transition-colors relative whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activitiesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
              <svg className="w-10 h-10 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">No activities found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((activity, idx) => {
                const categoryLabel = ACTIVITY_CATEGORY_MAP[activity.activityCategory] ?? 'Other'
                return (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    {/* Top row: name + status badge */}
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {activity.ActivityName}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                          activity.status === 'completed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}
                      >
                        {activity.status === 'completed' ? '✅ Completed' : '⏳ Upcoming'}
                      </span>
                    </div>

                    {/* Category pill */}
                    <div className="mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {categoryLabel}
                      </span>
                    </div>

                    {/* Time & Date info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>📅 {activity.activityDate}</span>
                      <span>🕐 {formatDisplayTime(activity.startTime)} – {formatDisplayTime(activity.endTime)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main EventSchedule ────────────────────────────────────────────

const EventSchedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [weekStart, setWeekStart] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<FlatEventSchedule | null>(null)

  const { data: events = [], isLoading, error } = useScheduleEvents()

  useEffect(() => {
    const t = new Date()
    setWeekStart(t)
    setSelectedDate(t)
  }, [])

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const goToPreviousWeek = () => setWeekStart(subWeeks(weekStart, 1))
  const goToNextWeek   = () => setWeekStart(addWeeks(weekStart, 1))
  const goToToday      = () => {
    const t = new Date()
    setWeekStart(t)
    setSelectedDate(t)
  }

  const getEventsForDate = (date: Date): FlatEventSchedule[] =>
    events.filter((e) => isSameDay(e.date, date))

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
        <p className="text-red-500 dark:text-red-400">Failed to load events. Please try again.</p>
      </div>
    )
  }

  return (
    <>
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
              {format(weekDays[0], 'MMM d')} – {format(weekDays[6], 'MMM d, yyyy')}
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
          <div className="flex items-center gap-3 flex-wrap justify-center">
            {Object.values(EVENT_TYPE_MAP).slice(0, 6).map((item) => (
              <div key={item.label} className="flex items-center space-x-1">
                <div className={`w-3 h-3 rounded-full ${item.dotColor}`} />
                <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
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
        <div className="flex-1 grid grid-cols-7 gap-2 min-h-0 overflow-y-auto">
          {weekDays.map((day, index) => {
            const dayEvents = getEventsForDate(day)
            return (
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
                  {dayEvents.length > 0 && (
                    <div className="text-[10px] mt-0.5 opacity-80">
                      {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Events for this day */}
                <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg p-1 space-y-2 overflow-y-auto min-h-[400px]">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event) => {
                      const typeInfo = getEventTypeInfo(event.eventsType)
                      return (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`rounded-lg shadow-sm border-2 p-2 transition-all cursor-pointer ${typeInfo.cardColor}`}
                        >
                          {/* Type badge + time */}
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white ${typeInfo.dotColor}`}>
                              {typeInfo.label}
                            </span>
                            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">
                              🕐 {formatDisplayTime(event.eventTime)}
                            </span>
                          </div>

                          {/* Title + venue */}
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${typeInfo.dotColor}`}>
                              {getInitials(event.title)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                                {event.title}
                              </h4>
                              {event.venue && event.venue !== 'string' && (
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                  📍 {event.venue}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Organizer */}
                          {event.organizer && event.organizer !== 'string' && (
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 truncate">
                              🧑‍💼 {event.organizer}
                            </p>
                          )}

                          {/* Participants */}
                          {event.participants && event.participants !== 'string' && (
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                              👥 {event.participants}
                            </p>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-end space-x-1 mt-2">
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded transition-colors"
                            >
                              <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded transition-colors"
                            >
                              <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <button className="w-full mt-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-400 dark:text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center py-8">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </>
  )
}

export default EventSchedule