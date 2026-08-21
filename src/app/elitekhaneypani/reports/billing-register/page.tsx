"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MobilePageHeader } from "../../components/MobilePageHeader";
import { MobilePagination } from "../../components/MobilePagination";
import { formatBillStatus, formatCurrency, formatDate } from "../../utils/format";
import { useGetBillingRegister } from "../hooks/useReports";

const PAGE_SIZE = 10;

export default function BillingRegisterPage() {
    const [search, setSearch] = useState("");
    const [pageIndex, setPageIndex] = useState(1);

    const query = useMemo(() => {
        const params = [
            `pageSize=${PAGE_SIZE}`,
            `pageIndex=${pageIndex}`,
            `isPagination=true`,
            search ? `name=${encodeURIComponent(search)}` : null,
        ]
            .filter(Boolean)
            .join("&");
        return `?${params}`;
    }, [pageIndex, search]);

    const { data, isLoading, error } = useGetBillingRegister(query);
    const bills = data?.Items ?? [];
    const lastPage = data?.LastPage ?? 1;

    return (
        <div className="p-4 pb-24 space-y-4">
            <MobilePageHeader title="Billing Register" />

            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => {
                        setPageIndex(1);
                        setSearch(e.target.value);
                    }}
                    placeholder="Search by consumer name..."
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-white outline-none focus:border-[#4788CD]"
                />
            </div>

            {isLoading && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4 text-sm text-gray-400">
                    Loading bills…
                </div>
            )}

            {error && (
                <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-4 text-sm text-red-600 dark:text-red-300">
                    Failed to load billing register. Please try again later.
                </div>
            )}

            {!isLoading && !error && bills.length === 0 && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4 text-sm text-gray-400">
                    No bills found.
                </div>
            )}

            {!isLoading && !error && bills.length > 0 && (
                <div className="space-y-3">
                    {bills.map((bill) => (
                        <div
                            key={bill.billingId}
                            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{bill.consumerName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">#{bill.billNumber} · Meter {bill.meterNumber}</p>
                                </div>
                                <span className="rounded-full bg-blue-50 dark:bg-blue-950 px-2 py-1 text-xs font-medium text-[#035BBA]">
                                    {formatBillStatus(bill.billStatus)}
                                </span>
                            </div>
                            <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>Total: {formatCurrency(bill.totalAmount)}</span>
                                <span>Paid: {formatCurrency(bill.paidAmount)}</span>
                                <span>Due: {formatCurrency(bill.outstandingAmount)}</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-400">{formatDate(bill.billDate)}</p>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && !error && bills.length > 0 && (
                <MobilePagination pageIndex={pageIndex} lastPage={lastPage} onChange={setPageIndex} />
            )}
        </div>
    );
}
