// Update your IFeeStructure interface in the types file
export interface IFeeStructure {
  id: string;
  amount?: number;
  classId: string;
  feeTypeId?: string;
  discountAmount?: number;
  feeCategoryName?: string;
  totalAmount?: number;
  isActive?: boolean;
  schoolId?: string;
  createdBy?: string;
  createdAt?: string;
  modifiedBy?: string;
  modifiedAt?: string;
}

export interface IFilterFeeStructure {
  startDate: string;
  endDate: string;
  classId: string;
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