export interface AddStaffResponse {
    id: string
    username: string
    password: string
    employeeCode: string
    fullName: string
    gender: number
    dob: string
    contactNumber: string
    email: string
    nid: string
    address: string
    joiningDate: string
    tole: string
    registrationDate: string
    role: string
}

export interface StaffResponse {
    id: string
    username: string
    password: string
    employeeCode: string
    fullName: string
    gender: number
    dob: string
    contactNumber: string
    email: string
    nid: string
    address: string
    joiningDate: string
    tole: string
    registrationDate: string
    rolename: string
}

export interface AddStaffPayload {
    username: string
    password: string
    employeeCode: string
    fullName: string
    gender: number
    dob: string
    contactNumber: string
    email: string
    nid: string
    address: string
    joiningDate: string
    tole: string
    registrationDate: string
    rolesId: string[];
}

export interface UpdateStaffPayload {
    id: string
    username: string
    password: string
    employeeCode: string
    fullName: string
    gender: number
    dob: string
    contactNumber: string
    email: string
    nid: string
    address: string
    joiningDate: string
    tole: string
    registrationDate: string
    rolesId: string[];
}