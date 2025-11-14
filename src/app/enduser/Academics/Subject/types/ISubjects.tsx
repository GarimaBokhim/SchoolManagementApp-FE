export interface ISubject {
  Id?: string;
  name: string;
  code: string;
  creditHours: number;
  description: string;
  classId: string;
}

export interface IFilterSubjectByDate {
  name: string;
  startDate: string;
  endDate: string;
}
