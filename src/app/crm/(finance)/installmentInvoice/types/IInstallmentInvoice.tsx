export interface InstallmentInvoiceResponse {
    id: string
    invoiceNumber: string
    applicantName: string
    applicantId: string
    totalAmount: number
    invoiceStatus: number
    issueDate: string
    dueDate: string
    schoolId: string
    InvoiceItemsDTOs: InvoiceItemDTO[]
}

export interface InvoiceItemDTO {
    id: string
    description: string
    amount: number
    quantity: number
}

export interface AddInstallmentInvoicePayload {
    applicantId: string
    isInstallments: boolean
    issueDate: string
    dueDate: string
    addInvoiceItemDTOs: AddInstallmentInvoiceItemDTO[]
}

export interface AddInstallmentInvoiceItemDTO {
    description: string
    amount: number
    quantity: number
}

export interface GenerateInstallmentInvoiceResponse {
    id: string
    invoiceNumber: string
    applicantName: string
    phoneNumber: string
    applicantId: string
    paidAmount: number
    totalAmount: number
    dueAmount: number
    invoiceStatus: number
    issueDate: string
    dueDate: string
    InvoiceItemsDTOs: InvoiceItemDTO[]
}


export interface InstallmentInvoiceDetailsResponse {
    id: string
    invoiceNumber: string
    applicantName: string
    applicantId: string
    paidAmount: number
    totalAmount: number
    dueAmount: number
    invoiceStatus: number
    issueDate: string
    dueDate: string
    InvoiceItemsDTOs: InvoiceItemDTO[]
}

export interface InstallmentPaymentDetailsResponse {
    totalAmount: number;
    baseAmount: number;
    numberOfInstallments: number;
    installmentPayments: InstallmentPayments[];
}

export interface InstallmentPayments {
    paidAmount: number;
    paymentDate: string;
    paymentMethod: number;
    referenceNumber: string;
    remaingAmount: number;
}



export interface AddInstallmentInvoiceResponse {
    applicantId: string
    isInstallments: boolean
    issueDate: string
    dueDate: string
}


export interface UpdateInstallmentInvoicePayload {
    id: string
    invoiceNumber: string
    applicantId: string
    paidAmount: number
    issueDate: string
    dueDate: string
    updateInvoiceItemDTOs: UpdateInstallmentInvoiceItemDTO[]
}

export interface UpdateInstallmentInvoiceItemDTO {
    id: string
    description: string
    amount: number
    quantity: number
}
