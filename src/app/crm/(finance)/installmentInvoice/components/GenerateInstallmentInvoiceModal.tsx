"use client";

import { useEffect, useState } from 'react';
import { api } from '@/utils/instance';
import { Eye, X } from 'lucide-react';
import { GenerateInstallmentInvoiceResponse } from '../types/IInstallmentInvoice';
import { useSchoolById } from '../../invoice/hooks';
import { InstallmentInvoiceDetailModal } from './InstallmentInvoiceDetailsModal';

interface GenerateInstallmentInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    InvoiceId: string | null;
    SchoolId: string | null;
}

export const GenerateInstallmentInvoiceModal = ({
    isOpen,
    onClose,
    InvoiceId,
    SchoolId
}: GenerateInstallmentInvoiceModalProps) => {
    const [detail, setDetail] = useState<GenerateInstallmentInvoiceResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);



    const [showInstallmentInvoiceDetailModal, setShowInstallmentInvoiceDetailModal] = useState(false);
    const [selectedInstallmentInvoiceId, setSelectedInstallmentInvoiceId] = useState<string | null>(null);


    const { data: school, isLoading } = useSchoolById(SchoolId);

    const invoiceStatusType = [
        { id: 1, name: 'Draft' },
        { id: 2, name: 'Issued' },
        { id: 3, name: 'PartiallyPaid' },
        { id: 4, name: 'Paid' },
        { id: 5, name: 'Cancelled' }
    ];



    useEffect(() => {
        if (!isOpen || !InvoiceId) return;

        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                setDetail(null);

                const response = await api.get<GenerateInstallmentInvoiceResponse>(
                    `/api/CrmFinance/Invoice/${InvoiceId}`
                );

                setDetail(response.data);
            } catch (err) {
                console.error('Error fetching details:', err);
                setError('Failed to load details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [isOpen, InvoiceId]);

    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
    };


    return (
        <>



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

                        {/* ================= HEADER ================= */}
                        <div className="flex items-center justify-between gap-4 mb-6">

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
                                    {detail?.issueDate ? detail.issueDate.split("T")[0] : ""}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {detail?.issueDate
                                        ? new Date(detail.issueDate).toLocaleDateString("en-US", {
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

                        <hr className="border-dashed border-gray-300 my-5" />

                        {/* ================= BILLING ================= */}

                        <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">

                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase text-gray-600">
                                    Billing Information
                                </span>

                                <span className="text-xs font-semibold text-green-600">
                                    {
                                        invoiceStatusType.find(
                                            (i) => i.id === detail?.invoiceStatus)
                                            ?.name
                                    }
                                </span>
                            </div>


                            <div className="flex items-center justify-between mt-3">

                                <div>
                                    <p className="text-xs text-gray-600">Phone</p>
                                    <p className="text-sm font-semibold text-gray-900">{detail?.phoneNumber}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-600">Invoice No</p>
                                    <p className="text-sm font-semibold text-gray-900">{detail?.invoiceNumber}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-600">Applicant</p>
                                    <p className="text-sm font-semibold text-gray-900">{detail?.applicantName}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-600">GeneratedBy</p>
                                    <p className="text-sm font-semibold text-gray-900">Staff #01</p>
                                </div>

                            </div>
                        </div>

                        <hr className="border-dashed border-gray-300 my-5" />

                        {/* ================= COLUMN HEADER ================= */}
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


                        <hr className="border-dashed border-gray-300 my-5" />

                        {/* ================= SUMMARY ================= */}
                        <div className="flex justify-between text-sm py-1">
                            <span className="text-gray-700 font-medium">Total Amount</span>
                            <span className="text-gray-900 font-semibold">Rs.{detail?.totalAmount}</span>
                        </div>

                        <div className="flex justify-between text-sm py-1">
                            <span className="text-gray-700 font-medium">Paid Amount</span>
                            <span className="text-green-600 font-semibold">Rs.{detail?.paidAmount ?? 0}</span>
                        </div>

                        <hr className="border-gray-200 my-3" />

                        <div className="flex justify-between items-baseline">
                            <span className="text-sm font-bold text-gray-900 uppercase">
                                Remaining
                            </span>
                            <span className="text-2xl font-bold text-red-600">
                                Rs. {((detail?.totalAmount ?? 0) - (detail?.paidAmount ?? 0)).toLocaleString()}
                            </span>
                        </div>




                        <hr className="border-dashed border-gray-300 my-5" />

                        {/* ================= FOOTER ================= */}
                        <div className="mt-6 border-t border-dashed border-gray-300 pt-4">

                            {/* ================= QR + PAYABLE ================= */}
                            <div className="flex items-center justify-between gap-4">

                                {/* QR Code */}
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 border border-gray-300 rounded-md overflow-hidden bg-white">
                                        <img
                                            src="https://tse1.mm.bing.net/th/id/OIP.TrZAcqeXKtaRJHxTJkTJxwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                                            alt="Payment QR"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1">Scan to Pay</p>
                                </div>

                                {/* Payable To */}
                                <div className="flex-1 text-right">
                                    <p className="text-[11px] text-gray-500 uppercase tracking-wider">
                                        Payable To
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {school?.name}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {school?.address}
                                    </p>
                                </div>

                            </div>

                            {/* ================= TERMS ================= */}
                            <div className="mt-4 border-t border-gray-200 pt-3">
                                <p className="text-[11px] font-semibold text-gray-700 uppercase">
                                    Terms & Conditions
                                </p>
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                    Payment must be completed within <span className="font-semibold text-gray-900">15 days</span> from the invoice date.
                                    Late payments may be subject to penalties or service restrictions.
                                </p>
                            </div>

                            {/* ================= THANK YOU ================= */}
                            <div className="text-center mt-4">
                                <p className="text-xs text-gray-600 font-medium">
                                    Thank you!
                                </p>
                            </div>

                        </div>
                        {/* ================= BUTTONS ================= */}
                        <div className="flex gap-2 mt-6 no-print">

                            <button
                                onClick={() => {
                                    setSelectedInstallmentInvoiceId(detail?.id ?? null);
                                    setShowInstallmentInvoiceDetailModal(true);
                                }}
                                className="flex-1 text-sm font-semibold px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                            >
                                👁 View Details
                            </button>


                            <button
                                onClick={onClose}
                                className="flex-1 text-sm font-medium px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
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



            <InstallmentInvoiceDetailModal
                isOpen={showInstallmentInvoiceDetailModal}
                onClose={() => { setShowInstallmentInvoiceDetailModal(false); setSelectedInstallmentInvoiceId(null) }}
                InvoiceId={selectedInstallmentInvoiceId}
            />
        </>

    );
};