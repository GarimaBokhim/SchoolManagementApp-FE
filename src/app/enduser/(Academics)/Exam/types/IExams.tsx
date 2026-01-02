export interface IExam {
  id?: string;
  name: string;
  examDate: Date;
  isfinalExam: boolean;
  classId: string;
  examSubjects?:IExamSubjects[];
}
export interface IExamSubjects{
  subjectId:string;
  passMarks:number;
  fullMarks:number;
}

export interface IFilterExamByDate {
  name: string;
  startDate: string;
  endDate: string;
}
