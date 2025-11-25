export interface IAcademicTeam {
  id?: string;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  rolesId: [string];
}

export interface IFilterAcademicTeamByDate {
  firstName: string;
  startDate: string;
  endDate: string;
}
