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
import { useGetConsumerStatement } from '../hooks'
import { useState } from 'react'


interface ConsumerStatementModalProps {
    houseHoldId: string | null
    open: boolean
    onClose: () => void
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount || 0)
}

const formatDate = (date: string | null | undefined) => {
    if (!date) return '-'

    // Your API currently returns Nepali/Bikram Sambat
    // dates such as 2083-04-21.
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split('-')

        return `${year}-${month}-${day}`
    }

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

const isPayment = (transactionType: string) => {
    return transactionType
        ?.toLowerCase()
        .includes('payment')
}





const ConsumerStatementModal = ({
    houseHoldId,
    open,
    onClose,
}: ConsumerStatementModalProps) => {
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetConsumerStatement(
        houseHoldId ?? undefined
    )

    if (!open) {
        return null
    }

    const handlePrint = () => {
        window.print()
    }

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
                id="consumer-statement-modal"
                className="flex max-h-[96vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#202124]"
            >

                <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3.5 dark:border-gray-700 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                            <FileText size={20} />
                        </div>

                        <div>
                            <h2 className="text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                                Consumer Statement
                            </h2>

                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Water billing and payment statement
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {data && (
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


                <div className="min-h-0 flex-1 overflow-y-auto">
                    {isLoading && (
                        <div className="flex min-h-[450px] items-center justify-center">
                            <div className="flex flex-col items-center">
                                <Loader2
                                    size={34}
                                    className="animate-spin text-emerald-600"
                                />

                                <p className="mt-3 text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Loading consumer statement...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ERROR */}

                    {isError && !isLoading && (
                        <div className="flex min-h-[450px] items-center justify-center p-6">
                            <div className="text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                    <AlertCircle size={26} />
                                </div>

                                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                                    Unable to load statement
                                </h3>

                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Something went wrong while
                                    loading this consumer statement.
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

                    {/* DATA */}

                    {data && !isLoading && !isError && (
                        <div className="p-4 sm:p-6">


                            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-[#292a2e] sm:p-5">
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                                            <User size={23} />
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                {data.consumerName}
                                            </h3>

                                            <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 text-xs sm:grid-cols-2 lg:grid-cols-3">
                                                <div className="flex items-center gap-2">


                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Consumer ID:
                                                    </span>

                                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {data.consumerId}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">


                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Meter:
                                                    </span>

                                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {data.meterNumber}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">


                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Household:
                                                    </span>

                                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {data.houseHoldId}
                                                    </span>
                                                </div>
                                            </div>


                                            <div className="mt-2 text-xs">
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    Address:
                                                </span>

                                                <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                                                    -
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {/* TOTAL BILLED */}

                                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#292a2e]">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                Total Billed
                                            </p>

                                            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                                                {formatCurrency(
                                                    data.totalBilled
                                                )}
                                            </p>
                                        </div>


                                    </div>
                                </div>

                                {/* TOTAL PAID */}

                                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#292a2e]">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                Total Paid
                                            </p>

                                            <p className="mt-2 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(
                                                    data.totalPaid
                                                )}
                                            </p>
                                        </div>


                                    </div>
                                </div>

                                {/* OUTSTANDING */}

                                <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-500/5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                                                Current Outstanding
                                            </p>

                                            <p className="mt-2 text-xl font-bold text-red-700 dark:text-red-400">
                                                {formatCurrency(
                                                    data.outStandingAmount
                                                )}
                                            </p>
                                        </div>


                                    </div>
                                </div>
                            </div>

                            {/* =================================================
                                STATEMENT HEADER
                            ================================================= */}

                            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                        Account Statement
                                    </h3>

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Complete billing and payment
                                        transaction history
                                    </p>
                                </div>

                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {data.transactions?.length ?? 0}{' '}
                                    transaction
                                    {(data.transactions?.length ?? 0) !==
                                        1
                                        ? 's'
                                        : ''}
                                </div>
                            </div>

                            {/* =================================================
                                DESKTOP TABLE
                            ================================================= */}

                            <div className="mt-3 hidden overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 md:block">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[900px]">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-[#292a2e]">
                                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                                                    Date
                                                </th>

                                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                                                    Reference
                                                </th>

                                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                                                    Bill / Payment
                                                </th>

                                                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500">
                                                    Description
                                                </th>

                                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                                                    Debit
                                                </th>

                                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                                                    Credit
                                                </th>

                                                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                                                    Balance
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {data.transactions &&
                                                data.transactions.length >
                                                0 ? (
                                                data.transactions.map(
                                                    (
                                                        transaction: any,
                                                        index: number
                                                    ) => {
                                                        const payment =
                                                            isPayment(
                                                                transaction.transactionType
                                                            )

                                                        return (
                                                            <tr
                                                                key={`${transaction.referenceNumber}-${index}`}
                                                                className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-gray-700/70 dark:hover:bg-[#292a2e]"
                                                            >
                                                                {/* DATE */}

                                                                <td className="whitespace-nowrap px-4 py-4">
                                                                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">


                                                                        {formatDate(
                                                                            transaction.date
                                                                        )}
                                                                    </div>
                                                                </td>

                                                                {/* REFERENCE */}

                                                                <td className="whitespace-nowrap px-4 py-4">
                                                                    <span className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                                        {
                                                                            transaction.referenceNumber
                                                                        }
                                                                    </span>
                                                                </td>

                                                                {/* TYPE */}

                                                                <td className="px-4 py-4">
                                                                    <span
                                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${payment
                                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                                            : 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                                                                            }`}
                                                                    >
                                                                        {
                                                                            transaction.transactionType
                                                                        }
                                                                    </span>
                                                                </td>

                                                                {/* DESCRIPTION */}

                                                                <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                                                                    {
                                                                        transaction.description
                                                                    }
                                                                </td>

                                                                {/* DEBIT */}

                                                                <td className="px-4 py-4 text-right text-sm font-semibold text-red-600 dark:text-red-400">
                                                                    {transaction.debit >
                                                                        0
                                                                        ? formatCurrency(
                                                                            transaction.debit
                                                                        )
                                                                        : '-'}
                                                                </td>

                                                                {/* CREDIT */}

                                                                <td className="px-4 py-4 text-right text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                                    {transaction.credit >
                                                                        0
                                                                        ? formatCurrency(
                                                                            transaction.credit
                                                                        )
                                                                        : '-'}
                                                                </td>

                                                                {/* BALANCE */}

                                                                <td className="px-4 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                                                                    {formatCurrency(
                                                                        transaction.balance
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                )
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
                                                            No transactions
                                                            found
                                                        </p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>



                            <div className="mt-3 space-y-3 md:hidden">
                                {data.transactions &&
                                    data.transactions.length > 0 ? (
                                    data.transactions.map(
                                        (
                                            transaction: any,
                                            index: number
                                        ) => {
                                            const payment =
                                                isPayment(
                                                    transaction.transactionType
                                                )

                                            return (
                                                <div
                                                    key={`${transaction.referenceNumber}-${index}`}
                                                    className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-[#292a2e]"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <CalendarDays
                                                                    size={
                                                                        14
                                                                    }
                                                                    className="text-gray-400"
                                                                />

                                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {formatDate(
                                                                        transaction.date
                                                                    )}
                                                                </span>
                                                            </div>

                                                            <h4 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                                                                {
                                                                    transaction.description
                                                                }
                                                            </h4>

                                                            <p className="mt-1 font-mono text-[10px] text-gray-400">
                                                                {
                                                                    transaction.referenceNumber
                                                                }
                                                            </p>
                                                        </div>

                                                        <span
                                                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${payment
                                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                                : 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
                                                                }`}
                                                        >
                                                            {
                                                                transaction.transactionType
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                                                        <div>
                                                            <p className="text-[10px] font-semibold uppercase text-gray-400">
                                                                Debit
                                                            </p>

                                                            <p className="mt-1 text-xs font-bold text-red-600 dark:text-red-400">
                                                                {formatCurrency(
                                                                    transaction.debit
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-[10px] font-semibold uppercase text-gray-400">
                                                                Credit
                                                            </p>

                                                            <p className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                                {formatCurrency(
                                                                    transaction.credit
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-[10px] font-semibold uppercase text-gray-400">
                                                                Balance
                                                            </p>

                                                            <p className="mt-1 text-xs font-bold text-gray-900 dark:text-white">
                                                                {formatCurrency(
                                                                    transaction.balance
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    )
                                ) : (
                                    <div className="rounded-xl border border-gray-200 p-10 text-center dark:border-gray-700">
                                        <FileText
                                            size={28}
                                            className="mx-auto text-gray-300"
                                        />

                                        <p className="mt-3 text-sm text-gray-500">
                                            No transactions found
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* =================================================
                                CURRENT OUTSTANDING
                            ================================================= */}

                            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-500/5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                <div className="flex items-center gap-3">


                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                                            Current Outstanding
                                        </p>

                                        <p className="mt-0.5 text-xs text-red-600/70 dark:text-red-400/70">
                                            Amount currently due
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xl font-bold text-red-700 dark:text-red-400 sm:text-2xl">
                                    {formatCurrency(
                                        data.outStandingAmount
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* =========================================================
                    FOOTER
                ========================================================= */}

                <div className="flex shrink-0 items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700 sm:px-6">
                    <p className="hidden text-xs text-gray-400 sm:block">
                        Consumer Statement
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

                    #consumer-statement-modal,
                    #consumer-statement-modal * {
                        visibility: visible;
                    }

                    #consumer-statement-modal {
                        position: absolute;
                        inset: 0;
                        width: 100%;
                        max-width: none;
                        max-height: none;
                        overflow: visible;
                        border-radius: 0;
                        box-shadow: none;
                    }

                    #consumer-statement-modal
                        button {
                        display: none !important;
                    }

                    #consumer-statement-modal
                        .overflow-y-auto {
                        overflow: visible !important;
                    }

                    #consumer-statement-modal
                        .md\\:block {
                        display: block !important;
                    }

                    #consumer-statement-modal
                        .md\\:hidden {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    )
}

export default ConsumerStatementModal