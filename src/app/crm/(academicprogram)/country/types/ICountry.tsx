
export interface AddCountryPayload {
    name: string
}



export interface AddCountryResponse {
    name: string
}



export interface CountryResponse {
    id: string
    name: string
    universityNames: string[]
}




export interface UpdateCountryPayload {
    id: string
    name: string
}
