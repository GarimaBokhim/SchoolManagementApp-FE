export interface IExamSession {
  id?: string;
  name: string;
  examDate: Date;
  examHallDTOs: IHall[];
}
export interface IHall {
  hallId?: string;
  hallName: string;
  capacity: number;
}
export interface IFilterExamSessionByDate {
  name: string;
  startDate: string;
  endDate: string;
}
export interface IAllExamSession {
  id: string;
  name: string;
  date: Date;
  schoolId: string;
}
export interface ISeatPlanningRequest {
  examSessionId: string;
  classIds: string[];
}
export interface ISeatPlanning {
  examSessionId: string;
  totalStudents: string;
  hallSeatResponses: IHallResponses[];
}
export interface IHallResponses {
  hallId: string;
  hallName: string;
  capaCity: number;
  studentSeatResponses: IStudentSeatResponses[];
}
export interface IStudentSeatResponses {
  studentId: string;
  studentName: string;
  classId: string;
  symbolNumber: string;
}
