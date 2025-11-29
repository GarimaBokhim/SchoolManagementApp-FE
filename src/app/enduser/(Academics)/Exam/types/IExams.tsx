export interface IExam {
  id?: string;
  name: string;
  examDate: Date;
  totalMarks: number;
  passingMarks: number;
  isfinalExam: boolean;
  classId: string;
}

export interface IFilterExamByDate {
  name: string;
  startDate: string;
  endDate: string;
}
