export interface ISchoolItem {
  id?: string;
  name: string;
  contributorId: string;
  itemStatus: number;
  itemCondition: number;
  receivedDate: Date;
  estimatedValue: string;
  quantity: number;
  unitType: number;
}

export interface IFilterSchoolItem {
  startDate: string;
  endDate: string;
  name: string;
}
