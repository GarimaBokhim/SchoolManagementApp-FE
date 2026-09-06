"use client";
import { useGetSchoolById } from "@/app/admin/Setup/School/hooks";
import { LocateIcon, Mail, Phone, School } from "lucide-react";
import { useState } from "react";

type Props = {
    schoolId: string;
};

const getApiBaseUrl = () => {
    const envBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
    return envBase || '';
};

const resolveImageUrl = (url?: string | null): string | null => {
    if (!url || url === '-' || url === 'string' || url.trim() === '') return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    const cleanPath = url.replace(/^\/+/, '');
    const base = getApiBaseUrl();

    return base ? `${base}/${cleanPath}` : `/${cleanPath}`;
};

export default function SchoolInfoCard({ schoolId }: Props) {
    const { data: schoolData, isLoading } = useGetSchoolById(schoolId || null);

    console.log(schoolData?.imageUrl)
    const logoUrl = resolveImageUrl(schoolData?.imageUrl);
    console.log(logoUrl)
    if (isLoading) {
        return (
            <div className="relative bg-green-700  text-white rounded-lg shadow-md overflow-hidden p-6">
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
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md flex-shrink-0">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt="School Logo"
                            className="w-full h-full object-cover"
                            onError={() => setLogoError(true)}
                        />
                    ) : (
                        <span className="text-sm font-bold text-gray-700">
                            {schoolData?.shortName?.charAt(0) ?? "S"}
                        </span>
                    )}
                </div>

                {/* Right: School Name and Information Column */}
                <div className="flex-1 space-y-3">
                    {/* School Name with Estd Year */}
                    <h2 className="text-2xl font-bold">
                        {schoolData?.name ?? "—"}
                        <span className="text-xs font-normal pl-2">(Estd 2065 BS)</span>
                    </h2>

                    {/* School Information Row */}
                    <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center">
                            <LocateIcon className="mr-2 shrink-0 w-4 h-4" />
                            <span>{schoolData?.address ?? "—"}</span>
                        </div>
                        <div className="flex items-center">
                            <Mail className="mr-2 shrink-0 w-4 h-4" />
                            <span>{schoolData?.email ?? "—"}</span>
                        </div>
                        <div className="flex items-center">
                            <Phone className="mr-2 shrink-0 w-4 h-4" />
                            <span>{schoolData?.contactNumber ?? "—"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}