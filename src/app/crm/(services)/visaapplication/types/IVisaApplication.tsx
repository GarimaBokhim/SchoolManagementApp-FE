export interface VisaApplicationResponse {
    id: string
    applicantId: string
    applicantName: string
    countryId: string
    countryName: string
    universityId: string
    universityName: string
    courseId: string
    courseTitle: string
    intakeId: string
    intakeMonth: number
    appliedDate: string
    visaStatusId: string
    visaStatusName: string
}

export interface AddVisaApplicationResponse {
    id: string
    applicantId: string
    intakeId: string
    appliedDate: string
    visaStatusId: string
    visaDetails: string
    emailSent: boolean
    emailContent: string
}


export interface UpdateVisaApplicationResponse {
    id: string
    applicantId: string
    intakeId: string
    appliedDate: string
    visaStatusId: string
    visaDetails: string
    emailSent: boolean
    emailContent: string
}

export interface UpdateVisaApplicationPayload {
    applicantId: string
    intakeId: string
    appliedDate: string
    visaStatusId: string
    visaDetails: string
    emailSent: boolean
    emailContent: string

}

export interface AddVisaApplicationPayload {
    applicantId: string
    intakeId: string
    appliedDate: string
    visaStatusId: string
    visaDetails: string
    emailSent: boolean
    emailContent: string

}

export interface VisaDetailsByApplicant {
    countryId: string
    countryName: string
    universityId: string
    universityName: string
    courseId: string
    courseTitle: string

}


export interface IntakeDTOs {
    id: string
    intakeName: string

}
