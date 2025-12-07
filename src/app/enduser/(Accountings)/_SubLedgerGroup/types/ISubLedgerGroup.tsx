export interface ISubLedgerGroup {
  id?: string;
  name: string;
  isSeeded?: boolean;
  ledgerGroupId: string;
}
export interface ISubLedgerGroupBalance {
  SubLedgerGroupId: string;
  balance: number;
}
export interface IFilterSubLedgerGroupByDate {
  startDate: string;
  endDate: string;
  name: string;
}

export interface IFilteredSubLedgerGroup {
  startDate: string;
  endDate: string;
  name: string;
}

export interface ISubLedgerGroupGroup {
  id: string;
  name: string;
  isCustom: boolean;
  masterId: string;
  isPrimary: boolean;
}
