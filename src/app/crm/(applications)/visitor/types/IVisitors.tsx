
export interface AddInquiryPayload {
    fullName: string,
    email: string,
    dateOfBirth: string,
    gender: number,
    contactNumber: string,
    permanentAddress: string,
    educationLevel: number,
    englishProficiency: number,
    bandScore: number,
    languageRemarks: string,

    skillOrTrainingName?: string,
    institutionName?: string,
    trainingRemarks?: string,
    trainingStartDate?: string,
    trainingEndDate?: string,

    completionYear: string,
    currentGpa: string,
    previousAcademicQualification: string,
    source: string,
    feedBackOrSuggestion: string,

    countries: LeadCountryDto[]
}

export interface LeadCountryDto {
    countryId: string,
    universities: LeadUniversityDto[]
}

export interface LeadUniversityDto {
    universityId: string,
    courseIds: string[]
}





export interface AddInquiryPayloadResponse {
    fullName: string,
    email: string,
    dateOfBirth: string,
    gender: number,
    contactNumber: string,
    permanentAddress: string,
    educationLevel: number,
    englishProficiency: number,
    bandScore: number,
    languageRemarks: string,
}




export interface InquiryResponse {
    id: string,
    userId: string,
    fullName: string,
    email: string,
    phone: string
    enrolmentType: number,
    dateOfBirth: string,
    gender: number,
    contactNumber: string,
    permanentAddress: string,
    educationLevel: number,
    completionYear: string,
    currentGpa: string,
    previousAcademicQualification: string,
    source: string,
    feedBackOrSuggestion: string
}





export interface UpdateInquiryPayload {
    id: string
    fullName: string,
    email: string,
    dateOfBirth: string,
    gender: number,
    contactNumber: string,
    permanentAddress: string,
    educationLevel: number,
    englishProficiency: number,
    bandScore: number,
    languageRemarks: string,

    skillOrTrainingName?: string,
    institutionName?: string,
    trainingRemarks?: string,
    trainingStartDate?: string,
    trainingEndDate?: string,

    completionYear: string,
    currentGpa: string,
    previousAcademicQualification: string,
    source: string,
    feedBackOrSuggestion: string,

    countries: LeadCountryDto[]
}

export interface LeadCountryDto {
    countryId: string,
    universities: LeadUniversityDto[]
}

export interface LeadUniversityDto {
    universityId: string,
    courseIds: string[]
}


export interface ConvertToApplicantModalProps {
    isOpen: boolean
    onClose?: () => void
    selectedLead: SelectedLead | null
    onSuccess?: () => void
    conversionData?: ConvertToApplicantData
    convertingId?: string | null
    onInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onSubmit?: (data: ConvertToApplicantPayload) => void
}

export interface SelectedLead {
    id: string
    name: string
    userId: string
}

export interface ConvertToApplicantData {
    passportNo: string
    countryId: string
    universityId: string
    courseId: string
}

export interface ConvertToApplicantPayload {
    userId: string
    passportNo: string
    countryId: string
    universityId: string
    courseId: string
}


// export interface ConvertToApplicantFormProps {
//     selectedLead: SelectedLead
//     conversionData?: ConvertToApplicantData
//     convertingId?: string | null
//     onInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
//     onSubmit?: (data: ConvertToApplicantPayload) => void
//     onClose: () => void
// }

export interface ConversionPayload {
    passportNo: string;
    countryId: string;
    universityId: string;
    courseId: string;
}

export interface ConversionResponse {
    passportNo: string;
    countryId: string;
    universityId: string;
    courseId: string;
}
