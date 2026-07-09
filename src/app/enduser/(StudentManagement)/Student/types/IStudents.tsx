export interface IStudent {
  id?: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;

  // make optional
  registrationNumber?: string;
  admissionNumber?: string;

  genderStatus?: number;
  studentStatus?: number;

  dateOfBirth?: string;

  email?: string;
  phoneNumber?: string;

  studentImg?: File | string;
  imageUrl?: string;

  address?: string;

  enrollmentDate?: string;
  parentId?: string;

  classSectionId?: string | "";
  classId: string;

  provinceId?: number;
  districtId?: number;
  municipalityId?: number;
  vdcid?: number;

  enrollmentStatus?: number;
  wardNumber?: number | null;

  feeCategoryId?: string;
}

export interface IFilterStudentByDate {
  startDate: string;
  endDate: string;
  firstName: string;
}
