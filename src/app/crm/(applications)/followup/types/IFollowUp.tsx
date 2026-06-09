
export interface AddFollowUpPayload {
    userId: string
    startTime: string
    endTime: string
    followUpDate: string
    notes: string
    followUpStatus: number
    appointmentId: string

}



export interface AddFollowUpResponse {
    userId: string
    startTime: string
    endTime: string
    followUpDate: string
    notes: string
    followUpStatus: number
    appointmentId: string
}



export interface FollowUpResponse {
    id: string
    userId: string
    fullName: string
    startTime: string
    endTime: string
    followUpDate: string
    notes: string
    followUpStatus: number
    appointmentId: string
    CounserlorWithDate: string
}




export interface UpdateFollowUpPayload {
    id: string
    userId: string
    startTime: string
    endTime: string
    followUpDate: string
    notes: string
    followUpStatus: number
    appointmentId: string
}
