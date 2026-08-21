"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Search } from "lucide-react";
import { MobilePageHeader } from "../../components/MobilePageHeader";
import { MobilePagination } from "../../components/MobilePagination";
import { StatCard } from "../../components/StatCard";
import { formatCurrency, formatDate } from "../../utils/format";
import { useGetDueReports } from "../hooks/useReports";

const PAGE_SIZE = 10;

const getDueDaysClass = (days: number | null | undefined) => {
    if (days === null || days === undefined) return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
    if (days > 60) return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    if (days > 30) return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
};

export default function DueReportsPage() {
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

    const { data, isLoading, error } = useGetDueReports(query);
    const dueItems = data?.dueReports?.Items ?? [];
    const lastPage = data?.dueReports?.LastPage ?? 1;

    return (
        <div className="p-4 pb-24 space-y-4">
            <MobilePageHeader title="Due Reports" />

            <section className="grid grid-cols-3 gap-3">
                <StatCard label="Outstanding" value={isLoading ? "…" : formatCurrency(data?.totalOutsandingAMount)} icon={AlertCircle} />
                <StatCard label="Customers" value={isLoading ? "…" : data?.totalConsumer ?? 0} icon={AlertCircle} />
                <StatCard label="Due Bills" value={isLoading ? "…" : data?.totalOutStandingBillCount ?? 0} icon={AlertCircle} />
            </section>

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
                    Loading due reports…
                </div>
            )}

            {error && (
                <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-4 text-sm text-red-600 dark:text-red-300">
                    Failed to load due reports. Please try again later.
                </div>
            )}

            {!isLoading && !error && dueItems.length === 0 && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4 text-sm text-gray-400">
                    No outstanding dues found.
                </div>
            )}

            {!isLoading && !error && dueItems.length > 0 && (
                <div className="space-y-3">
                    {dueItems.map((item) => (
                        <div
                            key={item.houseHoldsId}
                            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{item.consumerName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Meter {item.meterNumber}</p>
                                </div>
                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${getDueDaysClass(item.oldersDueDays)}`}>
                                    {item.oldersDueDays ?? 0} days
                                </span>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                <span>{item.outStandingBillCount} bill(s) due</span>
                                <span className="font-semibold text-red-500">{formatCurrency(item.outStandingBillAmount)}</span>
                            </div>
                            <p className="mt-1 text-xs text-gray-400">Oldest bill: {formatDate(item.olderstBillDate)}</p>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && !error && dueItems.length > 0 && (
                <MobilePagination pageIndex={pageIndex} lastPage={lastPage} onChange={setPageIndex} />
            )}
        </div>
    );
}
