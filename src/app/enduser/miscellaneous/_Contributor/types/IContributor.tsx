export interface IContributor {
  id?: string;
  name: string;
  organization: string;
  contactNumber: string;
  email: string;
}

export interface IFilterContributor {
  startDate: string;
  endDate: string;
  name: string;
}
