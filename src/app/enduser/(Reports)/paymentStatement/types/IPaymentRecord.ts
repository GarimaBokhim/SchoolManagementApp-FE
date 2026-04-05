export interface IPaymentDetailReport {
  studentName: string // actually a student ID from the API
  totalAmount: number
  paidAmount: number
  discountAmount: number
  dueAmount: number
}

export interface IPaymentDetailReportFilter {
  startDate: string
  endDate: string
}

export interface IPaymentStatement {
  schoolId: string
  studentId: string
  date: string
  receiptNumber?: string
  debitAmount: number
  creditAmount: number
  adjustment: number
  balance: number
  remarks: string
}
