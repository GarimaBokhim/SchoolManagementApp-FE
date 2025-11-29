export interface IExamSession {
  id?: string;
  name: string;
  examDate: Date;
  examHallDTOs: IHall[];
}
export interface IHall {
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
}
