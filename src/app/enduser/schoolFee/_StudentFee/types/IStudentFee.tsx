export interface IStudentFee {
  id?: string;
  studentId: string;
  feeStructureId: string;
  discount: number;
  totalAmount: number;
  paidAmount: number;
}

export interface IFilterStudentFee {
  startDate: string;
  endDate: string;
  studentId: string;
}
