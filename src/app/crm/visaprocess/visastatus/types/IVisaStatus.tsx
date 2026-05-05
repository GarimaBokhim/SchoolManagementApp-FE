export interface IVisaStatus {
  id: string
  name: string
  visaStatusType: number
  isActive: boolean
  schoolId?: string
  createdBy?: string
  createdAt?: string
  modifiedBy?: string
  modifiedAt?: string
}

export interface IAddVisaStatus {
  name: string
  visaStatusType: number
}
