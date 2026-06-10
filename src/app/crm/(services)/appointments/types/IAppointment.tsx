
export interface AddAppointmentPayload {
    leadId: string
    appointmentDate: string
    counselorId: string
    notes: string
    appointmentStatus: number

}



export interface AddAppointmentResponse {
    id: string
    leadId: string
    appointmentDate: string
    counselorId: string
    notes: string
    appointmentStatus: Number
}

export interface FollowUpFilters {
    userId?: string
    pageIndex?: number
    pageSize?: number
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





export interface AppointmentResponse {
    id: string
    leadId: string
    leadName: string
    userId: string
    counselorName: string
    appointmentDate: string
    counselorId: string
    notes: string
    appointmentStatus: number
}


export interface CountryResponse {
    id: string
    name: string
}


export interface UpdateAppointmentDetails {
    notes: string
}

export interface UniversityResponse {
    id: string
    name: string
}

export interface CourseResponse {
    id: string
    title: string
}



export interface LeadEnquiryDetailsResponse {
    Countries: Country[];
}

export interface Country {
    countryId: string;
    Universities: University[];
}

export interface University {
    universityId: string;
    CourseIds: string[];
}

export interface AppointmentDetailsResponse {
    id: string
    leadId: string
    leadName: string
    counselorName: string
    appointmentDate: string
    counselorId: string
    notes: string
    appointmentStatus: number
}



export interface UpdateAppointmentPayload {
    id: string
    leadId: string
    appointmentDate: string
    counselorId: string
    notes: string
    appointmentStatus: number
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

    englishProficiency: number,
    bandScore: number
    languageRemarks: string,
    skillOrTrainingName: string,
    institutionName: string,
    trainingRemarks: string,
    trainingStartDate: string,
    trainingEndDate: string,


    source: string,
    feedBackOrSuggestion: string
}


export interface ConvertToApplicantPayload {
    userId: string
    passportNo: string
    countryId: string
    universityId: string
    courseId: string
}


export interface ConvertToApplicantResponse {
    id: string
    passportNo: string
    countryId: string
    universityId: string
    courseId: string
}
