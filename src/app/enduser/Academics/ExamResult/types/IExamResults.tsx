export interface IExamResult {
  id?: string;
  examId: string;
  studentId: string;
  subjectId: string;
  marksObtained: number;
  grade: string;
  remarks: string;
  isActive: boolean;
  schoolId: string;
}

export interface IFilterExamResultByDate {
  studentId: string;
  subjectId: string;
  startDate: string;
  endDate: string;
}
