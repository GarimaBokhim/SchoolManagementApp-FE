export interface IStudentFee {
  /** Present when row comes from API (needed for PATCH). */
  id?: string;
  Id?: string;
  studentId: string;
  feeStructureId: string | string[];
  classId: string;
  discountPercentage: number;
  studentFeeDetailsDTOs: IStudentFeeDetails[];
}

export interface IStudentFeeDetails {
  id?: string;
  feeTypeId: string;
  discountAmount: number;
  amount: number;
  times: number;
  totalAmount: number;
  feePaidType: number; // 1 = One Time, 2 = Monthly, etc.
}

export interface IFilterStudentFee {
  startDate: string;
  endDate: string;
  studentId: string;
  classId: string;
}

export interface IPaymentRecord {
  id?: string;
  studentid: string;
  classid: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: number;
  reference: string;
  receiptNumber: string;  //  mapped for future backend support
  dueAmount?: number;
}

export interface Istudentfeesummary {
  studentId: string;
  paymentDate: string;
  classId: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  reference: string;
  receiptNumber: string;
  paymentMethod: number;
}

export interface filtersummary {
  startDate: string;
  endDate: string;
  studentId: string;
  classId: string;
}