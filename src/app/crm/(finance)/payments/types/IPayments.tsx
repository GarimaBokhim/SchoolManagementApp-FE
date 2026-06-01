

export interface UpdatePaymentsResponse {
    id: string;
    invoiceId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: number;
    referenceNumber: string;
    paymentStatus: number;
    isActive: boolean;
    schoolId: string;
    createdBy: string;
    createdAt: string;
    modifiedBy: string;
    modifiedAt: string;
}

export interface UpdatePaymentsPayload {
    invoiceId: string
    amount: number
    paymentDate: string
    paymentMethod: number
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


export interface AddPaymentsResponse {
    id: string;
    invoiceId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: number;
    referenceNumber: string;
    paymentStatus: number;
    isActive: boolean;
    schoolId: string;
    createdBy: string;
    createdAt: string;
    modifiedBy: string;
    modifiedAt: string;
}

export interface PaymentsResponse {
    id: string;
    invoiceId: string;
    amount: number;
    applicantId: string;
    applicantName: string;
    invoiceNumber: string;
    paymentDate: string;
    paymentMethod: number;
    referenceNumber: string;
    paymentStatus: number;
    isActive: boolean;
    schoolId: string;
    createdBy: string;
    createdAt: string;
    modifiedBy: string;
    modifiedAt: string;
}



export interface PaymentsReceiptDetails {
    id: string;
    invoiceId: string;
    amount: number;
    totalAmount: number;
    applicantId: string;
    applicantName: string;
    invoiceNumber: string;
    paymentDate: string;
    paymentMethod: number;
    referenceNumber: string;
    paymentStatus: number;
    InvoiceItemsDTOs: InvoiceItemDTO[]
    isActive: boolean;
    schoolId: string;
    createdBy: string;
    createdAt: string;
    modifiedBy: string;
    modifiedAt: string;
}

export interface InvoiceItemDTO {
    id: string
    description: string
    amount: number
    quantity: number
}

export interface AddPaymentsPayload {
    invoiceId: string
    amount: number
    paymentDate: string
    paymentMethod: number
}