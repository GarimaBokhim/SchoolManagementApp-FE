export interface AddHouseHoldsResponse {
    id: string
    consumerId: string
    consumerName: string
    meterNumber: string
    familyMember: number
    email: string
    provinceId: number
    districtId: number
    municipalityId: number
    vdcId: number
    wardNumber: number
    waterTariffPlanId: string
    waterRateSlabId?: string
    latitude: number
    longitude: number
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
    provinceId: number
    districtId: number
    municipalityId: number
    vdcId: number
    wardNumber: number
    waterTariffPlanId?: string
    waterTrrifPlanId?: string
    waterRateSlabId: string
    waterTariffPlanName?: string
    waterRateSlabName?: string
    latitude: number
    longitude: number
    houseNumber: string
    tole: string
    schoolId?: string
    wardnumber?: number
    registrationDate: string
    qrCode: string
}

export interface AddHouseHoldsPayload {
    consumerName: string
    familyMember: number
    contactNumber: string
    email: string
    provinceId: number
    districtId: number
    municipalityId: number
    vdcId: number
    wardNumber: number
    tole: string
    registrationDate: string
    waterTariffPlanId: string
    waterRateSlabId: string
    latitude: number
    longitude: number


}

export interface UpdateHouseHoldsPayload {
    id: string
    consumerName: string
    familyMember: number
    contactNumber: string
    email: string
    provinceId: number
    districtId: number
    municipalityId: number
    vdcId: number
    wardNumber: number
    waterTariffPlanId: string
    waterRateSlabId: string
    latitude: number
    longitude: number
    tole: string
    registrationDate: string
}

export interface UpdateHouseHoldsResponse {
    id: string
    consumerId: string
    consumerName: string
    meterNumber: string
    familyMember: number
    email: string
    provinceId: number
    districtId: number
    municipalityId: number
    vdcId: number
    wardNumber: number
    waterTariffPlanId: string
    latitude: number
    longitude: number
    tole: string
    registrationDate: string
}