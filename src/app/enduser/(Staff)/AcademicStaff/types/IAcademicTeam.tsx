export interface IAcademicTeam {
  id?: string
  email: string
  username: string
  password: string
  fullName: string
  teacherImg: File
  address: string
  provinceId: number
  districtId: number
  vdcid: number
  municipalityId: number
  wardNumber: number
  gender: number
  rolesId: string[]
}

export interface IFilterAcademicTeamByDate {
  fullName: string
  startDate: string
  endDate: string
}

export interface IAssignClass {
  academicTeamId: string
  subjectIds: string[]
  ClassIds: string[]
}
export interface unAssignClass {
  academicTeamId: string
  classesId: string
}
