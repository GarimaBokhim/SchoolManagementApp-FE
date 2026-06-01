

export interface UpdateInstallmentPaymentsResponse {
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

export interface UpdateInstallmentPaymentsPayload {
    invoiceId: string
    amount: number
    paymentDate: string
    paymentMethod: number
}


export interface AddInstallmentPaymentsResponse {
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

export interface InstallmentPaymentsResponse {
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

export interface AddInstallmentPaymentsPayload {
    invoiceId: string
    amount: number
    paymentDate: string
    paymentMethod: number
}