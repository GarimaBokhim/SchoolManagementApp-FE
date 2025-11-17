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

export interface IMarkSheet {
  examId: string;
  studentId: string;
  remarks: string;
  schoolId: string;
  percentage: string;
  totalObtainedMarks: number;
  grade: string;
  division: string;
  marksObtained: ISubjectMark[];
}
export interface ISubjectMark {
  subjectId: string;
  marksObtained: number;
  grade: string;
}
