export interface IClass {
  id?: string;
  name: string;
  subjects?: Iclasssubjects[];
}
export interface Iclasssubjects {
  name: string;
  code: string;
  creditHours: number;
  description: string;
}

export interface IFilterClassByDate {
  name: string;
  startDate: string;
  endDate: string;
}
