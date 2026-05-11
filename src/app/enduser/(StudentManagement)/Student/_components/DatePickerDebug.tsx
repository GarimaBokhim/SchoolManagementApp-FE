"use client";

import { useState } from "react";
import { useDate } from "@/context/auth/PrimaryDateContext";
import { adToBs, bsToAd } from "@sbmdkl/nepali-date-converter";
import { Bug, ChevronDown, ChevronUp, X } from "lucide-react";

function safeConvert(fn: () => string): string {
    try {
        return fn();
    } catch (e) {
        return `ERROR: ${e}`;
    }
}

function todayAD(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface DebugRow {
    label: string;
    value: string;
    status?: "ok" | "warn" | "error";
}

function Row({ label, value, status = "ok" }: DebugRow) {
    const colors = {
        ok: "text-green-400",
        warn: "text-yellow-400",
        error: "text-red-400",
    };
    return (
        <div className="flex justify-between gap-4 py-1 border-b border-gray-700 last:border-0">
            <span className="text-gray-400 text-xs shrink-0">{label}</span>
            <span className={`text-xs font-mono font-semibold text-right ${colors[status]}`}>
                {value}
            </span>
        </div>
    );
}

interface DatePickerDebugPanelProps {
    // Pass your form values here
    formValues?: {
        dateOfBirth?: string;
        enrollmentDate?: string;
        [key: string]: string | undefined;
    };
    // Pass any extra fields you want to inspect
    extraFields?: { label: string; value: string }[];
}

export function DatePickerDebugPanel({
    formValues = {},
    extraFields = [],
}: DatePickerDebugPanelProps) {
    const { dateType, isPrimaryBS } = useDate();
    const [collapsed, setCollapsed] = useState(false);
    const [closed, setClosed] = useState(false);

    if (closed) return null;

    const ad = todayAD();
    const bs = safeConvert(() => adToBs(ad));

    // For each form date value, show what conversion gives
    const dateRows: DebugRow[] = Object.entries(formValues).map(([key, val]) => {
        if (!val) return { label: key, value: "(empty)", status: "warn" };

        const dateOnly = val.split("T")[0];
        const year = Number(dateOnly.split("-")[0]);
        const isBsValue = year > 2080;

        let converted = "";
        let status: "ok" | "warn" | "error" = "ok";

        if (isBsValue) {
            converted = safeConvert(() => bsToAd(dateOnly));
            status = converted.startsWith("ERROR") ? "error" : "ok";
        } else {
            converted = safeConvert(() => adToBs(dateOnly));
            status = converted.startsWith("ERROR") ? "error" : "ok";
        }

        return {
            label: key,
            value: `${dateOnly} ${isBsValue ? "(BS)" : "(AD)"} → ${converted}`,
            status,
        };
    });

    return (
        <div
            className="fixed bottom-4 right-4 z-[9999] w-80 rounded-xl shadow-2xl border border-gray-700 bg-gray-900 text-white font-mono overflow-hidden"
            style={{ fontSize: 11 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <Bug size={13} className="text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-400 tracking-wide">
                        DatePicker Debug
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCollapsed((p) => !p)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        {collapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                    <button
                        onClick={() => setClosed(true)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                        <X size={13} />
                    </button>
                </div>
            </div>

            {!collapsed && (
                <div className="p-3 space-y-3 max-h-[60vh] overflow-y-auto">

                    {/* Context state */}
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                            PrimaryDateContext
                        </p>
                        <Row
                            label="dateType"
                            value={dateType}
                            status={dateType === "bs" || dateType === "ad" ? "ok" : "error"}
                        />
                        <Row
                            label="isPrimaryBS"
                            value={String(isPrimaryBS)}
                            status={isPrimaryBS ? "ok" : "warn"}
                        />
                        <Row
                            label="localStorage[dateType]"
                            value={
                                typeof window !== "undefined"
                                    ? localStorage.getItem("dateType") ?? "(not set)"
                                    : "SSR"
                            }
                            status={
                                typeof window !== "undefined" &&
                                    localStorage.getItem("dateType") === dateType
                                    ? "ok"
                                    : "warn"
                            }
                        />
                    </div>

                    {/* Which calendar should render */}
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                            Calendar Logic
                        </p>
                        <Row
                            label="isPrimaryBS"
                            value={String(isPrimaryBS)}
                        />
                        <Row
                            label="should show"
                            value={isPrimaryBS ? "🇳🇵 Nepali (BS) Calendar" : "🇬🇧 English (AD) Calendar"}
                            status={isPrimaryBS ? "ok" : "warn"}
                        />
                        <Row
                            label="condition used"
                            value={isPrimaryBS ? "isPrimaryBS === true → BS" : "isPrimaryBS === false → AD"}
                        />
                    </div>

                    {/* Today's date conversions */}
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                            Today's Date
                        </p>
                        <Row label="AD" value={ad} status="ok" />
                        <Row
                            label="→ BS"
                            value={bs}
                            status={bs.startsWith("ERROR") ? "error" : "ok"}
                        />
                    </div>

                    {/* Form date values */}
                    {dateRows.length > 0 && (
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                                Form Date Values
                            </p>
                            {dateRows.map((r) => (
                                <Row key={r.label} {...r} />
                            ))}
                        </div>
                    )}

                    {/* Extra fields */}
                    {extraFields.length > 0 && (
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                                Extra
                            </p>
                            {extraFields.map((f) => (
                                <Row key={f.label} label={f.label} value={f.value} />
                            ))}
                        </div>
                    )}

                    {/* Diagnosis */}
                    <div className="rounded-lg bg-gray-800 px-3 py-2 mt-1">
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
                            Diagnosis
                        </p>
                        {isPrimaryBS ? (
                            <p className="text-green-400 text-xs">
                                ✅ Context says BS. DatePicker should render Nepali calendar.
                                If it shows English, the condition in DatePicker.tsx is inverted.
                            </p>
                        ) : (
                            <p className="text-yellow-400 text-xs">
                                ⚠️ Context says AD. Toggle to BS in Settings to enable Nepali calendar.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}