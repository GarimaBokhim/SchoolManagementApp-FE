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
    id?: string
    step: number
    visaStatusId: string
    visaStatusName: string
    visaRequirementStatus: number
}


export interface VisaRequirementIdResponse {
    id: string
    countryId: string
    universityId: string
    courseId: string
    visaRequirementsDetailsDTOs: VisaRequirementDetailResponse[]
}

export interface VisaRequirementDetailResponse {
    id: string
    step: number
    visaStatusId: string
    visaRequirementsId: string
    visaRequirementStatus: number
    isActive: boolean
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
    visaRequirementsDetailsDTOs: UpdateVisaRequirementDetaisDTOs[]

}

export interface UpdateVisaRequirementDetaisDTOs {
    id: string
    step: number
    visaStatusId: string
    visaRequirementsId: string
    visaRequirementStatus: number

}

export interface AddVisaRequirementPayload {
    countryId: string
    universityId: string
    courseId: string
    visaRequirementsDetailsDTOs: VisaRequirementDetailsDTOs[]
}

export interface VisaRequirementDetailsDTOs {
    id?: string
    step: number
    visaStatusId: string
    visaRequirementStatus: number

}