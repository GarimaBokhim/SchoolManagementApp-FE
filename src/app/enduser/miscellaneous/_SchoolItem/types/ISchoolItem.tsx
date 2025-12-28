export interface ISchoolItem {
  id?: string;
  name: string;
  contributorId: string;
  itemStatus: number;
  itemCondition: number;
  receivedDate: Date;
  estimatedValue: number;
  quantity: number;
  unitType: number;
  fiscalYearId: string;
}

export interface IFilterSchoolItem {
  startDate: string;
  endDate: string;
  name: string;
}
