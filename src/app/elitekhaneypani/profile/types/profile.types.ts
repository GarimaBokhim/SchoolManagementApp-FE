export interface SchoolProfile {
  id: string;
  name: string;
  address: string;
  email: string;
  shortName: string;
  contactNumber: string;
  contactPerson: string;
  pan: string;
  imageUrl?: string;
  isEnabled: boolean;
  isDeleted: boolean;
  institutionId: string;
  fiscalYearId: string;
  academicYearId: string;
  billNumberGenerationTypeForPurchase: number;
  billNumberGenerationTypeForSales: number;
  // Optional Nepali-script equivalents - not yet returned by the backend, falls back to name/address when absent.
  nameNp?: string;
  addressNp?: string;
}
