import { useState, useEffect } from "react";
import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import { useDate } from "@/context/auth/PrimaryDateContext";
import EnglishDatePicker from "./EnglishDatePicker";
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
  // Date object → ISO string → date part
  if (raw instanceof Date) {
    if (isNaN(raw.getTime())) return "";
    return raw.toISOString().split("T")[0];
  }
  // Already a string
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
  // isPrimaryBS = true  → user wants Nepali (BS) calendar → display BS string
  // isPrimaryBS = false → user wants English (AD) calendar → display AD string
  const getInitialDisplayDate = (): string => {
    const dateOnly = rawToDateString(form?.getValues?.(name));

    if (!dateOnly) {
      // Nothing stored yet — show today in the correct format
      return isPrimaryBS
        ? safeAdToBs(todayAD()) || todayAD()  // BS calendar needs BS string
        : todayAD();                            // AD calendar needs AD string
    }

    if (isPrimaryBS) {
      // BS calendar — we need a BS string to display
      if (isBSDate(dateOnly)) return dateOnly;       // already BS
      return safeAdToBs(dateOnly) || dateOnly;       // convert AD → BS
    } else {
      // AD calendar — we need an AD string to display
      if (!isBSDate(dateOnly)) return dateOnly;      // already AD
      return safeBsToAd(dateOnly) || dateOnly;       // convert BS → AD
    }
  };

  const [displayDate, setDisplayDate] = useState<string>(getInitialDisplayDate);

  // Re-sync when form value changes externally (e.g. after async StudentData loads)
  useEffect(() => {
    const dateOnly = rawToDateString(form?.getValues?.(name));
    if (!dateOnly) return;

    if (isPrimaryBS) {
      // BS calendar — ensure displayDate is a BS string
      if (isBSDate(dateOnly)) {
        setDisplayDate(dateOnly);
      } else {
        const bs = safeAdToBs(dateOnly);
        if (bs) setDisplayDate(bs);
      }
    } else {
      // AD calendar — ensure displayDate is an AD string
      if (!isBSDate(dateOnly)) {
        setDisplayDate(dateOnly);
      } else {
        const ad = safeBsToAd(dateOnly);
        if (ad) setDisplayDate(ad);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.getValues?.(name), isPrimaryBS]);

  // ─── Handlers ───────────────────────────────────────────────────────────

  // Called by the Nepali (BS) calendar — store BS string directly
  const handleNepaliDate = ({ bsDate }: { bsDate: string }) => {
    setDisplayDate(bsDate);
    form.setValue(name, bsDate);
    onChangeSelectedDate?.(bsDate);
  };

  // Called by the English (AD) calendar — convert AD → BS before storing
  const handleDate = (adDate: string) => {
    setDisplayDate(adDate);
    const bsEquivalent = safeAdToBs(adDate);
    const valueToStore = bsEquivalent || adDate;
    form.setValue(name, valueToStore);
    onChangeSelectedDate?.(valueToStore);
  };

  // ─── Render ─────────────────────────────────────────────────────────────
  // ✅ isPrimaryBS = true  → show Nepali (BS) calendar
  // ✅ isPrimaryBS = false → show English (AD) calendar

  return (
    <div>
      {isPrimaryBS ? (
        // ── Nepali (BS) Calendar ──────────────────────────────────────────
        <div>
          <Calendar
            onChange={handleNepaliDate}
            placeholder="Enter a date"
            language="en"
            defaultDate={displayDate || undefined}
            label={`${label}`}
            name={name}
            theme="green"
            hideDefaultValue={false}
            inputClassName={`w-full p-2 py-3 border ${form.formState.errors[name] ? "border-red-500" : "border-gray-400"
              } rounded-md outline-none dark:text-white dark:bg-[#27272a] peer placeholder:opacity-0 bg-[#FBFBFB] focus:border-[#14b8a6]`}
            containerClassName={"relative w-full"}
            labelClassName={`absolute left-1 flex pt-1 bg-[#FBFBFB] items-center dark:peer-focus:bg-[#27272a] dark:peer-focus:text-[#14b8a6] scale-90 peer-placeholder-shown:scale-100 peer-focus:scale-90 -top-[0.8rem] px-2 origin-left dark:text-white peer-placeholder-shown:top-2 dark:bg-[#27272a] peer-focus:-top-[0.8rem] peer-focus:text-[#14b8a6] peer-focus:bg-[#FBFBFB] text-gray-500 transition-all pointer-events-none`}
          />
          {/* Show AD equivalent for reference */}
          <p className="pl-2 text-teal-500 text-xs mt-1">
            {safeBsToAd(displayDate) || ""} (AD)
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
            {/* Show BS equivalent for reference */}
            <p className="pl-2 text-teal-500 text-xs mt-1">
              {safeAdToBs(displayDate) || ""} (BS)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}