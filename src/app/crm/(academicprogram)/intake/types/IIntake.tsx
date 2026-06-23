
export interface AddIntakePayload {
    intakeName: string
    month: Number
    deadline: string
    isOpen: boolean
    countryId: string
    universityId: string
    courseId: string

}



export interface AddIntakeResponse {
    month: Number
    deadline: string
    isOpen: boolean
    countryId: string
    universityId: string
    courseId: string
}



export interface IntakeResponse {
    id: string
    intakeName: string
    month: number
    deadline: string
    isOpen: boolean
    country: string
    countryName: string
    universityId: string
    universityName: number
    courseId: string
    courseName: string
}




export interface UpdateIntakePayload {
    id: string
    intakeName: string
    month: Number
    deadline: string
    isOpen: boolean
    countryId: string
    universityId: string
    courseId: string
}
