
export interface AddCounselorPayload {
    fullName: string
    email: string
    contactNumber: string
}



export interface AddCounselorResponse {
    id: string
    fullName: string
    email: string
    contactNumber: string
}



export interface CounselorResponse {
    id: string
    fullName: string
    email: string
    contactNumber: string
}



export interface UpdateCounselorPayload {
    id: string
    fullName: string
    email: string
    contactNumber: string
}
