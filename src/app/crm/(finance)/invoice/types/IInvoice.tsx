
export interface AddInvoicePayload {
    applicantId: string
    isInstallments: boolean
    issueDate: string
    dueDate: string
    addInvoiceItemDTOs: AddInvoiceItemDTO[]
}

export interface AddInvoiceItemDTO {
    description: string
    amount: number
    quantity: number
}


export interface AddInvoiceResponse {
    applicantId: string
    isInstallments: boolean
    issueDate: string
    dueDate: string
}



export interface GenerateInvoiceResponse {
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



export interface InvoiceDetailsResponse {
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


export interface InvoiceResponse {
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


export interface SchoolResponse {
    id: string
    name: string
    address: string
    email: string
    panNo: number
    imageUrl: number
    shortName: string
}


export interface InvoiceItemDTO {
    id: string
    description: string
    amount: number
    quantity: number
}

export interface UpdateInvoicePayload {
    id: string
    invoiceNumber: string
    applicantId: string
    paidAmount: number
    issueDate: string
    dueDate: string
    updateInvoiceItemDTOs: UpdateInvoiceItemDTO[]
}

export interface UpdateInvoiceItemDTO {
    id: string
    description: string
    amount: number
    quantity: number
}