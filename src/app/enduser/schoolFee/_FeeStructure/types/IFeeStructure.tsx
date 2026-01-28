export interface IFeeStructure {
  id: string;
  amount: number;
  classId: string;
  feeTypeId: string;
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
