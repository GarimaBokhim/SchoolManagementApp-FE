"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Receipt, Search, UserRound, Wallet } from "lucide-react";
import { MobilePageHeader } from "../../components/MobilePageHeader";
import { StatCard } from "../../components/StatCard";
import { formatCurrency, formatDate } from "../../utils/format";
import { useGetHouseholds } from "../../households/hooks/useHouseholds";
import { useGetConsumerStatement } from "../hooks/useReports";

export default function CustomerStatementPage() {
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const query = useMemo(() => {
        const params = [
            `pageSize=10`,
            `pageIndex=1`,
            `isPagination=true`,
            search ? `name=${encodeURIComponent(search)}` : null,
        ]
            .filter(Boolean)
            .join("&");
        return `?${params}`;
    }, [search]);

    const { data: householdsData, isLoading: isLoadingHouseholds } = useGetHouseholds(query);
    const households = householdsData?.Items ?? [];

    const { data: statement, isLoading: isLoadingStatement } = useGetConsumerStatement(selectedId ?? undefined);

    if (selectedId) {
        return (
            <div className="p-4 pb-24 space-y-4">
                <MobilePageHeader title="Customer Statement" action={
                    <button
                        type="button"
                        onClick={() => setSelectedId(null)}
                        className="text-xs font-medium text-[#035BBA] hover:underline"
                    >
                        Change customer
                    </button>
                } />

                {isLoadingStatement && (
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4 text-sm text-gray-400">
                        Loading statement…
                    </div>
                )}

                {!isLoadingStatement && statement && (
                    <>
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4">
                            <p className="font-semibold text-gray-900 dark:text-white">{statement.consumerName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Meter {statement.meterNumber}</p>
                        </div>

                        <section className="grid grid-cols-3 gap-3">
                            <StatCard label="Billed" value={formatCurrency(statement.totalBilled)} icon={Receipt} />
                            <StatCard label="Paid" value={formatCurrency(statement.totalPaid)} icon={Wallet} />
                            <StatCard label="Outstanding" value={formatCurrency(statement.outStandingAmount)} icon={AlertCircle} />
                        </section>

                        <section className="space-y-2">
                            <h2 className="font-semibold text-gray-900 dark:text-white">Transactions</h2>
                            {(statement.transactions ?? []).length === 0 && (
                                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4 text-sm text-gray-400">
                                    No transactions found.
                                </div>
                            )}
                            {(statement.transactions ?? []).map((txn, idx) => (
                                <div
                                    key={`${txn.referenceNumber}-${idx}`}
                                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-3"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{txn.transactionType}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{txn.description || `#${txn.referenceNumber}`}</p>
                                        </div>
                                        <div className="text-right text-xs">
                                            {txn.debit > 0 && <p className="font-semibold text-red-500">-{formatCurrency(txn.debit)}</p>}
                                            {txn.credit > 0 && <p className="font-semibold text-green-600">+{formatCurrency(txn.credit)}</p>}
                                            <p className="text-gray-400">Bal: {formatCurrency(txn.balance)}</p>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-400">{formatDate(txn.date)}</p>
                                </div>
                            ))}
                        </section>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="p-4 pb-24 space-y-4">
            <MobilePageHeader title="Customer Statement" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Select a customer to view their full statement.</p>

            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customers by name..."
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-white outline-none focus:border-[#4788CD]"
                />
            </div>

            {isLoadingHouseholds && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4 text-sm text-gray-400">
                    Loading customers…
                </div>
            )}

            {!isLoadingHouseholds && households.length === 0 && (
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4 text-sm text-gray-400">
                    No customers found.
                </div>
            )}

            {!isLoadingHouseholds && households.length > 0 && (
                <div className="space-y-2">
                    {households.map((household) => (
                        <button
                            key={household.id}
                            type="button"
                            onClick={() => setSelectedId(household.id)}
                            className="flex w-full items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-3 text-left hover:border-[#4788CD]"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950 text-[#035BBA]">
                                <UserRound size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{household.consumerName}</p>
                                <p className="truncate text-xs text-gray-500 dark:text-gray-400">Meter {household.meterNumber || "N/A"}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
