"use client";

import { BookOpen, CalendarClock, ReceiptText, UserSearch } from "lucide-react";
import { SectionLink } from "../components/SectionLink";
import { useLanguage } from "../context/LanguageContext";

export default function ReportsPage() {
    const { t } = useLanguage();

    return (
        <div className="p-4 pb-24 space-y-6">
            <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{t("reports.title")}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("reports.subtitle")}</p>
            </div>

            <section className="space-y-3">
                <SectionLink
                    href="/elitekhaneypani/reports/billing-register"
                    label={t("reports.billingRegister")}
                    description={t("reports.billingRegisterDesc")}
                    icon={BookOpen}
                />
                <SectionLink
                    href="/elitekhaneypani/reports/daily-collection"
                    label={t("reports.dailyCollection")}
                    description={t("reports.dailyCollectionDesc")}
                    icon={ReceiptText}
                />
                <SectionLink
                    href="/elitekhaneypani/reports/due-reports"
                    label={t("reports.dueReports")}
                    description={t("reports.dueReportsDesc")}
                    icon={CalendarClock}
                />
                <SectionLink
                    href="/elitekhaneypani/reports/customer-statement"
                    label={t("reports.customerStatement")}
                    description={t("reports.customerStatementDesc")}
                    icon={UserSearch}
                />
            </section>
        </div>
    );
}
