export interface IUserResponse {
  id: string;
  userName: string;
  email: string;
  password: string;
  rolesId: string[];
  institutionId: string;
  schoolId?: string;
  schoolIds: string[];
}
export interface IUserResponseForAll {
  Id: string;
  UserName: string;
  Email: string;
  Password: string;
  rolesId: string[];
  institutionId: string;
  SchoolId?: string;
  SchoolIds: string[];
}
export interface IAssign {
  userId: string;
  rolesId: string[];
}
export interface IFilterUserByDate {
  email: string;
  SchoolId: string;
  userName: string;
}
