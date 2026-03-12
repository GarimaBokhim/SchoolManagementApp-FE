export interface Appointment {
  id: string;
  studentName: string;
  counselorName: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes: string;
}

export interface AddAppointmentPayload {
  leadId: string;
  startTime: string;
  endTime: string;
  appointmentDate: string;
  counselorId: string;
  notes: string;
  appointmentStatus: number;
}