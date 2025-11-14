export interface IStudent {
  id?: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  registrationNumber: string;
  genderStatus: 0;
  studentStatus: 0;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  imageUrl: string;
  address: string;
  enrollmentDate: Date;
  parentId: string;
  classSectionId?: string | null;
  provinceId: number;
  districtId: number;
  municipalityId: number;
  vdcid: number;
  wardNumber?: number | null;
}

export interface IFilterStudentByDate {
  startDate: string;
  endDate: string;
  firstName: string;
}
