export interface IClass {
  id?: string;
  name: string;
  subjects?: Iclasssubjects[];
}
export interface Iclasssubjects {
  id?: string;
  name: string;
  code: string;
  creditHours: number;
  description: string;
  classId: string;
}

export interface IFilterClassByDate {
  name: string;
  startDate: string;
  endDate: string;
}
