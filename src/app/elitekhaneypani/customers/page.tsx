"use client";

import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { useGetHouseholds } from "../households/hooks/useHouseholds";
import { HouseholdCard } from "../households/components/HouseholdCard";
import { HouseholdListSkeleton } from "../households/components/HouseholdListSkeleton";
import { EmptyHouseholds } from "../households/components/EmptyHouseholds";
import { MobilePageHeader } from "../components/MobilePageHeader";
import { MobilePagination } from "../components/MobilePagination";

const PAGE_SIZE = 10;

export default function CustomersPage() {
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

    const { data, isLoading, error } = useGetHouseholds(query);
    const customers = data?.Items ?? [];
    const lastPage = data?.LastPage ?? 1;

    return (
        <div className="p-4 pb-24 space-y-4">
            <MobilePageHeader title="Customers" />

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Users size={16} />
                <span>{data?.TotalItems ?? 0} total customers</span>
            </div>

            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => {
                        setPageIndex(1);
                        setSearch(e.target.value);
                    }}
                    placeholder="Search customers by name..."
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-white outline-none focus:border-[#4788CD]"
                />
            </div>

            {isLoading && <HouseholdListSkeleton />}

            {error && (
                <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-4 text-sm text-red-600 dark:text-red-300">
                    Failed to load customers. Please try again later.
                </div>
            )}

            {!isLoading && !error && customers.length === 0 && <EmptyHouseholds />}

            {!isLoading && !error && customers.length > 0 && (
                <div className="space-y-3">
                    {customers.map((customer) => (
                        <HouseholdCard key={customer.id} household={customer} />
                    ))}
                </div>
            )}

            {!isLoading && !error && customers.length > 0 && (
                <MobilePagination pageIndex={pageIndex} lastPage={lastPage} onChange={setPageIndex} />
            )}
        </div>
    );
}
