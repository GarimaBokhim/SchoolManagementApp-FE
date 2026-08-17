export interface AddWaterExpensesResponse {
    id: string
    expensesNo: string
    expensesDate: string
    expenseCategoryId: string
    amount: number
    paymentMethod: number
    venderName: string
    description: string

}

export interface WaterExpensesResponse {
    id: string
    expensesNo: string
    expensesDate: string
    expenseCategoryId: string
    expensesCategory: string
    amount: number
    paymentMethod: number
    venderName: string
    description: string
}

export interface AddWaterExpensesPayload {
    expenseDate: string
    expenseCategoryId: string
    amount: number
    paymentMethod: number
    venderName: string
    description: string


}

export interface UpdateWaterExpensesPayload {
    id: string
    expensesDate: string
    expenseCategoryId: string
    paymentMethod: number
    amount: number
    description: string
    venderName: string
}

export interface UpdateWaterExpensesResponse {
    id: string
    expensesDate: string
    expenseCategoryId: string
    amount: number
    paymentMethod: number
    venderName: string
    description: string
}