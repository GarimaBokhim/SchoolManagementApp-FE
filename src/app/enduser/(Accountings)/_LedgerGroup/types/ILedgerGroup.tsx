export interface ILedgerGroup {
  id?: string;
  name: string;
  isCustom?: boolean;
  isSeeded?: boolean;
  masterId: string;
  isPrimary?: boolean;
}
export interface IFilterLedgerGroupByDate {
  startDate: string;
  endDate: string;
  name: string;
}
