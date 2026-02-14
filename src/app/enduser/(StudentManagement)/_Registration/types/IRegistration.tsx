export interface IRegistration {
  id?: string;
  studentId: string;
  classId: string;
  academicYearId: string;
}

export interface IFilterRegistrationByDate {
  academicYearId: string;
  startDate: string;
  endDate: string;
}
export interface IAcademicYear {
  Id: string;
  Name: string;
}
