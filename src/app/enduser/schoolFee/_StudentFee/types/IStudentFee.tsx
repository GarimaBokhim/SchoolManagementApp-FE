export interface IStudentFee {
  studentId: string;
  feeStructureId: string;
  classId: string;
  discountPercentage: number;
  studentFeeDetailsDTOs: IStudentFeeDetails[];
}

export interface IStudentFeeDetails {
  feeTypeId: string;
  discountAmount: number;
  amount: number;
  times: number;
  totalAmount: number;
  feePaidType: number; // 1 = Monthly, 2 = OneTime, etc.
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
}

export interface Istudentfeesummary {
  studentId: string;
  paymentDate: string;
  classId: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  reference: string;
  paymentMethod: number;
}

export interface filtersummary {
  startDate: string;
  endDate: string;
  studentId: string;
  classId: string;
}