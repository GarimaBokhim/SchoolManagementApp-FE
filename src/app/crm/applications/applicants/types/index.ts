export interface School {
  id: string;
  name: string;
}

export interface Applicant {
  id: string;
  userId: string;
  passportNo: string;
  targetCountry: string;
  isActive: boolean;
  schoolId: string;
  schoolName?: string;
  // New profile fields
  fullName?: string;
  email?: string;
  enrolmentType?: number;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

export interface ApiResponse {
  Items: Array<{
    id: string;
    userId: string;
    passportNo: string;
    targetCountry: string;
    isActive: boolean;
    schoolId: string;
    createdBy: string;
    createdAt: string;
    modifiedBy: string;
    modifiedAt: string;
  }>;
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
  FirstPage: number;
  LastPage: number;
}

export interface SchoolResponse {
  Items: Array<{
    id: string;
    name: string;
  }>;
  TotalItems: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  enrolmentType: number;
  createdAt: string;
  contactNumber?: string;
  source?: string;
}

export interface UserProfileResponse {
  Items: UserProfile[];
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
  FirstPage: number;
  LastPage: number;
}

export interface ConvertToStudentPayload {
  userId: string;
  universityName: string;
  visaId: string;
}

export interface FilterFormData {
  startDate: string;
  endDate: string;
  firstName?: string;
}

export interface SearchParam {
  pageSize: number;
  pageIndex: number;
  isPagination: boolean;
}