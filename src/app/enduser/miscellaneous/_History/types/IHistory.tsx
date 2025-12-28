export interface IHistory {
  id?: string;
  schoolItemId: string;
  previousStatus: number;
  currentStatus: number;
  remarks: string;
}

export interface IFilterHistory {
  startDate: string;
  endDate: string;
  schoolItemId: string;
}
