export interface AddWaterReceiptResponse {
    id: string
    receiptNo: string
    consumption: string
    billStatus: number
    receiptDate: string
    paymentMethods: number
}

export interface WaterReceiptResponse {
    id: string
    receiptNo: string
    waterBillingId: string
    paidAmount: number
    receiptDate: string
    paymentMethods: number
}

export interface AddWaterReceiptPayload {
    waterBillingId: string
    receiptDate: string
    paymentMethods: number


}

export interface UpdateWaterReceiptPayload {
    id: string
    waterBillingId: string
    receiptDate: string
    paymentMethods: number
}

export interface UpdateWaterReceiptResponse {
    id: string
    waterBillingId: string
    receiptDate: string
    paymentMethods: number
}