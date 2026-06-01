export interface AddClassResponse {
    id: string
    name: string
    startTime: string
    endTime: string
    batch: string
    englishProficiency: number
}

export interface ClassResponse {
    id: string
    name: string
    startTime: string
    endTime: string
    batch: string
    englishProficiency: number
}

export interface AddClassPayload {
    name: string
    startTime: string
    endTime: string
    batch: string
    englishProficiency: number
}

export interface UpdateClassPayload {
    name: string
    startTime: string
    endTime: string
    batch: string
    englishProficiency: number
}