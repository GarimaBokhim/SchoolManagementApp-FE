export interface IAssetsReportItem {
  contributorName: string;
  fiscalYearName: string;
  totalEstimatedValue: number;
  totalItemsCount: number;
  itemsName: string;
}

export interface IAssetsReportResponse {
  Items: IAssetsReportItem[];
}

export interface IFilterAssetsReportRequest {
  fiscalYearId: string;
}