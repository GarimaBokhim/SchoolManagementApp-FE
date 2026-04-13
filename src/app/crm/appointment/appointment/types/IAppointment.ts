export interface Appointment {
  id: string;
  leadId: string;
  startTime: string;
  endTime: string;
  appointmentDate: string;
  counselorId: string;
  notes: string;
  appointmentStatus: number;
  isActive: boolean;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
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