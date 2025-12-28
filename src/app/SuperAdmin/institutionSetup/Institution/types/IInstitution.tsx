export interface IInstitution {
  id: string;
  name: string;
  address: string;
  email: string;
  shortName: string;
  contactNumber: string;
  contactPerson: string;
  pan: string;
  imageUrl: string;
  isEnable: boolean;
  isDeleted: boolean;
  organizationId: string;
}

export interface IFilterInstitutionByDate {
  startDate: string;
  endDate: string;
  name: string;
}

export interface IOrganization {
  id: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  mobileNumber: string;
  logo: string;
  province: number;
}
