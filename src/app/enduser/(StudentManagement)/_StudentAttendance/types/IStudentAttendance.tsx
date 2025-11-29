export interface IStudentAttendance {
  id?: string;
  academicTeamId: string;
  attendanceDate: Date;
  studentAttendances: IStudentList[];
}
export interface IStudentList {
  studentId: string;
  status: number;
  remarks: string;
}
export interface IFilterStudentAttendanceByDate {
  studentId: string;
  startDate: string;
  endDate: string;
}
export interface IAllAttendance {
  id: string;
  studentId: string;
  attendanceDate: Date;
  attendanceStatus: 0;
  academicTeamId: string;
  remarks: string;
}
