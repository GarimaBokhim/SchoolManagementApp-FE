"use client";

import { ArrowDownCircle, ArrowUpCircle, Receipt } from "lucide-react";
import { SectionLink } from "../components/SectionLink";
import { StatCard } from "../components/StatCard";
import { formatCurrency } from "../utils/format";
import { useGetWaterExpenses, useGetWaterIncome, useGetWaterPayments } from "./hooks/useFinance";
import { useLanguage } from "../context/LanguageContext";

const SUMMARY_QUERY = "?pageSize=1000&pageIndex=1&isPagination=true";

export default function FinancePage() {
    const payments = useGetWaterPayments(SUMMARY_QUERY);
    const income = useGetWaterIncome(SUMMARY_QUERY);
    const expenses = useGetWaterExpenses(SUMMARY_QUERY);
    const { t } = useLanguage();

    const isLoading = payments.isLoading || income.isLoading || expenses.isLoading;

    const totalPayments = (payments.data?.Items ?? []).reduce((sum, p) => sum + (p.paidAmount || 0), 0);
    const totalIncome = (income.data?.Items ?? []).reduce((sum, i) => sum + (i.amount || 0), 0);
    const totalExpenses = (expenses.data?.Items ?? []).reduce((sum, e) => sum + (e.amount || 0), 0);

    return (
        <div className="p-4 pb-24 space-y-6">
            <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{t("finance.title")}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("finance.subtitle")}</p>
            </div>

            <section className="grid grid-cols-3 gap-3">
                <StatCard label={t("finance.collected")} value={isLoading ? "…" : formatCurrency(totalPayments)} icon={Receipt} />
                <StatCard label={t("finance.income")} value={isLoading ? "…" : formatCurrency(totalIncome)} icon={ArrowUpCircle} />
                <StatCard label={t("finance.expenses")} value={isLoading ? "…" : formatCurrency(totalExpenses)} icon={ArrowDownCircle} />
            </section>

            <section className="space-y-3">
                <SectionLink
                    href="/elitekhaneypani/finance/payments"
                    label={t("finance.payments")}
                    description={t("finance.paymentsDesc")}
                    icon={Receipt}
                />
                <SectionLink
                    href="/elitekhaneypani/finance/income"
                    label={t("finance.income")}
                    description={t("finance.incomeDesc")}
                    icon={ArrowUpCircle}
                />
                <SectionLink
                    href="/elitekhaneypani/finance/expenses"
                    label={t("finance.expenses")}
                    description={t("finance.expensesDesc")}
                    icon={ArrowDownCircle}
                />
            </section>
        </div>
    );
}
