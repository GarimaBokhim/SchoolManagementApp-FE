export interface IFeeStructure {
  id?: string;
  classId: string;
  feeCategoryId: string;
  feeCategoryName?: string;
  feeStructureDTOs: IFeeStructureDTO[];
  totalAmount?: number;  // Optional: for display in list view
  discountAmount?: number; // Optional: for display in list view
  isActive?: boolean;
  schoolId?: string;
  createdBy?: string;
  createdAt?: string;
  modifiedBy?: string;
  modifiedAt?: string;
}

export interface IFeeStructureDTO {
  id?: string;  // Required for updates
  feeTypeId: string;
  amount: number;
  discountAmount: number;
  times: number;
  totalAmount: number;
  feePaidType: number;
  discountPercentage?: number;
  feeTypeName?: string;  // Optional: for display purposes
}

export interface IFilterFeeStructure {
  startDate?: string;  // Make optional
  endDate?: string;    // Make optional
  classId?: string;    // Make optional
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
  Semester = 5,
}