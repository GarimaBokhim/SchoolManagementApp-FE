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
  AcademicTeamId: string
  Classes: IClassSubjectAssignment[]
}

export interface IAssignClassTeacherRequest {
  AcademicTeamId: string
  ClassId: string
}

export interface IClassTeacherDetails {
  AcademicTeamId: string
  AcademicTeamName: string
  ClassId: string
  ClassName: string
  AssignedDate: string
}

export interface IAssignClassTeacherResponse {
  Message: string
}

export interface IClassSubjectAssignment {
  ClassId: string
  SubjectIds: string[]
}

export interface IAssignedClassSubjectDetails {
  ClassId?: string
  classId?: string
  ClassName?: string
  className?: string
  SubjectIds?: string[]
  subjectIds?: string[]
  Subjects?: IAssignedSubjectDetails[]
  subjects?: IAssignedSubjectDetails[]
}

export interface IAssignedSubjectDetails {
  SubjectId?: string
  subjectId?: string
  SubjectName?: string
  subjectName?: string
}

export interface IAssignedClassDetails {
  AcademicTeamId?: string
  academicTeamId?: string
  academicteamId?: string
  Classes?: IAssignedClassSubjectDetails[]
  classes?: IAssignedClassSubjectDetails[]
  ClassId?: string
  classId?: string
  ClassIds?: string[]
  classIds?: string[]
  SubjectIds?: string[]
  subjectIds?: string[]
}

export type IClassWithSubjectDetailsResponse = IAssignedClassDetails
