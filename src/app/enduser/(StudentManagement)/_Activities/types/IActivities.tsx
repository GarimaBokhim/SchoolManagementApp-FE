export interface Activity {
  id: string
  name: string
  descriptions: string
  activityCategory: number
  eventId: string
  classIds: string[]
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
  descriptions: string
  activityCategory: number
  eventId: string
  startTime: string
  endTime: string
  activityDate: string
  classIds: string[]
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

export interface IClassSubject {
  id: string
  name: string
  code: string
  creditHours: number
  description: string
  classId: string
}

export interface IClass {
  id: string
  name: string
  subjects: IClassSubject[]
}