export interface AddStaffResponse {
    id: string
    username: string
    password: string
    fullName: string
    gender: number
    dob: string
    contactNumber: string
    email: string
    nid: string
    address: string
    joiningDate: string
    rolesId: string[];
}

export interface StaffResponse {
    id: string
    username: string
    password: string
    fullName: string
    gender: number
    dob: string
    contactNumber: string
    email: string
    nid: string
    address: string
    joiningDate: string
    rolesId: string[];
}

export interface AddStaffPayload {
    username: string;
    password: string;
    fullName: string;
    gender: number;
    dob?: string | null;
    contactNumber: string;
    email?: string | null;
    nid?: string | null;
    address: string;
    joiningDate: string;
    rolesId: string[];
}

export interface UpdateStaffPayload {
    id: string;
    username: string;
    password: string;
    fullName: string;
    gender: number;
    dob?: string | null;
    contactNumber: string;
    email?: string | null;
    nid?: string | null;
    address: string;
    joiningDate: string;
    rolesId: string[];
}

export interface UpdateStaffResponse {
    id: string
    username: string
    password: number
    fullName: string
    gender: number
    dob: string
    contactNumber: string
    email: string
    nid: string
    address: string
    joiningDate: string
    rolesId: string[];
}