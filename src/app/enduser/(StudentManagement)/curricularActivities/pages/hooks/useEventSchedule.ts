import { useQuery } from '@tanstack/react-query'
import { api } from '@/utils/instance'
import {
  ActivityByEventResponse,
  EventScheduleResponse,
  FlatEventSchedule,
} from '../types/Ievent'

export const eventScheduleQueryKey = 'EventSchedule'
const eventQuery = 'Events'
const activityQuery = 'Activities'

/** Returns every date in [start, end] inclusive as an array of Date objects */
const expandDateRange = (fromDate: string, toDate: string): Date[] => {
  const start = new Date(fromDate)
  const end = new Date(toDate)

  // Guard: if either date is invalid, return just the start
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return [start]

  // Normalise times so we count whole days only
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  const dates: Date[] = []
  const cursor = new Date(start)
  while (cursor <= end) {
    dates.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return dates
}

export const useScheduleEvents = () => {
  return useQuery({
    queryKey: [eventScheduleQueryKey, eventQuery, activityQuery],
    queryFn: async (): Promise<FlatEventSchedule[]> => {
      const response = await api.get<EventScheduleResponse>(
        '/api/Student/ScheduleEvents'
      )

      const eventsList = response.data?.eventsList ?? []
      const flat: FlatEventSchedule[] = []

      eventsList.forEach((listItem, listIndex) => {
        Object.entries(listItem.eventsDetails).forEach(
          ([key, item], entryIndex) => {
            const eventDate = new Date(item.fromDate)
            if (!isNaN(eventDate.getTime())) {
              flat.push({
                id: `${listIndex}-${entryIndex}-${key}`,
                eventsId: item.id,
                date: eventDate,
                title: item.title,
                descriptions: item.descriptions,
                eventsType: item.eventsType,
                fromDate: item.fromDate,
                toDate: item.toDate,
                participants: item.participants,
                eventTime: item.eventTime,
                venue: item.venue,
                chiefGuest: item.chiefGuest,
                organizer: item.organizer,
                mentor: item.mentor,
              })
            }
          }
        )
      })

      return flat
    },
  })
}

export const useActivitiesByEvent = (eventsId: string | null) => {
  return useQuery({
    queryKey: ['ActivitiesByEvent', eventsId],
    queryFn: async () => {
      const response = await api.get<ActivityByEventResponse>(
        `/api/CocurricularActivities/ActivityByEvents?eventsId=${eventsId}`
      )
      return response.data?.Items ?? []
    },
    enabled: !!eventsId,
    staleTime: 2 * 60 * 1000,
  })
}
