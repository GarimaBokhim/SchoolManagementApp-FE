'use client'

import {
    AlertCircle,
    CalendarDays,
    FileText,
    Loader2,
    Printer,
    User,
    X,
} from 'lucide-react'

import { useDueDetailsReports } from '../hooks'

/* =========================================================
   TYPES
========================================================= */

interface DueBill {
    billingId: string
    billingNumber: string
    billingDate: string
    totalAmount: number
    paidAmount: number
    outStandingAmount: number
    BillStatus: number
    DueDays: number
}

interface DueDetailsReport {
    houseHoldId: string
    consumerId: string
    consumername: string
    waterMeterNumber: string
    totalOutstanding: number
    outstandingCount: number
    bills: DueBill[]
}

interface DueDetailsModalProps {
    houseHoldId: string | null
    open: boolean
    onClose: () => void
}

/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (amount: number | null | undefined) => {
    return new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount || 0)
}

/**
 * API returns Bikram Sambat date:
 * 2083-04-21
 */
const formatDate = (date: string | null | undefined) => {
    if (!date) return '-'

    // BS date
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split('-')

        return `${year}-${month}-${day}`
    }

    // Normal ISO date fallback
    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
        return date
    }

    return parsedDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

/* =========================================================
   BILL STATUS
========================================================= */

const getBillStatus = (status: number) => {
    switch (status) {
        case 1:
            return {
                label: 'Paid',
                className:
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
            }

        case 2:
            return {
                label: 'Unpaid',
                className:
                    'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
            }

        case 3:
            return {
                label: 'Partially Paid',
                className:
                    'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400',
            }

        default:
            return {
                label: 'Unknown',
                className:
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
            }
    }
}

/* =========================================================
   DUE DAYS
========================================================= */

const getDueDaysClass = (days: number | null | undefined) => {
    if (days === null || days === undefined) {
        return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
    }

    if (days >= 60) {
        return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
    }

    if (days >= 30) {
        return 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'
    }

    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
}

/* =========================================================
   COMPONENT
========================================================= */

const DueDetailsModal = ({
    houseHoldId,
    open,
    onClose,
}: DueDetailsModalProps) => {
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useDueDetailsReports(houseHoldId ?? undefined)

    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    if (!open) {
        return null
    }

    /* =====================================================
       PRINT
    ===================================================== */

    const handlePrint = () => {
        window.print()
    }

    /* =====================================================
       DATA
    ===================================================== */

    const report = data as DueDetailsReport | undefined

    const bills = report?.bills ?? []

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-5"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose()
                }
            }}
        >
            <div
                id="due-details-modal"
                className="flex max-h-[96vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#202124]"
            >
                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3.5 dark:border-gray-700 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                            <FileText size={20} />
                        </div>

                        <div>
                            <h2 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                                Due Details
                            </h2>

                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Outstanding bills and payment details
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {report && (
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 sm:flex"
                            >
                                <Printer size={15} />
                                Print
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                            <X size={19} />
                        </button>
                    </div>
                </div>

                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <div className="min-h-0 flex-1 overflow-y-auto">
                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {isLoading && (
                        <div className="flex min-h-[450px] items-center justify-center">
                            <div className="flex flex-col items-center">
                                <Loader2
                                    size={34}
                                    className="animate-spin text-emerald-600"
                                />

                                <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Loading due details...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {isError && !isLoading && (
                        <div className="flex min-h-[450px] items-center justify-center p-6">
                            <div className="text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                    <AlertCircle size={26} />
                                </div>

                                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                                    Unable to load Due Details
                                </h3>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Something went wrong while loading the
                                    outstanding bills.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => refetch()}
                                    className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* =================================================
                        DATA
                    ================================================= */}

                    {report && !isLoading && !isError && (
                        <div className="p-4 sm:p-6">
                            {/* =================================================
                                CONSUMER INFORMATION
                            ================================================= */}

                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-[#292a2e] sm:p-5">
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                            <User size={23} />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                {report.consumername || '-'}
                                            </h3>

                                            <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
                                                {/* Consumer ID */}

                                                <div className="flex flex-col gap-1">
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Consumer ID
                                                    </span>

                                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {report.consumerId ||
                                                            '-'}
                                                    </span>
                                                </div>

                                                {/* Meter */}

                                                <div className="flex flex-col gap-1">
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Meter Number
                                                    </span>

                                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {report.waterMeterNumber ||
                                                            '-'}
                                                    </span>
                                                </div>

                                                {/* Household */}

                                                <div className="flex flex-col gap-1">
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Household ID
                                                    </span>

                                                    <span className="break-all font-semibold text-gray-800 dark:text-gray-200">
                                                        {report.houseHoldId ||
                                                            '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* =================================================
                                SUMMARY CARDS
                            ================================================= */}

                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {/* Total Outstanding */}

                                <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-500/5">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                                        Total Outstanding
                                    </p>

                                    <p className="mt-2 text-xl font-bold text-red-700 dark:text-red-400 sm:text-2xl">
                                        {formatCurrency(
                                            report.totalOutstanding
                                        )}
                                    </p>

                                    <p className="mt-1 text-xs text-red-600/70 dark:text-red-400/70">
                                        Amount currently due
                                    </p>
                                </div>

                                {/* Outstanding Count */}

                                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/40 dark:bg-orange-500/5">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-400">
                                        Outstanding Bills
                                    </p>

                                    <p className="mt-2 text-xl font-bold text-orange-700 dark:text-orange-400 sm:text-2xl">
                                        {report.outstandingCount}
                                    </p>

                                    <p className="mt-1 text-xs text-orange-600/70 dark:text-orange-400/70">
                                        Bills requiring payment
                                    </p>
                                </div>
                            </div>

                            {/* =================================================
                                BILL SECTION HEADER
                            ================================================= */}

                            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                        Outstanding Bills
                                    </h3>

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Billing and payment details
                                    </p>
                                </div>

                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {bills.length}{' '}
                                    {bills.length === 1
                                        ? 'bill'
                                        : 'bills'}
                                </div>
                            </div>

                            {/* =================================================
                                DESKTOP TABLE
                            ================================================= */}

                            <div className="mt-3 hidden overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 md:block">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[1000px]">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-[#292a2e]">
                                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                    Billing Number
                                                </th>

                                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                    Billing Date
                                                </th>

                                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                    Total Amount
                                                </th>

                                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                    Paid Amount
                                                </th>

                                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                    Outstanding
                                                </th>

                                                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                    Status
                                                </th>

                                                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                    Due Days
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {bills.length > 0 ? (
                                                bills.map((bill) => {
                                                    const status =
                                                        getBillStatus(
                                                            bill.BillStatus
                                                        )

                                                    return (
                                                        <tr
                                                            key={bill.billingId}
                                                            className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-gray-700/70 dark:hover:bg-[#292a2e]"
                                                        >
                                                            {/* Billing Number */}

                                                            <td className="whitespace-nowrap px-4 py-4">
                                                                <div className="flex items-center gap-2">
                                                                    <FileText
                                                                        size={
                                                                            15
                                                                        }
                                                                        className="text-gray-400"
                                                                    />

                                                                    <span className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                                        {
                                                                            bill.billingNumber
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            {/* Billing Date */}

                                                            <td className="whitespace-nowrap px-4 py-4">
                                                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                                    <CalendarDays
                                                                        size={
                                                                            15
                                                                        }
                                                                        className="text-gray-400"
                                                                    />

                                                                    {formatDate(
                                                                        bill.billingDate
                                                                    )}
                                                                </div>
                                                            </td>

                                                            {/* Total Amount */}

                                                            <td className="whitespace-nowrap px-4 py-4 text-right">
                                                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                                    {formatCurrency(
                                                                        bill.totalAmount
                                                                    )}
                                                                </span>
                                                            </td>

                                                            {/* Paid Amount */}

                                                            <td className="whitespace-nowrap px-4 py-4 text-right">
                                                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                                                    {formatCurrency(
                                                                        bill.paidAmount
                                                                    )}
                                                                </span>
                                                            </td>

                                                            {/* Outstanding */}

                                                            <td className="whitespace-nowrap px-4 py-4 text-right">
                                                                <span className="font-bold text-red-600 dark:text-red-400">
                                                                    {formatCurrency(
                                                                        bill.outStandingAmount
                                                                    )}
                                                                </span>
                                                            </td>

                                                            {/* Status */}

                                                            <td className="px-4 py-4 text-center">
                                                                <span
                                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                                                                >
                                                                    {
                                                                        status.label
                                                                    }
                                                                </span>
                                                            </td>

                                                            {/* Due Days */}

                                                            <td className="px-4 py-4 text-center">
                                                                <span
                                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getDueDaysClass(
                                                                        bill.DueDays
                                                                    )}`}
                                                                >
                                                                    {
                                                                        bill.DueDays
                                                                    }{' '}
                                                                    days
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={7}
                                                        className="px-4 py-16 text-center"
                                                    >
                                                        <FileText
                                                            size={28}
                                                            className="mx-auto text-gray-300"
                                                        />

                                                        <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                                                            No outstanding
                                                            bills found
                                                        </p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* =================================================
                                MOBILE BILL CARDS
                            ================================================= */}

                            <div className="mt-3 space-y-3 md:hidden">
                                {bills.length > 0 ? (
                                    bills.map((bill) => {
                                        const status =
                                            getBillStatus(
                                                bill.BillStatus
                                            )

                                        return (
                                            <div
                                                key={bill.billingId}
                                                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-[#292a2e]"
                                            >
                                                {/* Header */}

                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <FileText
                                                                size={16}
                                                                className="shrink-0 text-gray-400"
                                                            />

                                                            <p className="break-all font-mono text-xs font-bold text-gray-800 dark:text-gray-200">
                                                                {
                                                                    bill.billingNumber
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                            <CalendarDays
                                                                size={14}
                                                            />

                                                            {formatDate(
                                                                bill.billingDate
                                                            )}
                                                        </div>
                                                    </div>

                                                    <span
                                                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${status.className}`}
                                                    >
                                                        {
                                                            status.label
                                                        }
                                                    </span>
                                                </div>

                                                {/* Amounts */}

                                                <div className="mt-4 grid grid-cols-2 gap-2">
                                                    {/* Total */}

                                                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-[#202124]">
                                                        <p className="text-[10px] font-medium uppercase text-gray-500 dark:text-gray-400">
                                                            Total Amount
                                                        </p>

                                                        <p className="mt-1 text-sm font-bold text-gray-800 dark:text-gray-200">
                                                            {formatCurrency(
                                                                bill.totalAmount
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Paid */}

                                                    <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-500/5">
                                                        <p className="text-[10px] font-medium uppercase text-emerald-600 dark:text-emerald-400">
                                                            Paid Amount
                                                        </p>

                                                        <p className="mt-1 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                                            {formatCurrency(
                                                                bill.paidAmount
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Outstanding */}

                                                    <div className="rounded-lg bg-red-50 p-3 dark:bg-red-500/5">
                                                        <p className="text-[10px] font-medium uppercase text-red-600 dark:text-red-400">
                                                            Outstanding
                                                        </p>

                                                        <p className="mt-1 text-sm font-bold text-red-700 dark:text-red-400">
                                                            {formatCurrency(
                                                                bill.outStandingAmount
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* Due Days */}

                                                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-[#202124]">
                                                        <p className="text-[10px] font-medium uppercase text-gray-500 dark:text-gray-400">
                                                            Due Days
                                                        </p>

                                                        <span
                                                            className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getDueDaysClass(
                                                                bill.DueDays
                                                            )}`}
                                                        >
                                                            {bill.DueDays}{' '}
                                                            days
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="rounded-xl border border-gray-200 p-10 text-center dark:border-gray-700">
                                        <FileText
                                            size={28}
                                            className="mx-auto text-gray-300"
                                        />

                                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                            No outstanding bills found
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* =================================================
                                CURRENT OUTSTANDING
                            ================================================= */}

                            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                                        Current Outstanding
                                    </p>

                                    <p className="mt-0.5 text-xs text-red-600/70 dark:text-red-400/70">
                                        Total amount currently due
                                    </p>
                                </div>

                                <p className="text-xl font-bold text-red-700 dark:text-red-400 sm:text-2xl">
                                    {formatCurrency(
                                        report.totalOutstanding
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <div className="flex shrink-0 items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700 sm:px-6">
                    <p className="hidden text-xs text-gray-400 sm:block">
                        Due Details Report
                    </p>

                    <div className="flex w-full justify-end gap-2 sm:w-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-[#292a2e] dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* =============================================================
                PRINT STYLES
            ============================================================= */}

            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }

                    #due-details-modal,
                    #due-details-modal * {
                        visibility: visible;
                    }

                    #due-details-modal {
                        position: absolute;
                        inset: 0;
                        width: 100%;
                        max-width: none;
                        max-height: none;
                        overflow: visible;
                        border-radius: 0;
                        box-shadow: none;
                    }

                    #due-details-modal button {
                        display: none !important;
                    }

                    #due-details-modal .overflow-y-auto {
                        overflow: visible !important;
                    }

                    #due-details-modal .md\\:block {
                        display: block !important;
                    }

                    #due-details-modal .md\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    )
}

export default DueDetailsModal