export const formatCurrency = (amount: number | null | undefined) => {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

export const formatDate = (date: string | null | undefined) => {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const paymentMethodLabels: Record<number, string> = {
  1: "Cash",
  2: "Credit Card",
  3: "Debit Card",
  4: "Bank Transfer",
  5: "Mobile Payment",
  6: "Check",
};

export const paymentMethodOptions = [
  { id: 1, name: "Cash" },
  { id: 2, name: "Credit Card" },
  { id: 3, name: "Debit Card" },
  { id: 4, name: "Bank Transfer" },
  { id: 5, name: "Mobile Payment" },
  { id: 6, name: "Check" },
];

export const formatPaymentMethod = (method: number | null | undefined) =>
  (method && paymentMethodLabels[method]) || "Other";

const devanagariDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export const toDevanagariDigits = (value: string | null | undefined) => {
  if (!value) return value ?? "";
  return value.replace(/[0-9]/g, (digit) => devanagariDigits[Number(digit)]);
};


const billStatusLabels: Record<number, string> = {
  1: "Draft",
  2: "Paid",
  3: "Unpaid",
  4: "Partially Paid",
};

export const formatBillStatus = (status: number | null | undefined) =>
  (status && billStatusLabels[status]) || "-";
