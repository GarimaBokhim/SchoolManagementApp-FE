export interface IFeeCategory {
  id?: string
  name: string
  description: string
  fyId: string
  isActive: boolean
  schoolId?: string
  createdBy?: string
  createdAt?: string
  modifiedBy?: string
  modifiedAt?: string
}

export interface IFilterFeeCategory {
  startDate: string
  endDate: string
}