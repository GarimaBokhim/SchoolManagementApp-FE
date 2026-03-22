// src/app/crm/applications/followups/types/IFollowUps.ts

export interface FollowUp {
  id: string
  appointmentId: string
  startTime: string
  endTime: string
  followUpDate: string
  notes: string
  followUpStatus: number
  isActive: boolean
  schoolId: string
  createdBy: string
  createdAt: string
  modifiedBy: string
  modifiedAt: string
}

export interface AddFollowUpPayload {
  leadId: string
  startTime: string
  endTime: string
  followUpDate: string
  notes: string
  followUpStatus: number
}

export interface FollowUpApiResponse {
  Items: FollowUp[]
  TotalItems: number
  PageIndex: number
  pageSize: number
  TotalPages: number
  FirstPage: number
  LastPage: number
  NextPage?: number
  PreviousPage?: number
}

export interface FollowUpFilterFormData {
  startDate: string
  endDate: string
}

export interface SearchParam {
  pageSize: number
  pageIndex: number
  isPagination: boolean
}

export const FOLLOW_UP_STATUS_MAP: Record<number, { label: string; color: string }> = {
  1: { label: 'Scheduled',   color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  2: { label: 'Completed',   color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  3: { label: 'Cancelled',   color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  4: { label: 'Rescheduled', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
}