export interface ILedgers {
  id?: string;
  name: string;
  address?: string;
  panNo?: string;
  balance?: number;
  balanceType?: string;
  phoneNumber?: string;
  maxCreditPeriod?: string;
  maxDuePeriod?: string;
  isSeeded?: boolean;
  subledgerGroupId: string;
  openingBalance?: number | null;
}
export interface ILedgerBalance {
  ledgerId: string;
  balance: number;
  balanceType: string;
}
export interface IFilterLedgerByDate {
  startDate: string;
  endDate: string;
  name: string;
}

export interface IFilteredLedger {
  id: string;
  name: string;
  subledgerGroupId: string;
}

export interface ILedgerGroup {
  id?: string;
  name: string;
  isCustom?: boolean;
  masterId: string;
  isPrimary?: boolean;
}
