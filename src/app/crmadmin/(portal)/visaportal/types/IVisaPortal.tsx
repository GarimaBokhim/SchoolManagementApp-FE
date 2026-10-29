export interface VisaPortalFormPayload {
    name: string
    countryId: string

    universityId: string
    url: string
    processingTimeInDays: number
    note: string
}

export type AddVisaPortalPayload = VisaPortalFormPayload

export type UpdateVisaPortalPayload = VisaPortalFormPayload

export interface VisaPortalResponse extends VisaPortalFormPayload {
    id: string
    countryName: string
    universityName: string
}

export interface VisaPortalMutationResponse {
    id?: string
    Message?: string
}

export interface CountryOption {
    id: string
    name: string
}

export interface UniversityOption {
    id: string
    name: string
}
