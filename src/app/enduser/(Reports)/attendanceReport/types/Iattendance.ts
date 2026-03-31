export interface IAttendanceStatus {
  Status: "P" | "A" | "L" | "-";
}

export interface IStudentAttendance {
  StudentId: string;
  Attendance: Record<string, IAttendanceStatus>;
}

export interface IAttendanceReport {
  ClassId: string;
  AcademicTeamId: string;
  Students: IStudentAttendance[];
}

export interface IStudent {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  admissionNumber: string;
  studentStatus: number;
  dateOfBirth: string;
  enrollmentDate: string;
  parentId: string;
  classId: string;
}

export interface IStudentListResponse {
  Items: IStudent[];
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
  FirstPage: number;
  LastPage: number;
}

export const NEPALI_MONTHS: Record<number, string> = {
  1: "Baisakh",
  2: "Jestha",
  3: "Ashadh",
  4: "Shrawan",
  5: "Bhadra",
  6: "Ashwin",
  7: "Kartik",
  8: "Mangsir",
  9: "Poush",
  10: "Magh",
  11: "Falgun",
  12: "Chaitra",
};

export const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; short: string }
> = {
  P: {
    label: "Present",
    className: "bg-emerald-500 text-white",
    short: "P",
  },
  A: {
    label: "Absent",
    className: "bg-red-400 text-white",
    short: "A",
  },
  L: {
    label: "Late",
    className: "bg-yellow-400 text-white",
    short: "L",
  },
  "-": {
    label: "Holiday / No Data",
    className: "bg-gray-100 text-gray-400",
    short: "-",
  },
};