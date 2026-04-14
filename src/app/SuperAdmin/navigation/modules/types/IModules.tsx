export interface IModules {
  createdAt?: string | number | Date;
  name: string;
  description: string;
  targetUrl: string;
  id?: string;
  isActive: boolean;
  iconUrl: string;
  rank: string;
  appId: string;
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