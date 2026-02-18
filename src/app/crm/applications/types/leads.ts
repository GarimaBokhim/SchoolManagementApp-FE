export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  countryInterest?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
}

export interface ApiResponse {
  Items: Array<{
    fullName: string;
    email: string;
    dateOfBirth: string;
    gender: number;
    contactNumber: string;
    permanentAddress: string;
    educationLevel: number;
    completionYear: string;
    currentGpa: string;
    previousAcademicQualification: string;
    source: string;
    feedBackOrSuggestion: string;
  }>;
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
  FirstPage: number;
  LastPage: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  source?: string;
  status?: string;
  countryInterest?: string;
}

export interface UserProfileResponse {
  data: any;
  Items: UserProfile[];
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
}

export interface ConvertToApplicantPayload {
  userId: string;
  passportNo: string;
  targetCountry: string;
}