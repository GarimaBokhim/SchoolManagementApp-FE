export interface IStudentFee {
  studentId: string;
  feeStructureId:string;
  classId: string;
  discountPercentage: number;
}


export interface IFilterStudentFee {
  startDate: string;
  endDate: string;
  studentId: string;
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
}