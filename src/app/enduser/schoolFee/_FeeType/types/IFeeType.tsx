export interface IFeeType {
  id?: string
  name: string
  description: string
  isRequired: boolean
  nameOfMonths: number
}

export interface IFilterFeeType {
  startDate: string
  endDate: string
  name: string
}
