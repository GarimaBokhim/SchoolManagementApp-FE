export interface IModules {
  Modules: any;
  Id: string;
  Name?: string;
  Description?: string;
  TargetUrl?: string;
  IconUrl?: string;
  Rank?: string;
  AppId?: string;
  IsActive: boolean;
}

export interface IAppName {
  Id: string;
  Name: string;
}

export interface IFilterModulesByDate {
  startDate: string;
  endDate: string;
  name: string;
}