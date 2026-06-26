export interface VisaRequirementResponse {
    id: string
    countryId: string
    countryName: string
    universityId: string
    universityName: string
    universityAddress: string
    courseId: string
    courseTitle: string
    visaRequirementsDTOs: VisaRequirementsDTOs[]
}

export interface VisaRequirementsDTOs {
    step: number
    visaStatusId: string
    visaStatusName: string
    visaRequirementStatus: number
}

export interface AddVisaRequirementResponse {
    id: string
    countryId: string
    universityId: string
    courseId: string
}


export interface UpdateVisaRequirementResponse {
    id: string
    countryId: string
    universityId: string
    courseId: string
}

export interface UpdateVisaRequirementPayload {
    id: string
    countryId: string
    universityId: string
    courseId: string
    updatevisaRequirementsDetailsDTOs: UpdateVisaRequirementDetaisDTOs[]

}

export interface UpdateVisaRequirementDetaisDTOs {
    id: string
    step: number
    visaStatusId: string
    visaRequirementStatus: number

}

export interface AddVisaRequirementPayload {
    countryId: string
    universityId: string
    courseId: string
    visaRequirementsDetailsDTOs: VisaRequirementDetailsDTOs[]
}

export interface VisaRequirementDetailsDTOs {
    step: number
    visaStatusId: string
    visaRequirementStatus: number

}