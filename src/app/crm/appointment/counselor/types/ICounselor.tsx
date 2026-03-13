export interface Counselor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  status: string;
  students: number;
  joinDate: string;
}

export interface AddCounselorPayload {
  fullName: string;
  email: string;
  contactNumber: string;
}