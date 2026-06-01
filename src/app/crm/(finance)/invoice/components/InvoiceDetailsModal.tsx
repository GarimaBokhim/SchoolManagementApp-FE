"use client";

import { useEffect, useState } from 'react';
import { api } from '@/utils/instance';
import { X, Receipt, BadgeDollarSign, CircleDollarSign, WalletCards } from 'lucide-react';
import { InvoiceDetailsResponse } from '../types/IInvoice'

interface InvoiceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    InvoiceId: string | null;
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

export const InvoiceDetailModal = ({ isOpen, onClose, InvoiceId }: InvoiceDetailModalProps) => {
    const [detail, setDetail] = useState<InvoiceDetailsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !InvoiceId) return;

        const fetchDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                setDetail(null);
                const response = await api.get<InvoiceDetailsResponse>(`/api/CrmFinance/Invoice/${InvoiceId}`);
                setDetail(response.data);
            } catch (err) {
                console.error('Error fetching Invoice details:', err);
                setError('Failed to load Invoice details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [isOpen, InvoiceId]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
            onClick={onClose}
        >
            <div
                className="bg-[#FBFBFB] dark:bg-[#27272a]
                   w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
                   max-h-[95vh] md:max-h-[92vh]
                   rounded-lg overflow-auto shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 md:px-8 py-5">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <X size={18} className="text-white" />
                    </button>

                    <div className="flex items-center gap-4">
                        {/* Avatar */}

                        <div>
                            <h2 className="text-xl font-bold text-white">{detail?.applicantName || 'Invoice Details'}</h2>
                            <p className="text-emerald-100 text-sm mt-0.5">Invoice Information</p>

                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 md:px-8 py-6">
                    {loading && (
                        <div className="flex flex-col items-center justify-center h-64 gap-3">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">Loading invoice details...</p>
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center justify-center h-64 gap-3">
                            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                                <X size={24} className="text-red-500" />
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        </div>
                    )}

                    {detail && !loading && (
                        <>
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                            <InfoRow
                                                icon={<Receipt size={16} className="text-emerald-600 dark:text-emerald-400" />}
                                                label="InvoiceNumber"
                                                value={detail.invoiceNumber}
                                            />
                                            <InfoRow
                                                icon={<BadgeDollarSign size={16} className="text-blue-600 dark:text-blue-400" />}
                                                label="Paid Amount"
                                                value={detail.paidAmount}
                                            />
                                            <InfoRow
                                                icon={<CircleDollarSign size={16} className="text-purple-600 dark:text-purple-400" />}
                                                label="Total Amount"
                                                value={detail.totalAmount}
                                            />
                                            <InfoRow
                                                icon={<WalletCards size={16} className="text-pink-600 dark:text-pink-400" />}
                                                label="Due Amount"
                                                value={detail.dueAmount}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                            <InfoRow
                                                icon={<Receipt size={16} className="text-emerald-600 dark:text-emerald-400" />}
                                                label="InvoiceNumber"
                                                value={detail.invoiceNumber}
                                            />
                                            <InfoRow
                                                icon={<BadgeDollarSign size={16} className="text-blue-600 dark:text-blue-400" />}
                                                label="Paid Amount"
                                                value={detail.paidAmount}
                                            />
                                            <InfoRow
                                                icon={<CircleDollarSign size={16} className="text-purple-600 dark:text-purple-400" />}
                                                label="Total Amount"
                                                value={detail.totalAmount}
                                            />
                                            <InfoRow
                                                icon={<WalletCards size={16} className="text-pink-600 dark:text-pink-400" />}
                                                label="Due Amount"
                                                value={detail.dueAmount}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>




                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 px-6 md:px-8 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end bg-gray-50 dark:bg-gray-800/50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};