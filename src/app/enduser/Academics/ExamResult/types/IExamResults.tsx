export interface IExamResult {
  id?: string;
  examId: string;
  studentId: string;
  remarks?: string;
  marksObtained: {
    subjectId: string;
    marksObtained: number;
  }[];
}

export interface IFilterExamResultByDate {
  studentId: string;
  subjectId: string;
  startDate: string;
  endDate: string;
}
