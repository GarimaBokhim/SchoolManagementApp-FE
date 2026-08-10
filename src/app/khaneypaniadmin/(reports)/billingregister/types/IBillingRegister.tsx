
export interface BillingRegisterResponse {
    billingId: string
    billNumber: string
    billDate: string
    householdId: string
    consumerName: string
    meterNumber: string
    consumption: number
    totalAmount: number
    paidAmount: number
    outstandingAmount: number
    billStatus: number
}
