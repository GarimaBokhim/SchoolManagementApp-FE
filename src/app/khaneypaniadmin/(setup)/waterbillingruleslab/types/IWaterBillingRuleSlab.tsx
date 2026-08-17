export interface AddWaterBillingRuleSlabResponse {
    id: string
    billingRuleId: string
    fromUnit: number
    toUnit: number
    ratePerUnit: number
}

export interface WaterBillingRuleSlabResponse {
    id: string
    waterTariffPlan: string
    effectiveFrom: string
    effectiveTo: string
    fromUnit: number
    toUnit: number
    ratePerUnit: number
}

export interface AddWaterBillingRuleSlabPayload {
    billingRuleId: string
    fromUnit: number
    toUnit: number
    ratePerUnit: number


}

export interface UpdateWaterBillingRuleSlabPayload {
    id: string
    billingRuleId: string
    fromUnit: number
    toUnit: number
    ratePerUnit: number
}

export interface UpdateWaterBillingRuleSlabResponse {
    id: string
    billingRuleId: string
    fromUnit: number
    toUnit: number
    ratePerUnit: number
}