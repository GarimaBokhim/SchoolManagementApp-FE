export interface Invoice {
    id: string
    invoiceNumber: string
    applicantId: string
    totalAmount: number
    paidAmount: number
    dueAmount: number
    invoiceStatus: number
    issueDate: string
    dueDate: string
}

export interface InvoiceResponse {
    id: string
    invoiceNumber: number
    applicantName: string
    applicantId: string
    paidAmount: number
    totalAmount: number
    dueAmount: number
    invoiceStatus: number
    issueDate: string
    dueDate: string
    isActive: boolean
    schoolId: string
    createdBy: string
    createdAt: string
    modifiedBy: string
    modifiedAt: string
}

export interface AddInvoicePayload {
    applicantId: string
    paidAmount: number
    issueDate: string
    dueDate: string
}