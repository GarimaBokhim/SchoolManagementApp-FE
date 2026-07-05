export interface AddHouseHoldsResponse {
    id: string
    consumerId: string
    consumerName: string
    meterNumber: string
    familyMember: number
    contactNumber: string
    email: string
    provinceId: string
    districtId: number
    municipalityId: number
    vdcId: number
    wardnumber: number
    tole: string
    registrationDate: string
}

export interface HouseHoldsResponse {
    id: string
    consumerId: string
    consumerName: string
    meterNumber: string
    familyMember: number
    contactNumber: string
    email: string
    provinceId: string
    districtId: number
    municipalityId: number
    vdcId: number
    wardnumber: number
    tole: string
    registrationDate: string
}

export interface AddHouseHoldsPayload {
    consumerId: string
    consumerName: string
    meterNumber: string
    familyMember: number
    contactNumber: string
    email: string
    provinceId: number
    districtId: number
    municipalityId: number
    vdcId: number
    wardnumber: number
    tole: string
    registrationDate: string
}

export interface UpdateHouseHoldsPayload {
    id: string
    consumerId: string
    consumerName: string
    meterNumber: string
    familyMember: number
    contactNumber: string
    email: string
    provinceId: number
    districtId: number
    municipalityId: number
    vdcId: number
    wardnumber: number
    tole: string
    registrationDate: string
}