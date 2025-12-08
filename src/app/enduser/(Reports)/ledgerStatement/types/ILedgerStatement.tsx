export interface ILedgerStatementDetails {
  dateTime: string;
  billNumber: string;
  transactions: string;
  debitAmount: number;
  amount: number;
  creditAmount: number;
  affectedLedgerId: string;
  transactionId: string;
  paymentMethodId: string;
  referenceNumber: string;
}
export interface IFilterLedgerDetailsByDate {
  endDate: string;
  startDate: string;
  partyId: string;
}
