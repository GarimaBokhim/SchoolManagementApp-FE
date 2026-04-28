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

  // Add this log
  console.log('School Info:', {
    id: schoolData?.id,
    name: schoolData?.name,
    imageUrl: schoolData?.imageUrl,
    resolvedUrl: logoUrl
  });

  if (isLoading) {
    return (
      <div className="relative bg-green-700 text-white rounded-lg shadow-md overflow-hidden p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-white/20 rounded-full animate-pulse" />
          <div className="h-7 w-48 bg-white/20 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-64 bg-white/20 rounded animate-pulse" />
          <div className="h-4 w-56 bg-white/20 rounded animate-pulse" />
          <div className="h-4 w-40 bg-white/20 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-green-700 text-white rounded-lg shadow-md overflow-hidden p-6">
      {/* First Row: Logo and School Name */}
      <div className="flex items-center gap-4 mb-6">
        {/* School Logo */}
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md flex-shrink-0">
          {logoUrl && !logoError ? (
            <img
              src={logoUrl}
              alt="School Logo"
              className="w-full h-full object-cover"
              onError={() => setLogoError(true)}
            />
          ) : (
            <School className="w-10 h-10 text-green-700" />
          )}
        </div>

        {/* School Name */}
        <h2 className="text-2xl font-bold">
          {schoolData?.name ?? "—"}
          <span className="text-xs font-normal pl-2">(Estd 2065 BS)</span>
        </h2>
      </div>

      {/* Second Row: School Information */}
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
  );
}