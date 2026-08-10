export interface AddWaterBillingSetUpResponse {
    id: string
    name: string
    description: string
    isDefault: boolean
}

export interface WaterBillingSetUpResponse {
    id: string
    name: string
    description: string
    isDefault: boolean
}

export interface AddWaterBillingSetUpPayload {
    name: string
    description: string
    isDefault: boolean


}

export interface UpdateWaterBillingSetUpPayload {
    id: string
    name: string
    description: string
    isDefault: boolean
}

export interface UpdateWaterBillingSetUpResponse {
    id: string
    name: string
    description: string
    isDefault: boolean
}