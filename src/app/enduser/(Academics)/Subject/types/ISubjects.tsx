export interface ISubject {
  id?: any;
  Id?: string;
  name: string;
  code: string;
  creditHours: number;
  description: string;
  classId: string;
  examId: string;
  fullMarks: number;
  passMarks: number;
}

export interface IFilterSubjectByDate {
  name: string;
  startDate: string;
  endDate: string;
}

export interface ISubjectByClass {
  id: string;
  subjectName: string;
  fullMarks: number;
}
