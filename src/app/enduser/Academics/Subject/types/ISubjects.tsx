export interface ISubject {
  id?: string;
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
