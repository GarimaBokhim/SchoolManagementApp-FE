export interface IParent {
  id?: string;
  fullName: string;
  parentType: 0;
  phoneNumber: string;
  email: string;
  address: string;
  occupation: string;
  imageUrl: string;
}

export interface IFilterParentByDate {
  firstName: string;
  startDate: string;
  endDate: string;
}
