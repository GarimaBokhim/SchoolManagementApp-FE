// src/app/crm/applications/leads/types/ILeads.tsx

export interface Lead {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  educationLevel: number;
  completionYear: string;
  enrolmentType: number;
}

export interface SelectedLead {
  id: string;
  name: string;
  userId: string;
}

export interface ApiResponse {
  Items: Array<{
    userId: string;
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
    enrolmentType?: number;
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

export interface ConvertToApplicantPayload {
  userId: string;
  passportNo: string;
  targetCountry: string;
}

export interface ConvertToApplicantData {
  passportNo: string;
  targetCountry: string;
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

// ── Convert modal props ──
export interface ConvertToApplicantFormProps {
  selectedLead: SelectedLead;
  conversionData?: ConvertToApplicantData;
  convertingId?: string | null;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onClose: () => void;
}

export interface ConvertToApplicantModalProps {
  isOpen: boolean;
  onClose?: () => void;
  selectedLead: SelectedLead | null;
  onSuccess?: () => void;
  conversionData?: ConvertToApplicantData;
  convertingId?: string | null;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit?: (e: React.FormEvent) => void;
}