export interface AddWaterIncomeResponse {
    id: string
    voucherNo: string
    incomeDate: string
    waterincomeSourceId: string
    amount: number
    paymentMethods: number
    description: string
}

export interface WaterIncomeResponse {
    id: string
    voucherNo: string
    incomeDate: string
    waterincomeSourceId: string
    waterincomeSourceName: string
    amount: number
    paymentMethods: number
    consumerName: string
    description: string
}

export interface AddWaterIncomePayload {
    incomeDate: string
    waterincomeSourceId: string
    amount: number
    paymentMethods: number
    description: string


}

export interface UpdateWaterIncomePayload {
    id: string
    incomeDate: string
    waterincomeSourceId: string
    amount: number
    paymentMethods: number
    description: string
}

export interface UpdateWaterIncomeResponse {
    id: string
    incomeDate: string
    waterincomeSourceId: string
    amount: number
    paymentMethods: number
    description: string
}