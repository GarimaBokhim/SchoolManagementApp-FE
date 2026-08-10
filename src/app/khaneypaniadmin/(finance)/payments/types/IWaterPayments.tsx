export interface AddWaterPaymentsResponse {
    id: string
    paymentNumber: string
    houseHoldId: string
    paymentDate: string
    paidAmount: number
}

export interface WaterPaymentsResponse {
    id: string
    paymentNumber: string
    consumerName: string
    houseHoldId: string
    paymentDate: string
    paidAmount: number
}

export interface AddWaterPaymentsPayload {
    houseHoldId: string
    paymentDate: string
    paidAmount: number
    paymentMethods: number


}

export interface UpdateWaterPaymentsPayload {
    id: string
    houseHoldId: string
    paymentDate: string
    paidAmount: number
    paymentMethods: number
}

export interface UpdateWaterPaymentsResponse {
    id: string
    paymentNumber: string
    houseHoldId: string
    paymentDate: string
    paidAmount: number
    paymentMethods: number
}