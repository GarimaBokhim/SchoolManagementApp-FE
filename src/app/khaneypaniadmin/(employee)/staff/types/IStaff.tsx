export interface AddStaffResponse {
    id: string
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
    password: string
    fullName: string
    gender: number
    dob: string
    contactNumber: string
    email: string
    nid: string
    address: string
    joiningDate: string
    roleId: string
}

export interface AddStaffPayload {
    password: string;
    fullName: string;
    gender: number;
    dob?: string;
    contactNumber: string;
    email?: string | null;
    nid?: string | null;
    address: string;
    joiningDate: string;
    roleId: string
}

export interface UpdateStaffPayload {
    id: string;
    password: string;
    fullName: string;
    gender: number;
    dob?: string;
    contactNumber: string;
    email?: string | null;
    nid?: string | null;
    address: string;
    joiningDate: string;
    roleId: string
}

export interface UpdateStaffResponse {
    id: string
    password: number
    fullName: string
    gender: number
    dob: string
    contactNumber: string
    email: string
    nid: string
    address: string
    joiningDate: string
    roleId: string
}