"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LineChart, LogOut, Moon, MoreHorizontal, Sun, UsersRound, Wallet } from "lucide-react";
import { ReactNode, useContext, useEffect, useState } from "react";
import { useTheme } from "@/context/Theme/ThemeContext";
import { AuthContext } from "@/context/auth/AuthContext";
import { InstallPwaButton } from "@/components/Pwa/InstallPwaButton";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";

export default function EliteKhaneyPaniLayout({ children }: { children: ReactNode }) {
    return (
        <LanguageProvider>
            <EliteKhaneyPaniShell>{children}</EliteKhaneyPaniShell>
        </LanguageProvider>
    );
}

function EliteKhaneyPaniShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { updateUserDetails } = useContext(AuthContext);
    const { t, lang, setLang } = useLanguage();
    const isAuthRoute = pathname.startsWith("/elitekhaneypani/auth");
    const [checkedAuth, setCheckedAuth] = useState(false);

    const navItems = [
        { href: "/elitekhaneypani", label: t("nav.home"), icon: Home },
        { href: "/elitekhaneypani/customers", label: t("nav.customers"), icon: UsersRound },
        { href: "/elitekhaneypani/finance", label: t("nav.finance"), icon: Wallet },
        { href: "/elitekhaneypani/reports", label: t("nav.reports"), icon: LineChart },
        { href: "/elitekhaneypani/more", label: t("nav.more"), icon: MoreHorizontal },
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token && !isAuthRoute) {
            router.replace("/elitekhaneypani/auth/login");
            return;
        }
        if (token && isAuthRoute) {
            router.replace("/elitekhaneypani");
            return;
        }
        setCheckedAuth(true);
    }, [isAuthRoute, pathname, router]);

    if (isAuthRoute) {
        return <>{children}</>;
    }

    if (!checkedAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1f2023]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#035BBA] border-t-transparent" />
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userDetails");
        updateUserDetails(null);
        router.replace("/elitekhaneypani/auth/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#1f2023] flex flex-col">
            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-[#1f2023]/90 backdrop-blur px-4 py-3">
                <Link href="/elitekhaneypani" className="flex items-center gap-2">
                    <Image src="/assets/logo.png" alt="EliteKhaneyPani" width={32} height={32} className="rounded" />
                    <div className="flex flex-col">
                        <span className="m-0 text-[10px] font-medium leading-none text-gray-500 dark:text-gray-400">
                            Developed by:
                        </span>
                        <span className="m-0 font-semibold leading-none text-gray-900 dark:text-white">EliteSpaceNepal</span>
                    </div>
                </Link>
                <div className="flex items-center gap-1">
                    <div className="flex items-center rounded-full border border-gray-200 dark:border-gray-700 p-0.5 text-xs font-medium">
                        <button
                            type="button"
                            onClick={() => setLang("en")}
                            className={`rounded-full px-2 py-1 transition-colors ${lang === "en" ? "bg-[#035BBA] text-white" : "text-gray-500 dark:text-gray-400"
                                }`}
                        >
                            EN
                        </button>
                        <button
                            type="button"
                            onClick={() => setLang("np")}
                            className={`rounded-full px-2 py-1 transition-colors ${lang === "np" ? "bg-[#035BBA] text-white" : "text-gray-500 dark:text-gray-400"
                                }`}
                        >
                            ने
                        </button>
                    </div>
                    <button
                        type="button"
                        aria-label="Toggle theme"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button
                        type="button"
                        aria-label="Logout"
                        onClick={handleLogout}
                        className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            <main className="flex-1">{children}</main>

            <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1f2023]">
                {navItems.map((item) => {
                    const isActive = item.href === "/elitekhaneypani" ? pathname === item.href : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${isActive ? "text-[#035BBA]" : "text-gray-500 dark:text-gray-400"
                                }`}
                        >
                            <Icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <InstallPwaButton />
        </div>
    );
}

