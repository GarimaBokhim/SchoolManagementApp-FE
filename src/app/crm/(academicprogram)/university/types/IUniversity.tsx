
export interface AddUniversityPayload {
    name: string
    countryId: string | null
    universityAddress: string
    descriptions: string
    website: string
    globalRanking: number
}



export interface AddUniversityResponse {
    name: string
    countryId: string
    universityAddress: string
    descriptions: string
    website: string
    globalRanking: number
}



export interface UniversityResponse {
    id: string
    name: string
    countryId: string
    countryName: string
    universityAddress: string
    descriptions: string
    website: string
    globalRanking: number
    courseNames: string[]
}




export interface UpdateUniversityPayload {
    id: string
    name: string
    countryId: string
    universityAddress: string
    descriptions: string
    website: string
    globalRanking: number
}
