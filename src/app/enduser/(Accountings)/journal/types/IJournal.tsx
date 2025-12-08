export interface IJournal {
  id?: string;
  referenceNumber?: string;
  transactionDate: string;
  description: string;
  journalEntries?: AddJournalEntryDetail[];
}
export interface IFilterJournalByDate {
  startDate: string;
  endDate: string;
  description?: string;
}
export interface AddJournalEntryDetail {
  type: string;
  id?: string;
  ledgerId: string;
  debitAmount: number;
  creditAmount: number;
}

export interface ICurrentJournalReferenceNumber {
  referenceNumber: string;
}

export interface IJournalStatus {
  journalReferences: number;
  companyId: string;
}
// export interface IUpdateJournal {
//   referenceNumber: string;
//   transactionDate: string;
//   description: string;
//   UpdateJournalEntryDetails: [
//     {
//       id?: string;
//       ledgerId: string;
//       debitAmount: number;
//       creditAmount: number;
//     }
//   ];
// }
