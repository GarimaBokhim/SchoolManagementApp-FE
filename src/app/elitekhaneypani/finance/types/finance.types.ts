export interface WaterPayment {
  id: string;
  paymentNumber: string;
  consumerName: string;
  houseHoldId: string;
  paymentDate: string;
  paidAmount: number;
  paymentMethods: number;
}

export interface WaterIncome {
  id: string;
  voucherNo: string;
  incomeDate: string;
  waterincomeSourceId: string;
  waterincomeSourceName: string;
  amount: number;
  paymentMethods: number;
  consumerName: string;
  description: string;
}

export interface WaterExpense {
  id: string;
  expensesNo: string;
  expensesDate: string;
  expenseCategoryId: string;
  expensesCategory: string;
  amount: number;
  paymentMethod: number;
  venderName: string;
  description: string;
}

export interface LookupOption {
  id: string;
  name: string;
}

export interface AddWaterPaymentPayload {
  houseHoldId: string;
  paymentDate: string;
  paidAmount: number;
  paymentMethods: number;
}

export interface AddWaterIncomePayload {
  incomeDate: string;
  waterincomeSourceId: string;
  amount: number;
  paymentMethods: number;
  description: string;
}

export interface AddWaterExpensePayload {
  expenseDate: string;
  expenseCategoryId: string;
  amount: number;
  paymentMethod: number;
  venderName: string;
  description: string;
}
