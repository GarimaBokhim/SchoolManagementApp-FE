export interface AddWaterExpensesResponse {
    id: string
    expensesNo: string
    expensesDate: string
    expenseCategoryId: string
    amount: number
    paymentMethods: number
    venderName: string
    descriptions: string

}

export interface WaterExpensesResponse {
    id: string
    expensesNo: string
    expensesDate: string
    expenseCategoryId: string
    expensesCategory: string
    amount: number
    paymentMethods: number
    venderName: string
    descriptions: string
}

export interface AddWaterExpensesPayload {
    expensesDate: string
    expenseCategoryId: string
    amount: number
    paymentMethods: number
    venderName: string
    descriptions: string


}

export interface UpdateWaterExpensesPayload {
    id: string
    expensesDate: string
    expenseCategoryId: string
    amount: number
    paymentMethods: number
    venderName: string
    descriptions: string
}

export interface UpdateWaterExpensesResponse {
    id: string
    expensesDate: string
    expenseCategoryId: string
    amount: number
    paymentMethods: number
    venderName: string
    descriptions: string
}