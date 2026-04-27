// types/IExamResults.ts
export interface IExamResult {
  id?: string
  examId: string
  studentId: string
  remarks?: string
  marksObtained: {
    subjectId: string
    marksObtained: number 
    marksObtaineds?: number
    fullMarks: number
  }[]
}

export interface IFilterExamResultByDate {
  studentId: string
  subjectId: string
  startDate: string
  endDate: string
}

export interface IMarkSheet {
  examId: string
  studentId: string
  remarks: string
  schoolId: string
  percentage: string
  totalObtainedMarks: number
  grade: string
  GPA: string
  division: string
  createdAt: string
  MarksWithGrades: ISubjectMark[]
}
export interface ISubjectMark {
  subjectId: string
  marksObtained: number
  grade: string
  GPA: string
}
