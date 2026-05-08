export interface InstallmentPlan {
  id: string
  invoiceName: string
  numberOfInstallments: number
  totalAmount: number
  modifiedAt: string
}

export interface InstallmentPlanResponse {
  id: string
  applicantId: string
  numberOfInstallments: number
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
  numberOfInstallments: number,
  totalAmount: number
}