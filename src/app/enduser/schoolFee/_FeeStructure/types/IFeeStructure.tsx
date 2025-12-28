export interface IFeeStructure {
  id?: string;
  amount: number;
  classId: string;
  feeTypeId: string;
}

export interface IFilterFeeStructure {
  startDate: string;
  endDate: string;
  classId: string;
}
