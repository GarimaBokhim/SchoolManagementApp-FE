"use client";
import { useGetSchoolById } from "@/app/admin/Setup/School/hooks";
import { LocateIcon, Mail, Phone, School } from "lucide-react";
import { useState } from "react";

type Props = {
  schoolId: string;
};

const resolveImageUrl = (url?: string | null): string | null => {
  if (!url || url === '-' || url === 'string' || url.trim() === '') return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://schoolapp.netraverselabs.com/${url.replace(/^\//, '')}`
}

export default function SchoolInfoCard({ schoolId }: Props) {
  const { data: schoolData, isLoading } = useGetSchoolById(schoolId || null);
  const [logoError, setLogoError] = useState(false);

  const logoUrl = resolveImageUrl(schoolData?.imageUrl);

  if (isLoading) {
    return (
      <div className="relative bg-green-700 text-white rounded-lg shadow-md overflow-hidden">
        <div className="absolute top-1/2 left-6 -translate-y-1/2">
          <div className="w-28 h-28 bg-white/20 rounded-full animate-pulse" />
        </div>
        <div className="py-4 px-8 flex flex-col items-center justify-center text-center animate-pulse">
          <div className="h-7 w-48 bg-white/20 rounded mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-64 bg-white/20 rounded" />
            <div className="h-4 w-56 bg-white/20 rounded" />
            <div className="h-4 w-40 bg-white/20 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-green-700 text-white rounded-lg shadow-md overflow-hidden">
      {/* School Logo - Left Center Circular */}
      <div className="absolute top-1/2 left-6 -translate-y-1/2">
        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md">
          {logoUrl && !logoError ? (
            <img
              src={logoUrl}
              alt="School Logo"
              className="w-full h-full object-cover"
              onError={() => setLogoError(true)}
            />
          ) : (
            <School className="w-14 h-14 text-green-700" />
          )}
        </div>
      </div>

      {/* Centered Content */}
      <div className="py-4 px-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold">
          {schoolData?.name ?? "—"}
          <span className="text-xs font-normal pl-2">(Estd 2065 BS)</span>
        </h2>

        <div className="mt-2 space-y-1.5 text-sm">
          <div className="flex items-center justify-center">
            <LocateIcon className="mr-3 shrink-0" />
            {schoolData?.address ?? "—"}
          </div>
          <div className="flex items-center justify-center">
            <Mail className="mr-3 shrink-0" />
            {schoolData?.email ?? "—"}
          </div>
          <div className="flex items-center justify-center">
            <Phone className="mr-3 shrink-0" />
            {schoolData?.contactNumber ?? "—"}
          </div>
        </div>
      </div>
    </div>
  );
}