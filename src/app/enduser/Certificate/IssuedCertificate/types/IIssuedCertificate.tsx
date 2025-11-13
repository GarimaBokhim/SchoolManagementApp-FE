export interface IIssuedCertificate {
  id?: string;
  templateId: string;
  studentId: string;
  certificateNumber: string;
  issuedDate: Date;
  issuedBy: string;
  pdfPath: string;
  remarks: string;
  status: number;
  yearOfCompletion: Date;
  program: string;
  symbolNumber: string;
}

export interface IFilterIssuedCertificateByDate {
  templateId: string;
  startDate: string;
  endDate: string;
}

export interface ICertificate {
  fullName: string;
  parentsName: string;
  provinceId: string;
  districtId: string;
  wardNumber: number;
  certificateProgram: string;
  yearOfCompletion: Date;
  percentage: string;
  division: string;
  dateOfBirth: Date;
  symbolNumber: string;
  registrationNumber: string;
  dateOfIssue: Date;
  StudentImage: string;
}
