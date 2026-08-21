"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { useGetHouseholds } from "./hooks/useHouseholds";
import { HouseholdCard } from "./components/HouseholdCard";
import { HouseholdListSkeleton } from "./components/HouseholdListSkeleton";
import { EmptyHouseholds } from "./components/EmptyHouseholds";
import { ButtonElement } from "@/components/Buttons/ButtonElement";

const PAGE_SIZE = 10;

export default function HouseholdsPage() {
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
    const households = data?.Items ?? [];
    const lastPage = data?.LastPage ?? 1;

    return (
        <div className="p-4 pb-24 space-y-4">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Households</h1>
                <Link href="/elitekhaneypani/households/add">
                    <ButtonElement type="button" text="Add Household" icon={<Plus size={16} />} />
                </Link>
            </div>

            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => {
                        setPageIndex(1);
                        setSearch(e.target.value);
                    }}
                    placeholder="Search households by name..."
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-white outline-none focus:border-[#4788CD]"
                />
            </div>

            {isLoading && <HouseholdListSkeleton />}

            {error && (
                <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-4 text-sm text-red-600 dark:text-red-300">
                    Failed to load households. Please try again later.
                </div>
            )}

            {!isLoading && !error && households.length === 0 && <EmptyHouseholds />}

            {!isLoading && !error && households.length > 0 && (
                <div className="space-y-3">
                    {households.map((household) => (
                        <HouseholdCard key={household.id} household={household} />
                    ))}
                </div>
            )}

            {!isLoading && !error && households.length > 0 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                    <ButtonElement
                        type="button"
                        text="Previous"
                        disabled={pageIndex <= 1}
                        handleClick={() => setPageIndex((p) => Math.max(1, p - 1))}
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Page {pageIndex} of {lastPage}
                    </span>
                    <ButtonElement
                        type="button"
                        text="Next"
                        disabled={pageIndex >= lastPage}
                        handleClick={() => setPageIndex((p) => Math.min(lastPage, p + 1))}
                    />
                </div>
            )}
        </div>
    );
}
