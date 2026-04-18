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

export interface IModuleItem {
  Id: string;
  Name: string;
  TargetUrl?: string;
  IsActive: boolean;
}

export interface IModulesByRoleId {
  AppName: string;
  Modules: IModuleItem[];
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