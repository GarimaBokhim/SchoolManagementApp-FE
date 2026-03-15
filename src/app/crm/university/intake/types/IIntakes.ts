export interface IIntake {
  id: string;
  month: number;
  deadline: string;
  isOpen: boolean;
  courseId: string;
  courseName?: string;
  createdAt?: string;
  createdBy?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  isActive?: boolean;
}

export interface IIntakeFormData {
  month: number;
  deadline: string;
  isOpen: boolean;
  courseId: string;
}

export interface ICourse {
  id: string;
  title: string;
  code?: string;
  isActive?: boolean;
}

export interface IMonthOption {
  id: number;
  name: string;
}

export const MONTH_OPTIONS: IMonthOption[] = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
];