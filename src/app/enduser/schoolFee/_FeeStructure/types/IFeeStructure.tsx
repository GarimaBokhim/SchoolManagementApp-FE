export interface IFeeStructure {
  id?: string
  classId: string
  feeCategoryId: string
  paidTypes: number
  feeCategoryName?: string
  feeStructureDTOs: IFeeStructureDTO[]
  totalAmount?: number
  discountAmount?: number
  isActive?: boolean
  schoolId?: string
  createdBy?: string
  createdAt?: string
  modifiedBy?: string
  modifiedAt?: string
}

export interface IFeeStructureDTO {
  id?: string
  feeTypeId: string
  amount: number
  discountAmount: number
  times: number
  totalAmount: number
  discountPercentage?: number
  feeTypeName?: string
}

export interface IFilterFeeStructure {
  startDate?: string
  endDate?: string
  classId?: string
}

export enum NameOfMonthsEnum {
  Baisakh = 1,
  Jestha,
  Ashadh,
  Shrawan,
  Bhadra,
  Ashwin,
  Kartik,
  Mangsir,
  Poush,
  Magh,
  Falgun,
  Chaitra,
}

export enum FeePaidType {
  OneTime = 1,
  Monthly = 2,
  Quarterly = 3,
  Yearly = 4,
}
