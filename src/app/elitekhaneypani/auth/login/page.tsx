"use client";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Toast } from "@/components/Toast/toast";
import { AuthContext } from "@/context/auth/AuthContext";
import { NormalizeStringCase } from "@/components/helpers/normalizeStringCase";
import {
    ITokenPayload,
    ITokenPayloadObject,
} from "@/app/auth/login/types/loginResponse";
import { IUserRole } from "@/app/auth/login/types/userRoles";
import { useEliteLogin } from "../hooks/useEliteAuth";
import { IEliteLoginPayload } from "../types/auth.types";
import { useLanguage } from "../../context/LanguageContext";

export default function EliteLoginPage() {
    const form = useForm<IEliteLoginPayload>({
        defaultValues: { email: "", password: "" },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const login = useEliteLogin();
    const { updateUserDetails } = useContext(AuthContext);
    const { t } = useLanguage();
    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: { errors },
    } = form;

    const handleSubmit = async (values: IEliteLoginPayload) => {
        setIsSubmitting(true);
        try {
            const response = await login.mutateAsync(values);
            const token = response.token;
            if (!token) throw new Error("No token returned from login");

            const tokenPayload: ITokenPayload = jwtDecode(token);
            const userDetails: ITokenPayloadObject = {
                username:
                    tokenPayload[
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                    ],
                role: NormalizeStringCase(
                    tokenPayload[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                    ],
                    false
                ) as IUserRole,
                email: tokenPayload.email,
                id: tokenPayload[
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                ],
                schoolId: tokenPayload.SchoolId,
                institutionId: tokenPayload.InstitutionId,
            };

            localStorage.setItem("token", token);
            localStorage.setItem("userId", tokenPayload.sub);
            localStorage.setItem("userDetails", JSON.stringify(userDetails));
            updateUserDetails(userDetails);

            router.replace("/elitekhaneypani");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            Toast.error(
                error.response?.data?.Message || error.message || "Failed to login."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-[#035BBA] via-[#1E6FC4] to-[#4788CD]">
            <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute top-24 -left-14 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex flex-1 flex-col items-center justify-center px-8 pb-24 pt-14 text-white">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 shadow-lg ring-4 ring-white/10 backdrop-blur-sm">
                    <Image src="/assets/logo.png" alt="EliteKhaneyPani" width={56} height={56} className="rounded-2xl" />
                </div>
                <h1 className="mt-5 text-2xl font-bold tracking-tight">EliteKhaneyPani</h1>
                <p className="mt-1 text-sm text-white/75">{t("login.tagline")}</p>
            </div>

            <div className="relative -mt-16 flex-1 rounded-t-[2rem] bg-white px-6 pb-10 pt-6 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] dark:bg-[#17181a]">
                <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("login.welcomeBack")}</h2>
                <p className="mt-1 mb-7 text-sm text-gray-400 dark:text-gray-500">{t("login.subtitle")}</p>

                <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-4">
                    <div>
                        <div
                            className={`flex items-center gap-3 rounded-2xl border bg-gray-50 px-4 py-3.5 transition-colors dark:bg-[#232427] ${errors.email ? "border-red-400" : "border-transparent focus-within:border-[#035BBA]"
                                }`}
                        >
                            <Mail size={18} className="shrink-0 text-gray-400" />
                            <input
                                type="email"
                                placeholder={t("login.email")}
                                autoComplete="email"
                                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                                {...register("email", { required: true })}
                            />
                        </div>
                    </div>

                    <div>
                        <div
                            className={`flex items-center gap-3 rounded-2xl border bg-gray-50 px-4 py-3.5 transition-colors dark:bg-[#232427] ${errors.password ? "border-red-400" : "border-transparent focus-within:border-[#035BBA]"
                                }`}
                        >
                            <Lock size={18} className="shrink-0 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={t("login.password")}
                                autoComplete="current-password"
                                className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                                {...register("password", { required: true })}
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="shrink-0 text-gray-400"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#035BBA] to-[#4788CD] py-4 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-transform active:scale-[0.98] disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        ) : (
                            <>
                                {t("login.logIn")}
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t("login.noAccount")}{" "}
                    <Link
                        href="/elitekhaneypani/auth/register"
                        className="font-semibold text-[#035BBA] hover:underline"
                    >
                        {t("login.registerNow")}
                    </Link>
                </p>
            </div>
        </div>
    );
}

