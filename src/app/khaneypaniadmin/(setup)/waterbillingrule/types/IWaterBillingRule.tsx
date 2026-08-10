export interface AddWaterBillingRuleResponse {
    id: string
    waterTarifPlanId: string
    effectiveFrom: string
    effectiveTo: string
}

export interface WaterBillingRuleResponse {
    id: string
    waterTarifPlanId: string,
    waterTarifPlanName: string
    effectiveFrom: string
    effectiveTo: string
}

export interface AddWaterBillingRulePayload {
    waterTarifPlanId: string
    effectiveFrom: string
    effectiveTo: string


}

export interface UpdateWaterBillingRulePayload {
    id: string
    waterTarifPlanId: string
    effectiveFrom: string
    effectiveTo: string
}

export interface UpdateWaterBillingRuleResponse {
    id: string
    waterTarifPlanId: string
    effectiveFrom: string
    effectiveTo: string
}