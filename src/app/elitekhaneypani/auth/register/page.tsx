"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, Phone, User, UserPlus } from "lucide-react";
import { Toast } from "@/components/Toast/toast";
import { useEliteRegister } from "../hooks/useEliteAuth";
import { useLanguage } from "../../context/LanguageContext";

interface EliteRegisterForm {
    username: string;
    email: string;
    contactNumber: string;
    password: string;
    confirmPassword: string;
}

export default function EliteRegisterPage() {
    const form = useForm<EliteRegisterForm>({
        defaultValues: {
            username: "",
            email: "",
            contactNumber: "",
            password: "",
            confirmPassword: "",
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const register = useEliteRegister();
    const { t } = useLanguage();
    const {
        register: registerField,
        handleSubmit: handleFormSubmit,
        formState: { errors },
    } = form;

    const handleSubmit = async (values: EliteRegisterForm) => {
        if (values.password !== values.confirmPassword) {
            Toast.error("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        try {
            await register.mutateAsync({
                username: values.username,
                email: values.email,
                contactNumber: values.contactNumber,
                password: values.password,
            });
            Toast.success("Registration successful! Please login.");
            router.replace("/elitekhaneypani/auth/login");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            Toast.error(
                error.response?.data?.Message ||
                error.message ||
                "Failed to register."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldClass = (hasError?: boolean) =>
        `flex items-center gap-3 rounded-2xl border bg-gray-50 px-4 py-3.5 transition-colors dark:bg-[#232427] ${hasError ? "border-red-400" : "border-transparent focus-within:border-[#035BBA]"
        }`;

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-[#035BBA] via-[#1E6FC4] to-[#4788CD]">
            <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute top-24 -left-14 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

            <div className="relative flex flex-col items-center px-8 pb-10 pt-14 text-white">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 shadow-lg ring-4 ring-white/10 backdrop-blur-sm">
                    <Image src="/assets/logo.png" alt="EliteKhaneyPani" width={44} height={44} className="rounded-xl" />
                </div>
                <h1 className="mt-4 text-2xl font-bold tracking-tight">{t("register.title")}</h1>
                <p className="mt-1 text-sm text-white/75">{t("register.tagline")}</p>
            </div>

            <div className="relative -mt-6 flex-1 rounded-t-[2rem] bg-white px-6 pb-10 pt-6 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] dark:bg-[#17181a]">
                <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("register.signUp")}</h2>
                <p className="mt-1 mb-6 text-sm text-gray-400 dark:text-gray-500">{t("register.subtitle")}</p>

                <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-4">
                    <div className={fieldClass(!!errors.username)}>
                        <User size={18} className="shrink-0 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t("register.fullName")}
                            autoComplete="name"
                            className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                            {...registerField("username", { required: true })}
                        />
                    </div>

                    <div className={fieldClass(!!errors.email)}>
                        <Mail size={18} className="shrink-0 text-gray-400" />
                        <input
                            type="email"
                            placeholder={t("register.email")}
                            autoComplete="email"
                            className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                            {...registerField("email", { required: true })}
                        />
                    </div>

                    <div className={fieldClass(!!errors.contactNumber)}>
                        <Phone size={18} className="shrink-0 text-gray-400" />
                        <input
                            type="tel"
                            placeholder={t("register.contactNumber")}
                            autoComplete="tel"
                            className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                            {...registerField("contactNumber", { required: true })}
                        />
                    </div>

                    <div className={fieldClass(!!errors.password)}>
                        <Lock size={18} className="shrink-0 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("register.password")}
                            autoComplete="new-password"
                            className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                            {...registerField("password", { required: true })}
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

                    <div className={fieldClass(!!errors.confirmPassword)}>
                        <Lock size={18} className="shrink-0 text-gray-400" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t("register.confirmPassword")}
                            autoComplete="new-password"
                            className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                            {...registerField("confirmPassword", { required: true })}
                        />
                        <button
                            type="button"
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="shrink-0 text-gray-400"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
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
                                {t("register.createAccount")}
                                <UserPlus size={16} />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t("register.alreadyHaveAccount")}{" "}
                    <Link
                        href="/elitekhaneypani/auth/login"
                        className="font-semibold text-[#035BBA] hover:underline"
                    >
                        {t("register.logIn")}
                    </Link>
                </p>
            </div>
        </div>
    );
}

