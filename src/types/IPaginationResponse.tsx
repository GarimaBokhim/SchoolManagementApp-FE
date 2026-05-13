/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IPaginationResponse<T> {
  items: any;
  id(id: any): unknown;
  length(length: any): unknown;
  Items: T[];
  TotalItems: number;
  PageIndex: number;
  PageSize: number;
  TotalPages: number;
  CurrentPage: number;
  FirstPage: number;
  LastPage: number;
  NextPage: number;
  PreviousPage: number;
}


export interface IPaginationCrmResponse<T> {
  Data: {
    Items: T[];
    TotalItems: number;
    PageIndex: number;
    pageSize: number;
    TotalPages: number;
    FirstPage: number;
    LastPage: number;
    PreviousPage: number | null;
    NextPage: number | null;
  };
  Message: string;
  StatusCode: number;
}
