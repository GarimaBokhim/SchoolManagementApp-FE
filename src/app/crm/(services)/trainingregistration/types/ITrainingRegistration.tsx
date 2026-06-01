export interface AddTrainingRegistrationResponse {
    id: string
    applicantId: string
    consultancyClassId: string
    registeredAt: string
}

export interface TrainingRegistrationResponse {
    id: string
    applicantId: string
    consultancyClassId: string
    registeredAt: string
}

export interface AddTrainingRegistrationPayload {
    applicantId: string
    consultancyClassId: string
    registeredAt: string
}

export interface UpdateTrainingRegistrationPayload {
    applicantId: string
    consultancyClassId: string
    registeredAt: string
}