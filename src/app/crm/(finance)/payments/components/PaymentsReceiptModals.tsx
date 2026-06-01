"use client";

import { useEffect, useState } from 'react';
import { api } from '@/utils/instance';
import { X, Receipt, BadgeDollarSign, CircleDollarSign, WalletCards } from 'lucide-react';
import { PaymentsReceiptDetails } from '../types/IPayments'
import { useSchoolById } from '../hooks';

interface PaymentsReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    PaymentsId: string | null;
    SchoolId: string | null
}


const InfoRow = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 mt-0.5">
            {icon}
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                {label}
            </p>
            <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">{value || 'N/A'}</div>
        </div>
    </div>
);

export const PaymentsReceiptDetailsModal = ({ isOpen, onClose, PaymentsId, SchoolId }: PaymentsReceiptModalProps) => {
    const [detail, setDetail] = useState<PaymentsReceiptDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { data: school, isLoading } = useSchoolById(SchoolId);

    useEffect(() => {
        if (!isOpen || !PaymentsId) return;

        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                setDetail(null);
                const response = await api.get<PaymentsReceiptDetails>(`/api/CrmFinance/PaymentsById/${PaymentsId}`);
                setDetail(response.data);
            } catch (err) {
                console.error('Error fetching details:', err);
                setError('Failed to load details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [isOpen, PaymentsId]);

    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
    };

    const invoiceDetails = [
        {
            id: 1,
            description: "Admission Fee",
            quantity: 1,
            amount: 5000
        },
        {
            id: 2,
            description: "Library Fee",
            quantity: 1,
            amount: 1000
        },
        {
            id: 3,
            description: "Exam Fee",
            quantity: 1,
            amount: 1500
        }
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
            onClick={onClose}
        >
            <div
                className="print-area font-mono w-full max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative bg-white border border-gray-300 rounded-xl w-full max-w-2xl mx-auto p-8 shadow-md">

                    {/* ================= COMPANY HEADER ================= */}
                    <div className="flex items-center justify-between gap-4 mb-5">

                        {/* Left — Logo + Company Info */}
                        <div className="flex items-center gap-3">

                            <div className="w-12 h-12 rounded-lg border border-gray-500 overflow-hidden bg-white flex items-center justify-center">
                                {school?.imageUrl ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/${school.imageUrl}`}
                                        alt="School Logo"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm font-bold text-gray-700">
                                        {school?.shortName?.charAt(0) ?? "S"}
                                    </span>
                                )}
                            </div>

                            <div>
                                <h1 className="text-sm font-bold uppercase text-gray-900 leading-tight">
                                    {school?.name}
                                </h1>
                                <p className="text-xs text-gray-600">
                                    {school?.address} · PAN: {school?.panNo}
                                </p>
                            </div>

                        </div>

                        <div className="text-right">
                            <span className="text-xs text-gray-600 uppercase">Date</span>
                            <p className="text-sm font-semibold text-gray-900">
                                {detail?.paymentDate ? detail.paymentDate.split("T")[0] : ""}
                            </p>
                            <p className="text-xs text-gray-600">
                                {detail?.paymentDate
                                    ? new Date(detail.paymentDate).toLocaleDateString("en-US", {
                                        weekday: "long",
                                    })
                                    : ""}
                            </p>
                        </div>

                        <div className="absolute top-1 right-1">
                            <button
                                onClick={onClose}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 shadow"
                            >
                                ✕
                            </button>
                        </div>

                    </div>

                    <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-gray-100" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                            Payment Receipt
                        </span>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {/* ================= META SECTION ================= */}
                    <div className="flex items-center justify-between gap-2 bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">

                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-gray-400">Receipt No</span>
                            <p className="text-sm font-semibold text-gray-900">{detail?.referenceNumber}</p>
                        </div>

                        <div className="w-px h-6 bg-gray-200" />

                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-gray-400">Invoice No</span>
                            <p className="text-sm font-semibold text-gray-900">{detail?.invoiceNumber}</p>
                        </div>

                        <div className="w-px h-6 bg-gray-200" />

                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-gray-400">Applicant</span>
                            <p className="text-sm font-semibold text-gray-900">{detail?.applicantName}</p>
                        </div>


                        <div className="w-px h-6 bg-gray-200" />

                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-gray-400">Generated</span>
                            <span className="text-[11px] font-semibold text-gray-800">Staff #01</span>
                        </div>

                    </div>

                    {/* ================= DIVIDER ================= */}
                    <hr className="border-dashed border-gray-300 my-5" />

                    {/* ================= COLUMN HEADERS ================= */}
                    <div className="grid grid-cols-[1fr_70px_120px_120px] text-xs font-semibold text-gray-600 uppercase mb-2">
                        <span>Description</span>
                        <span className="text-center">Qty</span>
                        <span className="text-right">Rate</span>
                        <span className="text-right">Total</span>
                    </div>

                    {/* ================= ITEMS ================= */}
                    {detail?.InvoiceItemsDTOs.map((item) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-[1fr_70px_120px_120px] items-center py-2 border-b border-gray-100 last:border-none"
                        >
                            {/* Description */}
                            <span className="text-sm text-gray-900 font-medium">
                                {item.description}
                            </span>

                            {/* Qty */}
                            <span className="text-sm text-gray-700 text-center">
                                {item.quantity}
                            </span>

                            {/* Rate */}
                            <span className="text-sm text-gray-900 text-right">
                                Rs. {item.amount.toLocaleString()}
                            </span>

                            {/* Total */}
                            <span className="text-sm font-semibold text-gray-900 text-right">
                                Rs. {(item.amount * item.quantity).toLocaleString()}
                            </span>
                        </div>
                    ))}

                    {/* ================= DIVIDER ================= */}
                    <hr className="border-dashed border-gray-300 my-5" />

                    {/* ================= SUMMARY ================= */}
                    <div className="flex justify-between py-1 text-xs">
                        <span className="text-gray-500">Total Amount</span>
                        <span className="text-gray-900 font-semibold">Rs.{detail?.totalAmount}</span>
                    </div>

                    <div className="flex justify-between py-1 text-xs">
                        <span className="text-gray-500">Paid Amount</span>
                        <span className="text-green-600 font-semibold">Rs.{detail?.amount ?? 0}</span>
                    </div>

                    <hr className="border-gray-200 my-3" />

                    <div className="flex justify-between items-baseline py-1">
                        <span className="text-xs font-semibold uppercase tracking-widest text-gray-900 font-sans">
                            Remaining
                        </span>
                        <span className="text-xl font-semibold text-red-600 font-sans">
                            Rs. {((detail?.totalAmount ?? 0) - (detail?.amount ?? 0)).toLocaleString()}
                        </span>
                    </div>

                    {/* ================= DIVIDER ================= */}
                    <hr className="border-dashed border-gray-300 my-5" />

                    {/* ================= FOOTER TEXT ================= */}
                    <div className="text-center">
                        <p className="text-[11px] text-gray-400">Thank you for your payment!</p>
                        <p className="text-[11px] text-gray-400">Please keep this receipt for your records.</p>
                    </div>

                    {/* ================= FOOTER BUTTONS ================= */}
                    <div className="flex gap-2 mt-6 no-print">

                        <button
                            onClick={onClose}
                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-sans px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            ✕ Close
                        </button>

                        <button
                            onClick={handlePrint}
                            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-sans px-3 py-2 rounded-lg bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                            🖨 Print Receipt
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
};