export interface IExam {
  id?: string;
  name: string;
  examDate: Date;
  isfinalExam: boolean;
  classId: string;
  schoolId: string;
  examSubjects?: IExamSubjects[];
  totalMarks?: number;
  passingMarks?: number;
}

// IExams.ts
export interface IExamSubjects {
  examSubjectId?: string;
  subjectId: string;
  passMarksPr: number;
  fullMarksPr: number;
  passMarksTh: number;
  fullMarksTh: number;
}

export interface IFilterExamByDate {
  name: string;
  startDate: string;
  endDate: string;
}
