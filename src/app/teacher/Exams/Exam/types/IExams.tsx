export interface IExamSubject {
  subjectId: string;
  passMarksPr: number;
  fullMarksPr: number;
  passMarksTh: number;
  fullMarksTh: number;
}

export interface IExam {
  id?: string;
  name: string;
  examDate: Date;
  isfinalExam: boolean;
  classId: string;
  examSubjects: IExamSubject[];
}

export interface IFilterExamByDate {
  name: string;
  startDate: string;
  endDate: string;
}