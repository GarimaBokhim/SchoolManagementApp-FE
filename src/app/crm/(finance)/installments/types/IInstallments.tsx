export interface AddInstallmentPlanResponse {
  id: string
  invoiceNumber: string
  applicantName: string
  numberOfInstallments: number
  totalAmount: number
  modifiedAt: string
}

export interface InstallmentPlanResponse {
  id: string
  numberOfInstallments: number
  invoiceId: string
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
  numberOfInstallments: number
  invoiceId: string
}


export interface UpdateInstallmentPlanPayload {
  numberOfInstallments: number
  invoiceId: string
}