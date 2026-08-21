"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { ListChecks, LogOut, Plus } from "lucide-react";
import { AuthContext } from "@/context/auth/AuthContext";
import { SectionLink } from "../components/SectionLink";
import { useLanguage } from "../context/LanguageContext";

export default function MorePage() {
    const router = useRouter();
    const { updateUserDetails } = useContext(AuthContext);
    const { t } = useLanguage();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userDetails");
        updateUserDetails(null);
        router.replace("/elitekhaneypani/auth/login");
    };

    return (
        <div className="p-4 pb-24 space-y-6">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{t("more.title")}</h1>

            <section className="space-y-3">
                <SectionLink
                    href="/elitekhaneypani/households"
                    label={t("more.manageHouseholds")}
                    description={t("more.manageHouseholdsDesc")}
                    icon={ListChecks}
                />
                <SectionLink
                    href="/elitekhaneypani/households/add"
                    label={t("more.addHousehold")}
                    description={t("more.addHouseholdDesc")}
                    icon={Plus}
                />
            </section>

            <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-[#2a2b2e] p-4 text-red-600 dark:text-red-400"
            >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950">
                    <LogOut size={20} />
                </div>
                <span className="font-medium">{t("more.logOut")}</span>
            </button>
        </div>
    );
}
