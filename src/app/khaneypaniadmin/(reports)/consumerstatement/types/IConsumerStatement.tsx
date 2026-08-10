export interface ConsumerStatementResponse {
    houseHoldId: string;
    consumerName: string;
    consumerId: string;
    meterNumber: string;
    totalBilled: number;
    totalPaid: number;
    outStandingAmount: number;
    transactions: ConsumerStatementItem[];
}

export interface ConsumerStatementItem {
    date: string;
    referenceNumber: string;
    transactionType: string;
    description: string;
    debit: number;
    credit: number;
    balance: number;
}

export interface HouseHoldsResponse {
    id: string
    consumerId: string
    consumerName: string
    meterNumber: string
    familyMember: number
    email: string
    provinceId: number
    districtId: number
    municipalityId: number
    vdcId: number
    wardNumber: number
    houseNumber: string
    tole: string
    registrationDate: string
    qrCode: string
}