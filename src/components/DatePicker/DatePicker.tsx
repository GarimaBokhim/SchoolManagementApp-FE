import { useState, useEffect } from "react";
import { useDate } from "@/context/auth/PrimaryDateContext";
import EnglishDatePicker from "./EnglishDatePicker";
import { NepaliDatePicker } from "./NepaliDatePicker";
import { adToBs, bsToAd } from "@sbmdkl/nepali-date-converter";

type Props = {
  isDatePrimary: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: any;
  label: string;
  name: string;
  dateType?: "date" | "string";
  onChangeSelectedDate?: (date: string) => void;
  isReport: boolean;
  required?: boolean;
  isExpiryDate: boolean;
};

/** Safely convert an AD date string → BS string. Returns "" on failure. */
function safeAdToBs(adStr: string): string {
  if (!adStr) return "";
  try {
    const dateOnly = adStr.split("T")[0];
    return adToBs(dateOnly);
  } catch {
    return "";
  }
}

/** Safely convert a BS date string → AD string. Returns "" on failure. */
function safeBsToAd(bsStr: string): string {
  if (!bsStr) return "";
  try {
    return bsToAd(bsStr);
  } catch {
    return "";
  }
}

/** Today's date as "YYYY-MM-DD" in AD */
function todayAD(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Returns true if the date string looks like a BS year (year > 2080) */
function isBSDate(dateStr: string): boolean {
  return Number(dateStr.split("-")[0]) > 2080;
}

/**
 * Safely convert any form value (Date object, ISO string, BS string, or "")
 * into a plain "YYYY-MM-DD" string. Returns "" if conversion fails.
 */
function rawToDateString(raw: unknown): string {
  if (!raw) return "";
  if (raw instanceof Date) {
    if (isNaN(raw.getTime())) return "";
    return raw.toISOString().split("T")[0];
  }
  if (typeof raw === "string") {
    return raw.split("T")[0];
  }
  return "";
}

export default function DatePicker({
  isDatePrimary,
  label,
  name,
  required,
  onChangeSelectedDate,
  form,
  isExpiryDate,
}: Props) {
  const { isPrimaryBS } = useDate();

  // ─── Derive initial display value from the existing form value ──────────
  // isPrimaryBS = true  → Nepali (BS) calendar → display BS string
  // isPrimaryBS = false → English (AD) calendar → display AD string
  const getInitialDisplayDate = (): string => {
    const dateOnly = rawToDateString(form?.getValues?.(name));

    if (!dateOnly) {
      return isPrimaryBS
        ? safeAdToBs(todayAD()) || todayAD()
        : todayAD();
    }

    if (isPrimaryBS) {
      if (isBSDate(dateOnly)) return dateOnly;
      return safeAdToBs(dateOnly) || dateOnly;
    } else {
      if (!isBSDate(dateOnly)) return dateOnly;
      return safeBsToAd(dateOnly) || dateOnly;
    }
  };

  const [displayDate, setDisplayDate] = useState<string>(getInitialDisplayDate);

  // Re-sync when form value changes externally (e.g. async StudentData load)
  useEffect(() => {
    const dateOnly = rawToDateString(form?.getValues?.(name));
    if (!dateOnly) return;

    if (isPrimaryBS) {
      if (isBSDate(dateOnly)) {
        setDisplayDate(dateOnly);
      } else {
        const bs = safeAdToBs(dateOnly);
        if (bs) setDisplayDate(bs);
      }
    } else {
      if (!isBSDate(dateOnly)) {
        setDisplayDate(dateOnly);
      } else {
        const ad = safeBsToAd(dateOnly);
        if (ad) setDisplayDate(ad);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.getValues?.(name), isPrimaryBS]);

  // ─── Handler for English (AD) calendar ──────────────────────────────────
  // Convert AD → BS before storing so backend always gets BS string
  const handleDate = (adDate: string) => {
    setDisplayDate(adDate);
    const bsEquivalent = safeAdToBs(adDate);
    const valueToStore = bsEquivalent || adDate;
    form.setValue(name, valueToStore);
    onChangeSelectedDate?.(valueToStore);
  };

  // Note: NepaliDatePicker handles its own form.setValue internally,
  // but we also hook onChangeSelectedDate via a wrapper if needed.

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div>
      {isPrimaryBS ? (
        // ── Nepali (BS) Calendar — uses our custom component ──────────────
        <div>
          <NepaliDatePicker
            form={form}
            name={name}
            label={label}
            required={required}
            placeholder="मिति छान्नुहोस्"
          />
          {/* Show AD equivalent below for reference */}
          <p className="pl-2 text-teal-500 text-xs mt-1">
            {displayDate ? safeBsToAd(
              // displayDate might be AD after NepaliDatePicker stores AD ISO —
              // read from form instead which has the BS value
              (() => {
                const v = rawToDateString(form?.getValues?.(name));
                return isBSDate(v) ? v : safeAdToBs(v);
              })()
            ) || "" : ""} (AD)
          </p>
        </div>
      ) : (
        // ── English (AD) Calendar ─────────────────────────────────────────
        <div>
          <div className="relative w-full">
            <EnglishDatePicker
              onChange={handleDate}
              label={`${label}`}
              name={name}
              defaultDate={displayDate}
              value={displayDate}
              isExpiryDate={isExpiryDate}
            />
            <label
              htmlFor={name}
              className={`absolute left-1 ${form.watch(name)
                  ? "bg-[#FBFBFB] dark:bg-[#27272a]"
                  : "bg-[#FBFBFB]"
                } scale-90 peer-placeholder-shown:scale-100 peer-focus:scale-90 -top-[0.8rem] px-2 origin-left peer-placeholder-shown:top-2 peer-focus:-top-[0.8rem] peer-focus:text-teal-500 dark:peer-focus:text-gray-200 peer-focus:bg-[#FBFBFB] dark:peer-focus:bg-[#27272a] text-gray-500 transition-all pointer-events-none`}
            >
              <div className="flex items-center">
                {required && (
                  <span className="text-red-500 text-xl mr-1">*</span>
                )}
                {label ?? ""}
              </div>
            </label>
            {/* Show BS equivalent below for reference */}
            <p className="pl-2 text-teal-500 text-xs mt-1">
              {safeAdToBs(displayDate) || ""} (BS)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}