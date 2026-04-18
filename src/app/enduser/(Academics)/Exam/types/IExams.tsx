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

export interface IExamSubjects{
  examSubjectId?: string;
  subjectId:string;
  passMarks:number;
  fullMarks:number;
}

export interface IFilterExamByDate {
  name: string;
  startDate: string;
  endDate: string;
}
