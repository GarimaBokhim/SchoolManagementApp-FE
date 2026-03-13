export interface Counselor {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  isActive: boolean;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

export interface AddCounselorPayload {
  fullName: string;
  email: string;
  contactNumber: string;
}