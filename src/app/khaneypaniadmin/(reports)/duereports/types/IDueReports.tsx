export interface DueReportItem {
    houseHoldsId: string
    consumerId: string
    consumerName: string
    meterNumber: string
    outStandingBillCount: number
    outStandingBillAmount: number
    olderstBillDate: string | null
    oldersDueDays: number | null
}

export interface DueReportsPagination {
    Items: DueReportItem[]
    TotalItems: number
    PageIndex: number
    pageSize: number
    TotalPages: number
    FirstPage: number
    LastPage: number
    PreviousPage: number | null
    NextPage: number | null
}

export interface DueReportsResponse {
    totalOutsandingAMount: number
    totalConsumer: number
    totalOutStandingBillCount: number
    dueReports: DueReportsPagination
}



export interface DueDetailsResponse {
    houseHoldId: string;
    consumerId: string;
    consumername: string;
    waterMeterNumber: string;
    totalOutstanding: number;
    outstandingCount: number;
    dueDetails: DueDetailsItems[];
}

export interface DueDetailsItems {
    billingId: string;
    billingNumber: string;
    billingDate: string;
    totalAmount: number;
    paidAmount: number;
    outStandingAmount: number;
    BillStatus: number;
    DueDays: number
}