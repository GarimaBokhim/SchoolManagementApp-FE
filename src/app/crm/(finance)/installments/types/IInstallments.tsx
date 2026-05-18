export interface AddInstallmentPlanResponse {
  id: string
  invoiceNumber: string
  applicantName: string
  numberOfInstallments: number
  totalAmount: number
  modifiedAt: string
}

export interface FilterInstallmentPlanResponse {
  id: string
  applicantId: string
  numberOfInstallments: number
  applicantName: string
  invoiceNumber: string
  totalAmount: number,
  isActive: boolean
  schoolId: string
  createdBy: string
  createdAt: string
  modifiedBy: string
  modifiedAt: string
}

export interface AddInstallmentPlanPayload {
  applicantId: string
  numberOfInstallments: number
}