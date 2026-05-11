"use client";

import { useDate } from "@/context/auth/PrimaryDateContext";
import { CalendarDays, Globe, Moon, Sun, Check } from "lucide-react";
import { useState, useEffect } from "react";

// ── tiny helpers ────────────────────────────────────────────────────────────

function getTodayAD(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getTodayBS(): string {
    try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { adToBs } = require("@sbmdkl/nepali-date-converter");
        return adToBs(getTodayAD());
    } catch {
        return "—";
    }
}

// ── toggle switch ────────────────────────────────────────────────────────────

function ToggleSwitch({
    checked,
    onChange,
    id,
}: {
    checked: boolean;
    onChange: () => void;
    id: string;
}) {
    return (
        <button
            id={id}
            role="switch"
            aria-checked={checked}
            onClick={onChange}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${checked ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
        >
            <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ${checked ? "translate-x-7" : "translate-x-0"
                    }`}
            />
        </button>
    );
}

// ── setting row ──────────────────────────────────────────────────────────────

function SettingRow({
    icon,
    title,
    description,
    control,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    control: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-[#1f1f1f] px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                    {icon}
                </div>
                <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
            <div className="shrink-0">{control}</div>
        </div>
    );
}

// ── date preview card ────────────────────────────────────────────────────────

function DatePreviewCard({ isPrimaryBS }: { isPrimaryBS: boolean }) {
    const todayAD = getTodayAD();
    const todayBS = getTodayBS();

    return (
        <div className="rounded-xl border border-teal-100 dark:border-teal-900/40 bg-teal-50 dark:bg-teal-900/10 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-3">
                Today's Date Preview
            </p>
            <div className="flex gap-6">
                <div
                    className={`flex-1 rounded-lg px-4 py-3 transition-all duration-200 ${isPrimaryBS
                        ? "bg-white dark:bg-[#1f1f1f] shadow ring-2 ring-teal-500"
                        : "bg-transparent opacity-50"
                        }`}
                >
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                        Bikram Sambat
                    </p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100 font-mono">
                        {todayBS}
                    </p>
                    {isPrimaryBS && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-teal-600 dark:text-teal-400">
                            <Check size={10} /> Active
                        </span>
                    )}
                </div>

                <div
                    className={`flex-1 rounded-lg px-4 py-3 transition-all duration-200 ${!isPrimaryBS
                        ? "bg-white dark:bg-[#1f1f1f] shadow ring-2 ring-teal-500"
                        : "bg-transparent opacity-50"
                        }`}
                >
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                        Anno Domini
                    </p>
                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100 font-mono">
                        {todayAD}
                    </p>
                    {!isPrimaryBS && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-teal-600 dark:text-teal-400">
                            <Check size={10} /> Active
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── main page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const { dateType, setDateType, isPrimaryBS } = useDate();

    // Dark-mode state (local — wire to your own theme context if you have one)
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        setIsDark(document.documentElement.classList.contains("dark"));
    }, []);
    const toggleDark = () => {
        document.documentElement.classList.toggle("dark");
        setIsDark((prev) => !prev);
    };

    const [saved, setSaved] = useState(false);
    const handleSave = () => {
        // dateType is already persisted to localStorage by PrimaryDateContext.
        // Add any extra save logic (API call, etc.) here.
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#18181b] font-poppins">
            {/* ── content ── */}
            <div className="mx-auto max-w-2xl px-4 py-8 space-y-8">

                {/* Date & Calendar section */}
                <section>
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 px-1">
                        Date &amp; Calendar
                    </h2>

                    <div className="space-y-3">
                        <SettingRow
                            icon={<CalendarDays size={18} />}
                            title="Primary Calendar System"
                            description={
                                isPrimaryBS
                                    ? "Using Bikram Sambat (BS) — all date pickers show Nepali calendar"
                                    : "Using Anno Domini (AD) — all date pickers show English calendar"
                            }
                            control={
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`text-xs font-semibold ${!isPrimaryBS
                                            ? "text-teal-600 dark:text-teal-400"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        AD
                                    </span>
                                    <ToggleSwitch
                                        id="date-type-toggle"
                                        checked={isPrimaryBS}
                                        onChange={() =>
                                            setDateType(dateType === "bs" ? "ad" : "bs")
                                        }
                                    />
                                    <span
                                        className={`text-xs font-semibold ${isPrimaryBS
                                            ? "text-teal-600 dark:text-teal-400"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        BS
                                    </span>
                                </div>
                            }
                        />

                        {/* Live preview of today's date in both systems */}
                        <DatePreviewCard isPrimaryBS={isPrimaryBS} />
                    </div>
                </section>

                {/* Appearance section */}
                <section>
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 px-1">
                        Appearance
                    </h2>
                    <div className="space-y-3">
                        <SettingRow
                            icon={isDark ? <Moon size={18} /> : <Sun size={18} />}
                            title="Dark Mode"
                            description="Switch between light and dark interface theme"
                            control={
                                <ToggleSwitch
                                    id="dark-mode-toggle"
                                    checked={isDark}
                                    onChange={toggleDark}
                                />
                            }
                        />
                    </div>
                </section>

                {/* Language section (placeholder — easy to extend) */}
                <section>
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 px-1">
                        Language
                    </h2>
                    <div className="space-y-3">
                        <SettingRow
                            icon={<Globe size={18} />}
                            title="Interface Language"
                            description="Currently set to English"
                            control={
                                <span className="rounded-full bg-teal-50 dark:bg-teal-900/30 px-3 py-1 text-xs font-semibold text-teal-700 dark:text-teal-300">
                                    English
                                </span>
                            }
                        />
                    </div>
                </section>

                {/* Save button */}
                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleSave}
                        className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ${saved
                            ? "bg-green-500 cursor-default"
                            : "bg-teal-500 hover:bg-teal-600 active:scale-95"
                            }`}
                    >
                        {saved ? (
                            <>
                                <Check size={15} /> Saved!
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}