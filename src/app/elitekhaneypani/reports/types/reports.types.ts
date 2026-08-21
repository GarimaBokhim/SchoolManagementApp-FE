export interface BillingRegisterItem {
  billingId: string;
  billNumber: string;
  billDate: string;
  householdId: string;
  consumerName: string;
  meterNumber: string;
  consumption: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  billStatus: number;
}

export interface DailyCollectionItem {
  PaymentId: string;
  PaymentNumber: string;
  ReceiptNumber: string;
  PaymentDate: string;
  ConsumerName: string;
  MeterNumber: string;
  PaidAmount: number;
  PaymentMethods: number;
  CollectedBy: string;
}

export interface DueReportItem {
  houseHoldsId: string;
  consumerId: string;
  consumerName: string;
  meterNumber: string;
  outStandingBillCount: number;
  outStandingBillAmount: number;
  olderstBillDate: string | null;
  oldersDueDays: number | null;
}

export interface DueReportsPagination {
  Items: DueReportItem[];
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
  FirstPage: number;
  LastPage: number;
  PreviousPage: number | null;
  NextPage: number | null;
}

export interface DueReportsResponse {
  totalOutsandingAMount: number;
  totalConsumer: number;
  totalOutStandingBillCount: number;
  dueReports: DueReportsPagination;
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
