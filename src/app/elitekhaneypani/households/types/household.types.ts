export interface Household {
  id: string
  consumerId: string
  consumerName: string
  meterNumber: string
  familyMember: number
  contactNumber?: string
  email: string
  provinceId: number
  districtId: number
  municipalityId: number
  vdcId: number
  wardNumber: number
  houseNumber?: string
  tole: string
  registrationDate: string
  qrCode?: string
}

export interface AddHouseholdPayload {
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
  waterTrrifPlanId: string
  latitude: number
  longitude: number
}

export interface WaterTariffPlan {
  id: string
  name: string
}
