"use client";

import Link from "next/link";
import {
    ArrowDownCircle,
    ArrowUpCircle,
    CalendarPlus,
    Clock,
    ListChecks,
    LineChart,
    Receipt,
    TrendingDown,
    UserPlus,
    UserRound,
    Wallet,
} from "lucide-react";
import { useGetHouseholds } from "./households/hooks/useHouseholds";
import { useGetWaterExpenses, useGetWaterIncome, useGetWaterPayments } from "./finance/hooks/useFinance";
import { useGetDueReports } from "./reports/hooks/useReports";
import { StatTile } from "./components/StatTile";
import { SectionLink } from "./components/SectionLink";
import { QuickActionButton } from "./components/QuickActionButton";
import { useLanguage } from "./context/LanguageContext";
import { ProfileCard } from "./profile/components/ProfileCard";
import { useGetSchoolProfile } from "./profile/hooks/useProfile";
import { formatCurrency } from "./utils/format";

const STATS_QUERY = "?pageSize=1000&pageIndex=1&isPagination=true";

export default function EliteKhaneyPaniHomePage() {
    const { data, isLoading } = useGetHouseholds(STATS_QUERY);
    const { t } = useLanguage();
    const { data: profile, isLoading: isProfileLoading } = useGetSchoolProfile();
    const { data: payments, isLoading: isPaymentsLoading } = useGetWaterPayments(STATS_QUERY);
    const { data: income, isLoading: isIncomeLoading } = useGetWaterIncome(STATS_QUERY);
    const { data: expenses, isLoading: isExpensesLoading } = useGetWaterExpenses(STATS_QUERY);
    const { data: dueReports, isLoading: isDueLoading } = useGetDueReports(STATS_QUERY);
    const households = data?.Items ?? [];

    const totalHouseholds = data?.TotalItems ?? households.length;
    const totalPayment = (payments?.Items ?? []).reduce((sum, p) => sum + (p.paidAmount || 0), 0);
    const totalIncome = (income?.Items ?? []).reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalExpenses = (expenses?.Items ?? []).reduce((sum, e) => sum + (e.amount || 0), 0);
    const oldDues = dueReports?.totalOutsandingAMount ?? 0;

    const now = new Date();
    const newThisMonth = households.filter((h) => {
        const registered = new Date(h.registrationDate);
        return (
            !isNaN(registered.getTime()) &&
            registered.getMonth() === now.getMonth() &&
            registered.getFullYear() === now.getFullYear()
        );
    }).length;

    const recentHouseholds = [...households]
        .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
        .slice(0, 5);

    const stats = [
        { label: t("dashboard.totalHouseholds"), value: totalHouseholds, icon: ListChecks, loading: isLoading, color: "indigo" as const },
        { label: t("dashboard.newThisMonth"), value: newThisMonth, icon: CalendarPlus, loading: isLoading, color: "teal" as const },
        { label: t("dashboard.totalPayment"), value: formatCurrency(totalPayment), icon: Receipt, loading: isPaymentsLoading, color: "blue" as const },
        { label: t("dashboard.totalIncome"), value: formatCurrency(totalIncome), icon: ArrowUpCircle, loading: isIncomeLoading, color: "green" as const },
        { label: t("dashboard.totalExpenses"), value: formatCurrency(totalExpenses), icon: TrendingDown, loading: isExpensesLoading, color: "rose" as const },
        { label: t("dashboard.oldDues"), value: formatCurrency(oldDues), icon: Clock, loading: isDueLoading, color: "amber" as const },
    ];

    return (
        <div className="p-4 pb-24 space-y-6">
            <ProfileCard profile={profile} isLoading={isProfileLoading} />

            <section className="grid grid-cols-3 gap-3">
                {stats.map(({ label, value, icon, loading, color }) => (
                    <StatTile key={label} label={label} value={value} icon={icon} loading={loading} color={color} />
                ))}
            </section>

            <section className="space-y-2">
                <h2 className="font-semibold text-gray-900 dark:text-white">{t("dashboard.quickActions")}</h2>
                <div className="grid grid-cols-4 gap-3">
                    <QuickActionButton href="/elitekhaneypani/staff/add" label={t("dashboard.addStaff")} icon={UserPlus} />
                    <QuickActionButton href="/elitekhaneypani/finance/income/add" label={t("dashboard.addIncome")} icon={ArrowUpCircle} />
                    <QuickActionButton href="/elitekhaneypani/finance/expenses/add" label={t("dashboard.addExpense")} icon={ArrowDownCircle} />
                    <QuickActionButton href="/elitekhaneypani/finance/payments/add" label={t("dashboard.addPayment")} icon={Receipt} />
                </div>
            </section>

            <section className="space-y-3">
                <SectionLink
                    href="/elitekhaneypani/customers"
                    label={t("nav.customers")}
                    description={t("dashboard.customersDesc")}
                    icon={ListChecks}
                />
                <SectionLink
                    href="/elitekhaneypani/finance"
                    label={t("nav.finance")}
                    description={t("dashboard.financeDesc")}
                    icon={Wallet}
                />
                <SectionLink
                    href="/elitekhaneypani/reports"
                    label={t("nav.reports")}
                    description={t("dashboard.reportsDesc")}
                    icon={LineChart}
                />
            </section>

            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900 dark:text-white">{t("dashboard.recentActivity")}</h2>
                    <Link href="/elitekhaneypani/households" className="text-xs font-medium text-[#035BBA] hover:underline">
                        {t("dashboard.viewAll")}
                    </Link>
                </div>

                {isLoading && (
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4 text-sm text-gray-400">
                        {t("dashboard.loadingActivity")}
                    </div>
                )}

                {!isLoading && recentHouseholds.length === 0 && (
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4 text-sm text-gray-400">
                        {t("dashboard.noHouseholds")}
                    </div>
                )}

                {!isLoading && recentHouseholds.length > 0 && (
                    <div className="space-y-2">
                        {recentHouseholds.map((household) => (
                            <div
                                key={household.id}
                                className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-3"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950 text-[#035BBA]">
                                    <UserRound size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                        {household.consumerName}
                                    </p>
                                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                        {household.tole || "-"} · Ward {household.wardNumber}
                                    </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
                                    <Clock size={12} />
                                    {new Date(household.registrationDate).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
