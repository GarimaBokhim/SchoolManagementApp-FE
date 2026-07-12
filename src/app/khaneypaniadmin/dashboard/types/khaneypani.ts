// ---------------------------------------------------------------------------
// Khaneypani (Drinking Water Project) — shared types
// Drop this file into: app/types/khaneypani.ts (or wherever your other types live)
// ---------------------------------------------------------------------------

export interface House {
  id: string;
  houseNo: string;          // e.g. "W3-014" (ward-wise numbering)
  ownerName: string;
  phone: string;
  wardNo: string;
  tole: string;             // locality / tole name
  meterNo: string;
  connectionDate: string;   // ISO date
  status: "active" | "inactive";
  lastReadingUnit: number;  // running "previous reading" — updated after every scan
  createdAt: string;
}

export interface StaffUser {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  role: "admin" | "karmachari"; // admin vs meter-reading staff
  createdAt: string;
}

export interface MeterReading {
  id: string;
  houseId: string;
  previousUnit: number;
  currentUnit: number;
  unitsUsed: number;
  ratePerUnit: number;
  minimumCharge: number;
  amount: number;
  readingDate: string;      // ISO date
  readByStaffId: string;
  readByStaffName: string;
  paymentStatus: "paid" | "unpaid";
  billNo: string;
}

export interface Payment {
  id: string;
  houseId: string;
  readingId: string;
  amount: number;
  paidDate: string;         // ISO date
  method: "cash" | "esewa" | "khalti" | "bank";
  collectedByStaffName: string;
}

export interface IncomeExpense {
  id: string;
  type: "income" | "expense";
  category: string;         // e.g. "Water Bill Collection", "Pipe Repair", "Staff Salary"
  amount: number;
  description: string;
  date: string;             // ISO date
  entryByStaffName: string;
}

export interface BillingRate {
  ratePerUnit: number;
  minimumCharge: number;    // flat minimum even if usage is 0
  freeUnits: number;        // units covered by the minimum charge
}