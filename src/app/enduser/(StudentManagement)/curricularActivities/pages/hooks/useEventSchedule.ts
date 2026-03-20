import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { EventScheduleResponse, FlatEventSchedule } from "../types/Ievent";

export const eventScheduleQueryKey = "EventSchedule";

const parseEventTime = (timeStr: string): string => {
  if (!timeStr) return "";
  // Already has AM/PM
  if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
  // HH:MM:SS or HH:MM
  const parts = timeStr.split(":");
  const hour = parseInt(parts[0], 10);
  const minute = parts[1] || "00";
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour.toString().padStart(2, "0")}:${minute} ${ampm}`;
};

export const useScheduleEvents = () => {
  return useQuery({
    queryKey: [eventScheduleQueryKey],
    queryFn: async (): Promise<FlatEventSchedule[]> => {
      const response = await api.get<EventScheduleResponse>(
        "/api/Student/ScheduleEvents"
      );

      const eventsList = response.data?.eventsList ?? [];
      const flat: FlatEventSchedule[] = [];

      eventsList.forEach((listItem, listIndex) => {
        const details = listItem.eventsDetails;
        Object.entries(details).forEach(([dateStr, item], entryIndex) => {
          // Skip invalid date keys like "string"
          if (!dateStr || dateStr === "string") return;

          const [year, month, day] = dateStr.split("-").map(Number);
          if (!year || !month || !day) return;

          flat.push({
            id: `${listIndex}-${entryIndex}-${dateStr}`,
            date: new Date(year, month - 1, day),
            title: item.title,
            descriptions: item.descriptions,
            eventsType: item.eventsType,
            eventsDate: item.eventsDate,
            participants: item.participants,
            eventTime: parseEventTime(item.eventTime),
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