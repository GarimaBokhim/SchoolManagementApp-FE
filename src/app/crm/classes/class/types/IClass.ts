export interface ConsultancyClass {
  id: string
  name: string
  startTime: string
  endTime: string
  batch: string
  englishProficiency: number
  isActive: boolean
  schoolId: string
  createdBy: string
  createdAt: string
  modifiedBy: string
  modifiedAt: string
}

export interface TrainingRegistration {
  id: string
  applicantId: string
  consultancyClassId: string
  registeredAt: string
  isActive: boolean
  schoolId: string
  createdBy: string
  createdAt: string
  modifiedBy: string
  modifiedAt: string
}

export interface AddConsultancyClassPayload {
  name: string
  startTime: string
  endTime: string
  batch: string
  englishProficiency: number
}

export interface AddTrainingRegistrationPayload {
  applicantId: string
  consultancyClassId: string
  registeredAt: string
}

export interface ClassFilterParams {
  startDate?: string
  endDate?: string
}