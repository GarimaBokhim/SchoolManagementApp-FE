export interface IExam {
  id?: string;
  name: string;
  examDate: Date;
  totalMarks: number;
  passingMarks: number;
  isfinalExam: boolean;
}

export interface IFilterExamByDate {
  name: string;
  startDate: string;
  endDate: string;
}
