export interface IStudentFee {
  id?: string
  Id?: string
  studentId: string
  feeStructureId: string | string[]
  classId: string
  discountPercentage: number
  studentFeeDetailsDTOs: IStudentFeeDetails[]
  totalAmount?: number
  isFirst: boolean
  dueAmount?: number
}

export interface IStudentFeeDetails {
  id?: string
  feeTypeId: string
  discountAmount: number
  amount: number
  times: number
  totalAmount: number
  feePaidType: number
  NameOfMonths: number[]
}

export interface IFilterStudentFee {
  startDate: string
  endDate: string
  studentId: string
  classId: string
}

export interface IPaymentRecord {
  id?: string
  studentid: string
  classid: string
  amountPaid: number
  paymentDate: string
  paymentMethod: number
  reference: string
  receiptNumber: string
  dueAmount?: number
}

// ✅ New: matches FeeStructureForFeeSummaryDTOs from API
export interface IFeeStructureItem {
  feeTypeId: string
  feeTypeName: string
  amount: number
  discountAmount: number
  times: number
  totalAmount: number
  feePaidType: number
}

// ✅ Updated: added FeeStructureForFeeSummaryDTOs
export interface Istudentfeesummary {
  studentId: string
  paymentDate: string
  classId: string
  totalAmount: number
  paidAmount: number
  dueAmount: number
  reference: string
  receiptNumber: string
  paymentMethod: number
  FeeStructureForFeeSummaryDTOs: IFeeStructureItem[]
}

export interface filtersummary {
  startDate: string
  endDate: string
  studentId: string
  classId: string
}
