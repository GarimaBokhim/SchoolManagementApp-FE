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
    paymentMethods: number
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

export interface AddReceiptPayload {
    waterPaymentId: string | undefined
}

export interface AddReceiptResponse {
    Id: string
    BillNumber: string
    HouseholdId: string
    ConsumerId: string
    ConsumerName: string
    Address: string
    ContactNumber: string
    BillDate: string
    PreviousReading: number
    CurrentReading: number
    Consumption: number
    TotalAmount: number
    PaidAmount: number
    OutstandingAmount: number
    BillStatus: string
    CreatedAt: string

}