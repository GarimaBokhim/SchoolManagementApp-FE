
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

export interface FilterPaymentsResponse {
    id: string;
    invoiceId: string;
    amount: number;
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

export interface AddPaymentsPayload {
    applicantId: string
    amount: number
    paymentDate: string
    paymentMethod: number
}