export interface IStudent {
  id?: string;
  firstName: string;
  feeCategoryId?: string;
  middleName?: string | null;
  lastName: string;
  registrationNumber: string;
  admissionNumber?: string;
  genderStatus: number;
  studentStatus: number;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  studentImg: File| string;
  address: string;
  enrollmentDate: Date;
  parentId: string;
  classSectionId?: string | "";
  classId: string;
  provinceId: number;
  districtId: number;
  enrollmentStatus?: number;
  municipalityId: number | 0;
  vdcid: number | 0;
  wardNumber?: number | null;
  imageUrl?: string;
}

export interface IFilterStudentByDate {
  startDate: string;
  endDate: string;
  firstName: string;
}
