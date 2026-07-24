
export interface ConvertApplicantPayload {
    userId: string
    passportNo: string
    countryId: string
    universityId: string
    courseId: string

}



export interface ConvertApplicantResponse {
    userId: string
    passportNo: string
    countryId: string
    universityId: string
    courseId: string
}


export interface DocumentStatusResponse {
    id: string
    documentName: string
    documentStatus: number
}



export interface ApplicantResponse {
    id: string
    userId: string
    fullName: string
    email: string
    enrolmentType: number
    passportNo: string
    countryId: string
    countryName: string
    universityId: string
    universityName: number
    courseId: string
    courseName: string
    applicantId: string
    admissionDate: string
}


export interface UserProfileResponse {
    id: string
    fullName: string
    applicantId: string
    email: string
    admissionDate: string
    enrolmentType: number
    genderStatus: number
    intrestedCountry: string
    intrestedUniversity: number
    intrestedCourse: string
    intakeTitle: string
}

export interface updateSingleVisaStatusPayload {
    id: string
    status: number
    emailContent: string
}




export interface UpdateApplicantPayload {
    id: string
    userId: string
    passportNo: string
    countryId: string
    universityId: string
    courseId: string
}

export interface VisaRequirementByResponse {
    id: string
    visaRequirementsDTOs: VisaRequirementsDTOs[]
}

export interface VisaRequirementsDTOs {
    id: string
    step: number
    visaStatusId: string
    visaStatusName: string
    visaStatus: number
}

export interface VisaDetailsByApplicant {
    countryId: string
    countryName: string
    universityId: string
    universityName: string
    courseId: string
    courseTitle: string

}
