export interface IRoles {
  Id: string;
  Name: string;
}
export interface IFilterRoleByDate {
  startDate: string;
  endDate: string;
  name: string;
}
export interface IRoleModule {
  Id: string;
  Name: string;
  TargetUrl?: string;
  IsActive: boolean;
}

export interface IRoleModuleGroup {
  AppName: string;
  Modules: IRoleModule[];
}