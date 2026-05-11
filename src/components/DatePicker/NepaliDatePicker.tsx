// components/Input/NepaliDatePicker.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react'
import { adToBs, bsToAd } from '@sbmdkl/nepali-date-converter'
import { UseFormReturn, FieldValues, Path } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const nepaliMonths = [
    'बैशाख', 'जेष्ठ', 'आषाढ़', 'श्रावण', 'भाद्र', 'आश्विन',
    'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
]

const weekDays = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि']

const bsMonthDays: Record<number, number[]> = {
    2079: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2081: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2083: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2084: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2085: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
}

interface BSDate { year: number; month: number; day: number }
interface CalendarDay extends BSDate { isCurrentMonth: boolean }

const adToBS = (date: Date): BSDate => {
    const adStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const result = adToBs(adStr)
    const [y, m, d] = result.split('-')
    return { year: +y, month: +m, day: +d }
}

const bsToAD = (bs: BSDate): Date => {
    const bsStr = `${bs.year}-${String(bs.month).padStart(2, '0')}-${String(bs.day).padStart(2, '0')}`
    return new Date(bsToAd(bsStr))
}

/** Format a BSDate as "YYYY-MM-DD" BS string */
const bsDateToString = (bs: BSDate): string =>
    `${bs.year}-${String(bs.month).padStart(2, '0')}-${String(bs.day).padStart(2, '0')}`

const getDaysInBSMonth = (year: number, month: number): number =>
    bsMonthDays[year]?.[month - 1] ?? 30

const getFirstDayOfWeek = (year: number, month: number): number =>
    bsToAD({ year, month, day: 1 }).getDay()

const shiftMonth = (year: number, month: number, delta: number) => {
    let m = month - 1 + delta
    let y = year
    while (m < 0) { m += 12; y-- }
    while (m > 11) { m -= 12; y++ }
    return { year: y, month: m + 1 }
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface NepaliDatePickerProps<T extends FieldValues> {
    form: UseFormReturn<T>
    name: Path<T>
    label?: string
    required?: boolean
    placeholder?: string
    /** Called after a date is selected, with the BS string "YYYY-MM-DD" */
    onChangeSelectedDate?: (bsDate: string) => void
    /** Initial BS date string "YYYY-MM-DD" to pre-fill (for edit forms) */
    defaultBsDate?: string
    /** Controlled value — when provided the picker reflects this date */
    value?: string
    error?: boolean
    maxDate?: string
    minDate?: string
}

export function NepaliDatePicker<T extends FieldValues>({
    form, name, label, required,
    placeholder = 'YYYY-MM-DD',
    onChangeSelectedDate,
    defaultBsDate,
    value,
    error: externalError,
    maxDate,
    minDate,
}: NepaliDatePickerProps<T>) {
    const today = adToBS(new Date())

    // Get error from form if not provided externally
    const fieldError = externalError ?? form.formState.errors[name]

    // ── Parse defaultBsDate to pre-fill the picker ───────────────────────────
    const parseDefaultBS = (): BSDate | null => {
        const dateToParse = value ?? defaultBsDate
        if (!dateToParse) return null;
        const parts = dateToParse.split('-').map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) return null;
        return { year: parts[0], month: parts[1], day: parts[2] };
    }

    const defaultBS = parseDefaultBS();

    const [open, setOpen] = useState(false)
    const [currentYear, setCurrentYear] = useState(defaultBS?.year ?? today.year)
    const [currentMonth, setCurrentMonth] = useState(defaultBS?.month ?? today.month)
    const [selectedBS, setSelectedBS] = useState<BSDate | null>(defaultBS)
    const [displayValue, setDisplayValue] = useState(
        defaultBS ? bsDateToString(defaultBS) : ''
    )
    const containerRef = useRef<HTMLDivElement>(null)

    // Sync when defaultBsDate or value changes (async edit form load)
    useEffect(() => {
        const dateToSync = value ?? defaultBsDate
        if (!dateToSync) return;
        const parts = dateToSync.split('-').map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) return;
        const bs = { year: parts[0], month: parts[1], day: parts[2] };
        setSelectedBS(bs);
        setCurrentYear(bs.year);
        setCurrentMonth(bs.month);
        setDisplayValue(bsDateToString(bs));
    }, [defaultBsDate, value]);

    // Build calendar grid
    const buildDays = (): CalendarDay[] => {
        const total = getDaysInBSMonth(currentYear, currentMonth)
        const startDow = getFirstDayOfWeek(currentYear, currentMonth)
        const days: CalendarDay[] = []

        const prev = shiftMonth(currentYear, currentMonth, -1)
        const prevTotal = getDaysInBSMonth(prev.year, prev.month)
        for (let i = startDow - 1; i >= 0; i--)
            days.push({ year: prev.year, month: prev.month, day: prevTotal - i, isCurrentMonth: false })

        for (let d = 1; d <= total; d++)
            days.push({ year: currentYear, month: currentMonth, day: d, isCurrentMonth: true })

        const next = shiftMonth(currentYear, currentMonth, 1)
        for (let d = 1; days.length < 42; d++)
            days.push({ year: next.year, month: next.month, day: d, isCurrentMonth: false })

        return days
    }

    const handleSelect = (dayObj: CalendarDay) => {
        const bs: BSDate = { year: dayObj.year, month: dayObj.month, day: dayObj.day }
        setSelectedBS(bs)

        // Store BS string to form — backend wants BS, not AD ISO
        const bsString = bsDateToString(bs)
        form.setValue(name, bsString as never)
        onChangeSelectedDate?.(bsString)

        // Display label
        setDisplayValue(bsString)
        setOpen(false)

        setCurrentYear(dayObj.year)
        setCurrentMonth(dayObj.month)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let raw = e.target.value.replace(/[^\d]/g, "");
        if (raw.length > 8) raw = raw.slice(0, 8);

        const year = raw.slice(0, 4);
        let month = raw.slice(4, 6);
        let day = raw.slice(6, 8);

        // Validate month (1-12 for BS)
        if (month.length === 1 && parseInt(month) > 1) month = "0" + month;
        if (month && (parseInt(month) < 1 || parseInt(month) > 12)) month = "12";

        // Validate day (1-32 for BS, but will be further validated)
        if (day.length === 1 && parseInt(day) > 3) day = "0" + day;
        if (day && (parseInt(day) < 1 || parseInt(day) > 32)) day = "32";

        let formatted = year;
        if (month) formatted += "-" + month;
        if (day) formatted += "-" + day;

        setDisplayValue(formatted);

        // If complete date entered, validate and set
        if (formatted.length === 10) {
            const parts = formatted.split('-').map(Number);
            if (parts.length === 3 && !parts.some(isNaN)) {
                const year = parts[0];
                const month = parts[1];
                const day = parts[2];

                // Validate if date exists in BS calendar
                const daysInMonth = getDaysInBSMonth(year, month);
                if (day <= daysInMonth) {
                    const bs = { year, month, day };
                    setSelectedBS(bs);
                    setCurrentYear(year);
                    setCurrentMonth(month);
                    form.setValue(name, formatted as never);
                    onChangeSelectedDate?.(formatted);
                }
            }
        }
    };

    const isToday = (d: CalendarDay) =>
        d.year === today.year && d.month === today.month && d.day === today.day

    const isSelected = (d: CalendarDay) =>
        !!selectedBS && d.year === selectedBS.year && d.month === selectedBS.month && d.day === selectedBS.day

    const days = buildDays()

    return (
        <div className="flex flex-col gap-3 relative" ref={containerRef}>
            <Label
                htmlFor={name}
                className="absolute left-1 flex pt-1 bg-[#FBFBFB] items-center scale-90 -top-[0.8rem] px-2 origin-left text-gray-500 transition-all pointer-events-none dark:bg-[#27272a]"
            >
                {required && <span className="text-red-500 text-xl mr-1">*</span>}
                {label}
            </Label>
            <div className="relative flex gap-2">
                <Input
                    id={name}
                    value={displayValue}
                    placeholder={placeholder}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setOpen(true);
                        }
                    }}
                    className={`w-full p-2 py-[1rem] border rounded-md outline-none peer bg-[#FBFBFB] ${fieldError ? "border-red-500" : "border-gray-400"
                        } dark:text-white dark:bg-[#27272a] focus:border-[#14b8a6]`}
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="nepali-date-picker"
                            variant="ghost"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">Select Nepali date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                    >
                        <div className="bg-white dark:bg-gray-800 p-4 w-72">
                            {/* Month/Year nav */}
                            <div className="flex items-center justify-between mb-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { const s = shiftMonth(currentYear, currentMonth, -1); setCurrentYear(s.year); setCurrentMonth(s.month) }}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full h-8 w-8"
                                >
                                    <ChevronLeft size={18} />
                                </Button>
                                <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                                    {nepaliMonths[currentMonth - 1]} {currentYear}
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { const s = shiftMonth(currentYear, currentMonth, 1); setCurrentYear(s.year); setCurrentMonth(s.month) }}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full h-8 w-8"
                                >
                                    <ChevronRight size={18} />
                                </Button>
                            </div>

                            {/* Week headers */}
                            <div className="grid grid-cols-7 mb-1">
                                {weekDays.map(d => (
                                    <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
                                ))}
                            </div>

                            {/* Day grid */}
                            <div className="grid grid-cols-7 gap-0.5">
                                {days.map((dayObj, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => handleSelect(dayObj)}
                                        className={`
                                            text-center text-xs rounded-lg py-1.5 transition-all w-8 h-8
                                            ${!dayObj.isCurrentMonth ? 'text-gray-300 dark:text-gray-600' : 'text-gray-800 dark:text-gray-100'}
                                            ${isToday(dayObj) && !isSelected(dayObj) ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold' : ''}
                                            ${isSelected(dayObj) ? 'bg-teal-500 text-white font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                                        `}
                                    >
                                        {dayObj.day}
                                    </button>
                                ))}
                            </div>

                            {/* Selected date info */}
                            {selectedBS && (
                                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
                                    <span>{nepaliMonths[selectedBS.month - 1]} {selectedBS.day}, {selectedBS.year}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedBS(null)
                                            setDisplayValue('')
                                            form.setValue(name, '' as never)
                                            onChangeSelectedDate?.('')
                                        }}
                                        className="text-red-400 hover:text-red-500 text-[10px] h-auto p-1"
                                    >
                                        Clear
                                    </Button>
                                </div>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}