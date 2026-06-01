"use client";

import { useEffect, useState } from "react";
import { api } from "@/utils/instance";
import { X, CircleDollarSign, WalletCards } from "lucide-react";
import { InstallmentPaymentDetailsResponse } from "../types/IInstallmentInvoice";

interface InvoiceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    InvoiceId: string | null;
}

export const InstallmentInvoiceDetailModal = ({
    isOpen,
    onClose,
    InvoiceId,
}: InvoiceDetailModalProps) => {
    const [detail, setDetail] =
        useState<InstallmentPaymentDetailsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !InvoiceId) return;

        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                setDetail(null);

                const response = await api.get(
                    `/api/CrmFinance/InstallmentPaymentDetails?invoiceid=${InvoiceId}`
                );

                const data: InstallmentPaymentDetailsResponse =
                    response.data?.Data?.Items?.[0];

                setDetail(data ?? null);
            } catch (err) {
                console.error(err);
                setError("Failed to load invoice details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [isOpen, InvoiceId]);

    if (!isOpen) return null;

    const totalRows = detail?.numberOfInstallments ?? 0;
    const payments = detail?.installmentPayments ?? [];
    const rows = Array.from({ length: totalRows }, (_, i) => payments[i] ?? null);

    const totalPaid = payments.reduce((sum, p) => sum + (p?.paidAmount ?? 0), 0);
    const lastRemaining = payments.at(-1)?.remaingAmount ?? detail?.totalAmount ?? 0;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
            bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
            onClick={onClose}
        >
            <div
                className="print-area bg-white dark:bg-[#27272a]
                w-full max-w-[95vw] md:max-w-[75vw] lg:max-w-[60vw]
                max-h-[95vh] md:max-h-[92vh]
                rounded-xl overflow-auto shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >

                {/* ── Header ── */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#27272a]">
                    <div>
                        <h2 className="text-[20px] text-base font-bold text-gray-900 dark:text-white">
                            Installment Details
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Payment breakdown
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="px-6 py-5 flex flex-col gap-4">

                    {loading && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                            Loading...
                        </p>
                    )}

                    {error && (
                        <p className="text-sm text-red-600 dark:text-red-400 text-center py-8">
                            {error}
                        </p>
                    )}

                    {detail && (
                        <>
                            {/* ── Summary Strip ── */}
                            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg px-5 py-3.5">

                                {/* Total Amount */}
                                <div className="flex items-center gap-2.5">
                                    <CircleDollarSign
                                        size={16}
                                        className="text-gray-500 dark:text-gray-400"
                                    />
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[12px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
                                            Total Amount
                                        </span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            Rs. {detail.totalAmount?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="w-px h-7 bg-gray-300 dark:bg-gray-600" />

                                {/* Installments */}
                                <div className="flex items-center gap-2.5">
                                    <WalletCards
                                        size={16}
                                        className="text-gray-500 dark:text-gray-400"
                                    />
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[12px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
                                            Installments
                                        </span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            {payments.length} / {detail.numberOfInstallments} paid
                                        </span>
                                    </div>
                                </div>

                                <div className="w-px h-7 bg-gray-300 dark:bg-gray-600" />

                                {/* Total Paid */}
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[12px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
                                        Total Paid
                                    </span>
                                    <span className="text-sm font-bold text-green-600 dark:text-green-500">
                                        Rs. {totalPaid.toLocaleString()}
                                    </span>
                                </div>

                                <div className="w-px h-7 bg-gray-300 dark:bg-gray-600" />

                                {/* Remaining */}
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[12px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
                                        Remaining
                                    </span>
                                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                                        Rs. {lastRemaining?.toLocaleString()}
                                    </span>
                                </div>

                                {/* Push Base Amount to far right */}
                                <div className="ml-auto flex items-center gap-2.5 border-l border-gray-300 dark:border-gray-600 pl-4">
                                    <CircleDollarSign
                                        size={16}
                                        className="text-blue-500 dark:text-blue-400"
                                    />
                                    <div className="flex flex-col gap-0.5 text-right">
                                        <span className="text-[12px] uppercase tracking-wider font-medium text-gray-500 dark:text-gray-400">
                                            Base Amount
                                        </span>
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                            Rs. {detail.baseAmount?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                            </div>

                            {/* ── Table ── */}
                            <div className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                <table className="w-full">

                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                                            <th className="text-left text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold px-4 py-3 w-10">
                                                #
                                            </th>
                                            <th className="text-left text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold px-4 py-3">
                                                Date
                                            </th>
                                            <th className="text-left text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold px-4 py-3">
                                                Method
                                            </th>
                                            <th className="text-right text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold px-4 py-3">
                                                Paid
                                            </th>
                                            <th className="text-right text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold px-4 py-3">
                                                Remaining
                                            </th>
                                            <th className="text-center text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-semibold px-4 py-3">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {rows.map((p, index) => (
                                            <tr
                                                key={index}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                                            >
                                                {/* # */}
                                                <td className="px-4 py-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                    {index + 1}
                                                </td>

                                                {/* Date */}
                                                <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                                                    {p?.paymentDate
                                                        ? p.paymentDate.split(" ")[0]
                                                        : <span className="text-gray-400 dark:text-gray-600">—</span>
                                                    }

                                                </td>

                                                {/* Method */}
                                                <td className="px-4 py-3">
                                                    {p?.paymentMethod ? (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                                                            {p.paymentMethod}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 dark:text-gray-600">—</span>
                                                    )}
                                                </td>

                                                {/* Paid */}
                                                <td className="px-4 py-3 text-right">
                                                    {p?.paidAmount != null ? (
                                                        <span className="text-sm font-bold text-green-600 dark:text-green-500">
                                                            Rs. {p.paidAmount.toLocaleString()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 dark:text-gray-600">—</span>
                                                    )}
                                                </td>

                                                {/* Remaining */}
                                                <td className="px-4 py-3 text-right">
                                                    {p?.remaingAmount != null ? (
                                                        <span className="text-sm font-bold text-red-600 dark:text-red-400">
                                                            Rs. {p.remaingAmount.toLocaleString()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 dark:text-gray-600">—</span>
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 py-3 text-center">
                                                    {p ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 inline-block" />
                                                            Paid
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 inline-block" />
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>

                                    {/* Footer */}
                                    <tfoot>
                                        <tr className="border-t-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/60">
                                            <td colSpan={3} className="px-4 py-3 text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400 font-bold">
                                                Total
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm font-bold text-green-700 dark:text-green-500">
                                                Rs. {totalPaid.toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm font-bold text-red-600 dark:text-red-400">
                                                Rs. {lastRemaining?.toLocaleString()}
                                            </td>
                                            <td />
                                        </tr>
                                    </tfoot>

                                </table>
                            </div>

                        </>
                    )}

                    <div className="flex gap-2 mt-6 no-print">


                        <button
                            onClick={onClose}
                            className="flex-1 text-sm font-medium px-3 py-2 rounded-lg border border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600"
                        >
                            ✕ Close
                        </button>

                        <button
                            onClick={handlePrint}
                            className="flex-1 text-sm font-semibold px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
                        >
                            🖨 Print Receipt
                        </button>

                    </div>
                </div>





            </div>
        </div>
    );
};