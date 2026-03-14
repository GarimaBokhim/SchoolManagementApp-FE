import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/instance";
import { FlatAppointment, ScheduleResponse } from "../ISchedule";


export const scheduleQueryKey = "ScheduleAppointments";

const parseTime = (timeStr: string): string => {
  if (!timeStr) return "";
  const [hourStr, minuteStr] = timeStr.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr || "00";
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour.toString().padStart(2, "0")}:${minute} ${ampm}`;
};

export const useScheduleAppointments = () => {
  return useQuery({
    queryKey: [scheduleQueryKey],
    queryFn: async (): Promise<FlatAppointment[]> => {
      const response = await api.get<ScheduleResponse>(
        "/api/Enrolments/ScheduleAppointments"
      );

      const leadDetails = response.data?.leadDetails ?? [];
      const flat: FlatAppointment[] = [];

      leadDetails.forEach((leadItem, leadIndex) => {
        const schedule = leadItem.AppointmentSchedule;
        Object.entries(schedule).forEach(([dateStr, item], entryIndex) => {
          const [year, month, day] = dateStr.split("-").map(Number);
          flat.push({
            id: `${leadIndex}-${entryIndex}-${dateStr}`,
            date: new Date(year, month - 1, day),
            counselorName: item.counselorName,
            leadName: item.leadName,
            startTime: parseTime(item.startTime),
            endTime: parseTime(item.endTime),
            notes: item.notes,
            status: item.status,
          });
        });
      });

      return flat;
    },
  });
};