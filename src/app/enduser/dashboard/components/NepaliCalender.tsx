// NepaliCalendar.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { adToBs, bsToAd } from "@sbmdkl/nepali-date-converter";

const nepaliMonths = [
    "बैशाख", "जेष्ठ", "आषाढ़", "श्रावण", "भाद्र", "आश्विन",
    "कार्तिक", "मंसिर", "पौष", "माघ", "फाल्गुन", "चैत्र"
];

const weekDays = ["आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"];

// Days in each BS month per year (2080-2085 range)
const bsMonthDays: Record<number, number[]> = {
    2079: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2081: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2083: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2084: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2085: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
};

interface BSDate {
    year: number;
    month: number; // 1-based
    day: number;
}

// Convert AD Date to BS
const adToBS = (date: Date): BSDate => {
    const adStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const result = adToBs(adStr);
    const parts = result.split("-");
    return {
        year: parseInt(parts[0]),
        month: parseInt(parts[1]),
        day: parseInt(parts[2]),
    };
};

// Convert BS date to AD Date
const bsToAD = (bs: BSDate): Date => {
    const bsStr = `${bs.year}-${String(bs.month).padStart(2, "0")}-${String(bs.day).padStart(2, "0")}`;
    const result = bsToAd(bsStr);
    return new Date(result);
};

// Get days in a BS month
const getDaysInBSMonth = (year: number, month: number): number => {
    if (bsMonthDays[year]) {
        return bsMonthDays[year][month - 1];
    }
    // Fallback: approximate
    return 30;
};

// Get day of week (0=Sun) for first day of BS month
const getFirstDayOfWeek = (year: number, month: number): number => {
    const adDate = bsToAD({ year, month, day: 1 });
    return adDate.getDay();
};

// Add months to a BS date (returns new year/month)
const addMonths = (year: number, month: number, delta: number): { year: number; month: number } => {
    let m = month - 1 + delta; // 0-based
    let y = year;
    while (m < 0) { m += 12; y--; }
    while (m > 11) { m -= 12; y++; }
    return { year: y, month: m + 1 };
};

interface CalendarDay {
    year: number;
    month: number;
    day: number;
    isCurrentMonth: boolean;
}

const NepaliCalendar = () => {
    const today = adToBS(new Date());

    const [currentYear, setCurrentYear] = useState(today.year);
    const [currentMonth, setCurrentMonth] = useState(today.month);
    const [selectedDate, setSelectedDate] = useState<BSDate | null>(null);
    const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

    useEffect(() => {
        generateCalendarDays(currentYear, currentMonth);
    }, [currentYear, currentMonth]);

    const generateCalendarDays = (year: number, month: number) => {
        const totalDays = getDaysInBSMonth(year, month);
        const startDayOfWeek = getFirstDayOfWeek(year, month);
        const days: CalendarDay[] = [];

        // Previous month days
        const prev = addMonths(year, month, -1);
        const prevTotalDays = getDaysInBSMonth(prev.year, prev.month);
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            days.push({
                year: prev.year,
                month: prev.month,
                day: prevTotalDays - i,
                isCurrentMonth: false,
            });
        }

        // Current month days
        for (let d = 1; d <= totalDays; d++) {
            days.push({ year, month, day: d, isCurrentMonth: true });
        }

        // Next month days to fill 42 cells
        const next = addMonths(year, month, 1);
        const remaining = 42 - days.length;
        for (let d = 1; d <= remaining; d++) {
            days.push({
                year: next.year,
                month: next.month,
                day: d,
                isCurrentMonth: false,
            });
        }

        setCalendarDays(days);
    };

    const handlePrevMonth = () => {
        const { year, month } = addMonths(currentYear, currentMonth, -1);
        setCurrentYear(year);
        setCurrentMonth(month);
    };

    const handleNextMonth = () => {
        const { year, month } = addMonths(currentYear, currentMonth, 1);
        setCurrentYear(year);
        setCurrentMonth(month);
    };

    const isToday = (d: CalendarDay) =>
        d.year === today.year && d.month === today.month && d.day === today.day;

    const isSelected = (d: CalendarDay) =>
        !!selectedDate &&
        d.year === selectedDate.year &&
        d.month === selectedDate.month &&
        d.day === selectedDate.day;

    const getFormattedBS = (bs: BSDate) =>
        `${bs.day} ${nepaliMonths[bs.month - 1]} ${bs.year}`;

    const getFormattedAD = (bs: BSDate) => {
        try {
            const adDate = bsToAD(bs);
            return adDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return "";
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {nepaliMonths[currentMonth - 1]} {currentYear}
                </h4>
                <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day, index) => (
                    <div
                        key={index}
                        className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 flex-1">
                {calendarDays.map((dayObj, index) => {
                    const isTodayDate = isToday(dayObj);
                    const isSelectedDate = isSelected(dayObj);

                    return (
                        <button
                            key={index}
                            onClick={() =>
                                setSelectedDate({ year: dayObj.year, month: dayObj.month, day: dayObj.day })
                            }
                            className={`
                relative p-2 text-center rounded-lg transition-all duration-200
                ${dayObj.isCurrentMonth ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-600"}
                ${isTodayDate ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold" : ""}
                ${isSelectedDate ? "bg-blue-500 text-white hover:bg-blue-600" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
                ${!dayObj.isCurrentMonth && !isSelectedDate ? "hover:bg-gray-50 dark:hover:bg-gray-800/50" : ""}
              `}
                        >
                            {dayObj.day}
                            {isTodayDate && !isSelectedDate && (
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Selected Date Info */}
            {selectedDate && (
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-semibold">नेपाली मिति:</span>{" "}
                                {getFormattedBS(selectedDate)}
                            </p>
                            <button
                                onClick={() => setSelectedDate(null)}
                                className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                            >
                                Clear
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            <span className="font-semibold">English Date:</span>{" "}
                            {getFormattedAD(selectedDate)}
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
};

export default NepaliCalendar;