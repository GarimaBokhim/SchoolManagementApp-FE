export interface Activity {
  id: string
  name: string
  activityCategory: number
  eventId: string
  isActive: boolean
  schoolId: string
  createdBy: string
  createdAt: string
  modifiedBy: string
  modifiedAt: string
}

export interface Participation {
  id: string
  studentId: string
  activityId: string
  awardPosition: number
  isActive: boolean
  schoolId: string
  createdBy: string
  createdAt: string
  modifiedBy: string
  modifiedAt: string
}

export interface AddActivityPayload {
  name: string
  activityCategory: number
  eventId: string
  startTime: string
  endTime: string
  activityDate: string
}

export interface AddParticipationPayload {
  studentId: string
  activityId: string
  awardPosition: number
}

export interface IFilterActivityByDate {
  startDate: string
  endDate: string
}