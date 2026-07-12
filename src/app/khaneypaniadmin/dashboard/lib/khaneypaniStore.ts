// ---------------------------------------------------------------------------
// Khaneypani data store
//
// This is a localStorage-backed mock database so the whole flow (register
// house -> scan QR -> enter reading -> auto-calc -> save -> print -> report)
// works end-to-end out of the box.
//
// WHEN YOU WIRE UP YOUR REAL BACKEND:
// Your project already has a pattern for this — see useGetAllSchool,
// useGetAllRoles etc. in your existing code. Replace the body of each
// function below with the equivalent API call / hook, keeping the same
// function names and shapes so the components don't need to change.
// ---------------------------------------------------------------------------

import {
  House,
  StaffUser,
  MeterReading,
  Payment,
  IncomeExpense,
  BillingRate,
} from "../types/khaneypani";

const KEYS = {
  houses: "kp_houses",
  staff: "kp_staff",
  readings: "kp_readings",
  payments: "kp_payments",
  incomeExpense: "kp_income_expense",
  rate: "kp_billing_rate",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

// ---------------------------------------------------------------------------
// Seed data (first run only) — remove once a real backend is connected
// ---------------------------------------------------------------------------
function seedIfEmpty() {
  const houses = read<House[]>(KEYS.houses, []);
  if (houses.length === 0) {
    const seeded: House[] = [
      {
        id: uid("house"),
        houseNo: "W1-001",
        ownerName: "Ram Bahadur Thapa",
        phone: "9841000001",
        wardNo: "1",
        tole: "Mahadev Tole",
        meterNo: "MTR-1001",
        connectionDate: "2023-01-10",
        status: "active",
        lastReadingUnit: 120,
        createdAt: new Date().toISOString(),
      },
      {
        id: uid("house"),
        houseNo: "W2-014",
        ownerName: "Sita Kumari Gurung",
        phone: "9841000002",
        wardNo: "2",
        tole: "Bhairab Tole",
        meterNo: "MTR-1002",
        connectionDate: "2023-03-22",
        status: "active",
        lastReadingUnit: 85,
        createdAt: new Date().toISOString(),
      },
    ];
    write(KEYS.houses, seeded);
  }

  const rate = read<BillingRate | null>(KEYS.rate, null);
  if (!rate) {
    write<BillingRate>(KEYS.rate, {
      ratePerUnit: 15,
      minimumCharge: 100,
      freeUnits: 5,
    });
  }
}

if (typeof window !== "undefined") seedIfEmpty();

// ---------------------------------------------------------------------------
// Houses
// ---------------------------------------------------------------------------
export function getHouses(): House[] {
  return read<House[]>(KEYS.houses, []);
}

export function getHouseById(id: string): House | undefined {
  return getHouses().find((h) => h.id === id);
}

export function registerHouse(input: Omit<House, "id" | "createdAt" | "status" | "lastReadingUnit"> & { startingUnit?: number }): House {
  const houses = getHouses();
  const newHouse: House = {
    id: uid("house"),
    houseNo: input.houseNo,
    ownerName: input.ownerName,
    phone: input.phone,
    wardNo: input.wardNo,
    tole: input.tole,
    meterNo: input.meterNo,
    connectionDate: input.connectionDate,
    status: "active",
    lastReadingUnit: input.startingUnit ?? 0,
    createdAt: new Date().toISOString(),
  };
  write(KEYS.houses, [newHouse, ...houses]);
  return newHouse;
}

// ---------------------------------------------------------------------------
// Staff / users
// ---------------------------------------------------------------------------
export function getStaff(): StaffUser[] {
  return read<StaffUser[]>(KEYS.staff, []);
}

export function registerStaff(input: Omit<StaffUser, "id" | "createdAt">): StaffUser {
  const staff = getStaff();
  const newStaff: StaffUser = { ...input, id: uid("staff"), createdAt: new Date().toISOString() };
  write(KEYS.staff, [newStaff, ...staff]);
  return newStaff;
}

// ---------------------------------------------------------------------------
// Billing rate
// ---------------------------------------------------------------------------
export function getBillingRate(): BillingRate {
  return read<BillingRate>(KEYS.rate, { ratePerUnit: 15, minimumCharge: 100, freeUnits: 5 });
}

export function setBillingRate(rate: BillingRate) {
  write(KEYS.rate, rate);
}

// Core billing calculation — flat rate above a free-unit allowance, with a
// minimum charge floor. Adjust to match your ward's actual tariff rule.
export function calculateAmount(previousUnit: number, currentUnit: number, rate: BillingRate) {
  const unitsUsed = Math.max(0, currentUnit - previousUnit);
  const billableUnits = Math.max(0, unitsUsed - rate.freeUnits);
  const calculated = billableUnits * rate.ratePerUnit;
  const amount = Math.max(calculated, rate.minimumCharge);
  return { unitsUsed, amount };
}

// ---------------------------------------------------------------------------
// Meter readings
// ---------------------------------------------------------------------------
export function getReadings(): MeterReading[] {
  return read<MeterReading[]>(KEYS.readings, []);
}

export function getReadingsByHouse(houseId: string): MeterReading[] {
  return getReadings()
    .filter((r) => r.houseId === houseId)
    .sort((a, b) => new Date(b.readingDate).getTime() - new Date(a.readingDate).getTime());
}

export function saveReading(input: {
  houseId: string;
  currentUnit: number;
  staffId: string;
  staffName: string;
}): MeterReading {
  const house = getHouseById(input.houseId);
  if (!house) throw new Error("House not found");

  const rate = getBillingRate();
  const previousUnit = house.lastReadingUnit;
  const { unitsUsed, amount } = calculateAmount(previousUnit, input.currentUnit, rate);

  const reading: MeterReading = {
    id: uid("read"),
    houseId: input.houseId,
    previousUnit,
    currentUnit: input.currentUnit,
    unitsUsed,
    ratePerUnit: rate.ratePerUnit,
    minimumCharge: rate.minimumCharge,
    amount,
    readingDate: new Date().toISOString(),
    readByStaffId: input.staffId,
    readByStaffName: input.staffName,
    paymentStatus: "unpaid",
    billNo: `BILL-${Date.now().toString().slice(-8)}`,
  };

  const readings = getReadings();
  write(KEYS.readings, [reading, ...readings]);

  // roll the house's "previous reading" forward
  const houses = getHouses().map((h) =>
    h.id === house.id ? { ...h, lastReadingUnit: input.currentUnit } : h
  );
  write(KEYS.houses, houses);

  return reading;
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------
export function getPayments(): Payment[] {
  return read<Payment[]>(KEYS.payments, []);
}

export function recordPayment(input: {
  houseId: string;
  readingId: string;
  amount: number;
  method: Payment["method"];
  collectedByStaffName: string;
}): Payment {
  const payment: Payment = {
    id: uid("pay"),
    houseId: input.houseId,
    readingId: input.readingId,
    amount: input.amount,
    paidDate: new Date().toISOString(),
    method: input.method,
    collectedByStaffName: input.collectedByStaffName,
  };
  write(KEYS.payments, [payment, ...getPayments()]);

  const readings = getReadings().map((r) =>
    r.id === input.readingId ? { ...r, paymentStatus: "paid" as const } : r
  );
  write(KEYS.readings, readings);

  return payment;
}

// ---------------------------------------------------------------------------
// Income / Expense
// ---------------------------------------------------------------------------
export function getIncomeExpense(): IncomeExpense[] {
  return read<IncomeExpense[]>(KEYS.incomeExpense, []);
}

export function addIncomeExpense(input: Omit<IncomeExpense, "id">): IncomeExpense {
  const entry: IncomeExpense = { ...input, id: uid("ie") };
  write(KEYS.incomeExpense, [entry, ...getIncomeExpense()]);
  return entry;
}

export function deleteIncomeExpense(id: string) {
  write(KEYS.incomeExpense, getIncomeExpense().filter((e) => e.id !== id));
}

// ---------------------------------------------------------------------------
// Dashboard summary helpers
// ---------------------------------------------------------------------------
export function getDashboardSummary() {
  const houses = getHouses();
  const readings = getReadings();
  const payments = getPayments();
  const ie = getIncomeExpense();

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalPending = readings
    .filter((r) => r.paymentStatus === "unpaid")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalIncome = ie.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0) + totalCollected;
  const totalExpense = ie.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0);

  const now = new Date();
  const thisMonthCollection = payments
    .filter((p) => {
      const d = new Date(p.paidDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, p) => s + p.amount, 0);

  return {
    totalHouses: houses.length,
    activeHouses: houses.filter((h) => h.status === "active").length,
    totalReadingsThisMonth: readings.filter((r) => {
      const d = new Date(r.readingDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
    totalCollected,
    totalPending,
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    thisMonthCollection,
    unpaidBillCount: readings.filter((r) => r.paymentStatus === "unpaid").length,
  };
}