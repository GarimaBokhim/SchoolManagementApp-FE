import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { ActivityByEventResponse, EventScheduleResponse, FlatEventSchedule } from "../types/Ievent";

export const eventScheduleQueryKey = "EventSchedule";

export const useScheduleEvents = () => {
  return useQuery({
    queryKey: [eventScheduleQueryKey],
    queryFn: async (): Promise<FlatEventSchedule[]> => {
      const response = await api.get<EventScheduleResponse>(
        "/api/Student/ScheduleEvents"
      );

      const eventsList = response.data?.eventsList ?? [];
      const flat: FlatEventSchedule[] = [];
      const today = new Date();

      eventsList.forEach((listItem, listIndex) => {
        const details = listItem.eventsDetails;
        Object.entries(details).forEach(([dateStr, item], entryIndex) => {
          let eventDate: Date;
          if (!dateStr || dateStr === "string") {
            eventDate = today;
          } else {
            const [year, month, day] = dateStr.split("-").map(Number);
            if (!year || !month || !day) {
              eventDate = today;
            } else {
              eventDate = new Date(year, month - 1, day);
            }
          }

          flat.push({
            id: `${listIndex}-${entryIndex}-${dateStr}`,
            eventsId: item.id, // real event id for ActivityByEvents API
            date: eventDate,
            title: item.title,
            descriptions: item.descriptions,
            eventsType: item.eventsType,
            eventsDate: item.eventsDate,
            participants: item.participants,
            eventTime: item.eventTime,
            venue: item.venue,
            chiefGuest: item.chiefGuest,
            organizer: item.organizer,
            mentor: item.mentor,
          });
        });
      });

      return flat;
    },
  });
};

// ── Activity by Event hook ────────────────────────────────────────

export const useActivitiesByEvent = (eventsId: string | null) => {
  return useQuery({
    queryKey: ["ActivitiesByEvent", eventsId],
    queryFn: async () => {
      const response = await api.get<ActivityByEventResponse>(
        `/api/CocurricularActivities/ActivityByEvents?eventsId=${eventsId}`
      );
      return response.data?.Items ?? [];
    },
    enabled: !!eventsId, // only fetch when we have an id
    staleTime: 2 * 60 * 1000,
  });
};