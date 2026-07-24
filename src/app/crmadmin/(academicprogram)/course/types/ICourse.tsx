
export interface AddCoursePayload {
    title: string
    studyLevel: number
    tuationFee: number
    currency: string
    universityId: string | null
}



export interface AddCourseResponse {
    title: string
    studyLevel: number
    tuationFee: number
    currency: string
    universityId: string
}



export interface CourseResponse {
    id: string
    title: string
    studyLevel: number
    tuationFee: number
    currency: string
    universityId: string
    universityName: string
}




export interface UpdateCoursePayload {
    id: string
    title: string
    studyLevel: number
    tuationFee: number
    currency: string
    universityId: string
}
