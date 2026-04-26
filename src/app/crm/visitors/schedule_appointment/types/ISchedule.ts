export interface AppointmentScheduleItem {
  counselorName: string;
  leadName: string;
  startTime: string;
  endTime: string;
  notes: string;
  status: string;
}

export interface ScheduleResponse {
  leadDetails: Array<{
    AppointmentSchedule: Record<string, AppointmentScheduleItem>;
  }>;
}

export interface FlatAppointment {
  id: string;
  date: Date;
  counselorName: string;
  leadName: string;
  startTime: string;
  endTime: string;
  notes: string;
  status: string;
}