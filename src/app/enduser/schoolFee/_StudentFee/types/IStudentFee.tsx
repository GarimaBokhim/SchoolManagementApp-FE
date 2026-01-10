export interface IStudentFee {
  studentId: string;
  feeStructureId:string[];
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
  studentfeeId: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: number;
  reference: string;
}