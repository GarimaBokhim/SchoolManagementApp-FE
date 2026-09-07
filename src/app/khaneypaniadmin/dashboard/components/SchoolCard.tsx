"use client";

import { useGetSchoolById } from "@/app/admin/Setup/School/hooks";
import { LocateIcon, Mail, Phone } from "lucide-react";

type Props = {
    schoolId: string;
};

/**
 * Returns the backend root URL.
 *
 * Example:
 * https://elitespacenepal.premiumasp.net/swagger/index.html
 * becomes:
 * https://elitespacenepal.premiumasp.net
 */
const getApiBaseUrl = (): string => {
    const envBase = process.env.NEXT_PUBLIC_API_URL?.trim();

    if (!envBase) {
        return "";
    }

    try {
        const url = new URL(envBase);

        // Remove Swagger path if it exists
        url.pathname = "";
        url.search = "";
        url.hash = "";

        return url.toString().replace(/\/$/, "");
    } catch {
        return envBase
            .replace(/\/swagger\/index\.html\/?$/i, "")
            .replace(/\/+$/, "");
    }
};

const resolveImageUrl = (
    url?: string | null
): string | null => {
    if (
        !url ||
        url === "-" ||
        url === "string" ||
        url.trim() === ""
    ) {
        return null;
    }

    const value = url.trim();

    // Already an absolute URL
    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    // Remove leading slashes
    const cleanPath = value.replace(/^\/+/, "");

    const base = getApiBaseUrl();

    if (!base) {
        return `/${cleanPath}`;
    }

    return `${base}/${cleanPath}`;
};

export default function SchoolInfoCard({
    schoolId,
}: Props) {
    const {
        data: schoolData,
        isLoading,
    } = useGetSchoolById(schoolId || null);

    const logoUrl = resolveImageUrl(
        schoolData?.imageUrl
    );

    console.log("Original Image URL:", schoolData?.imageUrl);
    console.log("API Base URL:", getApiBaseUrl());
    console.log("Final Image URL:", logoUrl);

    if (isLoading) {
        return (
            <div className="relative bg-green-700 text-white rounded-lg shadow-md overflow-hidden p-6">
                <div className="flex gap-4">
                    <div className="w-20 h-20 bg-white/20 rounded-full animate-pulse flex-shrink-0" />

                    <div className="flex-1 space-y-3">
                        <div className="h-7 w-48 bg-white/20 rounded animate-pulse" />

                        <div className="space-y-2">
                            <div className="h-4 w-64 bg-white/20 rounded animate-pulse" />
                            <div className="h-4 w-56 bg-white/20 rounded animate-pulse" />
                            <div className="h-4 w-40 bg-white/20 rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-gradient-to-r from-[#1877F2] to-[#0A66FF] dark:from-[#0A0A0A] dark:to-[#111] text-white rounded-lg shadow-md overflow-hidden p-6">
            <div className="flex gap-4">
                {/* School Logo */}
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md flex-shrink-0">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt="School Logo"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                console.error(
                                    "Failed to load school logo:",
                                    logoUrl
                                );

                                e.currentTarget.style.display = "none";
                            }}
                        />
                    ) : (
                        <span className="text-sm font-bold text-gray-700">
                            {schoolData?.shortName?.charAt(0) ?? "S"}
                        </span>
                    )}
                </div>

                {/* School Information */}
                <div className="flex-1 space-y-3">
                    <h2 className="text-2xl font-bold">
                        {schoolData?.name ?? "—"}

                        <span className="text-xs font-normal pl-2">
                            (Estd 2065 BS)
                        </span>
                    </h2>

                    <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center">
                            <LocateIcon className="mr-2 shrink-0 w-4 h-4" />
                            <span>
                                {schoolData?.address ?? "—"}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <Mail className="mr-2 shrink-0 w-4 h-4" />
                            <span>
                                {schoolData?.email ?? "—"}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <Phone className="mr-2 shrink-0 w-4 h-4" />
                            <span>
                                {schoolData?.contactNumber ?? "—"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}