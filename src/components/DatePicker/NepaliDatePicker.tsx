// components/Input/NepaliDatePicker.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { adToBs, bsToAd } from '@sbmdkl/nepali-date-converter'
import { UseFormReturn, FieldValues, Path } from 'react-hook-form'

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
}

export function NepaliDatePicker<T extends FieldValues>({
    form, name, label, required,
    placeholder = 'मिति छान्नुहोस्',
    onChangeSelectedDate,
    defaultBsDate,
}: NepaliDatePickerProps<T>) {
    const today = adToBS(new Date())

    // ── Parse defaultBsDate to pre-fill the picker ───────────────────────────
    const parseDefaultBS = (): BSDate | null => {
        if (!defaultBsDate) return null;
        const parts = defaultBsDate.split('-').map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) return null;
        return { year: parts[0], month: parts[1], day: parts[2] };
    }

    const defaultBS = parseDefaultBS();

    const [open, setOpen] = useState(false)
    const [currentYear, setCurrentYear] = useState(defaultBS?.year ?? today.year)
    const [currentMonth, setCurrentMonth] = useState(defaultBS?.month ?? today.month)
    const [selectedBS, setSelectedBS] = useState<BSDate | null>(defaultBS)
    const [displayValue, setDisplayValue] = useState(
        defaultBS ? `${bsDateToString(defaultBS)} BS` : ''
    )
    const containerRef = useRef<HTMLDivElement>(null)

    // Sync when defaultBsDate changes (async edit form load)
    useEffect(() => {
        if (!defaultBsDate) return;
        const parts = defaultBsDate.split('-').map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) return;
        const bs = { year: parts[0], month: parts[1], day: parts[2] };
        setSelectedBS(bs);
        setCurrentYear(bs.year);
        setCurrentMonth(bs.month);
        setDisplayValue(`${bsDateToString(bs)} BS`);
    }, [defaultBsDate]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

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

        // ✅ Store BS string to form — backend wants BS, not AD ISO
        const bsString = bsDateToString(bs)
        form.setValue(name, bsString as never)
        onChangeSelectedDate?.(bsString)

        // Display label
        setDisplayValue(`${bsString} BS`)
        setOpen(false)

        setCurrentYear(dayObj.year)
        setCurrentMonth(dayObj.month)
    }

    const isToday = (d: CalendarDay) =>
        d.year === today.year && d.month === today.month && d.day === today.day

    const isSelected = (d: CalendarDay) =>
        !!selectedBS && d.year === selectedBS.year && d.month === selectedBS.month && d.day === selectedBS.day

    const days = buildDays()

    return (
        <div className="flex flex-col gap-1 relative" ref={containerRef}>
            {label && (
                <label className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    {required && <span className="text-red-500 text-xl mr-1">*</span>}
                    {label}
                </label>
            )}

            {/* Input trigger */}
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className={`flex items-center justify-between w-full px-3 py-2 border ${form.formState.errors[name] ? 'border-red-500' : 'border-[#035BBA]'
                    } rounded-md bg-[#ffffff] dark:bg-[#353535] text-sm text-left text-gray-800 dark:text-gray-100 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
            >
                <span className={displayValue ? 'dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
                    {displayValue || placeholder}
                </span>
                <Calendar size={16} className="text-gray-400 flex-shrink-0" />
            </button>

            {/* Dropdown calendar — absolute so it doesn't shift layout */}
            {open && (
                <div className="absolute top-full left-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 w-72">

                    {/* Month/Year nav */}
                    <div className="flex items-center justify-between mb-3">
                        <button
                            type="button"
                            onClick={() => { const s = shiftMonth(currentYear, currentMonth, -1); setCurrentYear(s.year); setCurrentMonth(s.month) }}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                            {nepaliMonths[currentMonth - 1]} {currentYear}
                        </span>
                        <button
                            type="button"
                            onClick={() => { const s = shiftMonth(currentYear, currentMonth, 1); setCurrentYear(s.year); setCurrentMonth(s.month) }}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        >
                            <ChevronRight size={18} />
                        </button>
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
                  text-center text-xs rounded-lg py-1.5 transition-all
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
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedBS(null)
                                    setDisplayValue('')
                                    form.setValue(name, '' as never)
                                    onChangeSelectedDate?.('')
                                }}
                                className="text-red-400 hover:text-red-500 text-[10px]"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}