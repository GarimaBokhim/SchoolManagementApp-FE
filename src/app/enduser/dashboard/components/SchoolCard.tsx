"use client";
import { useGetSchoolById } from "@/app/admin/Setup/School/hooks";
import { LocateIcon, Mail, Phone, School } from "lucide-react";

type Props = {
  schoolId: string;
};

export default function SchoolInfoCard({ schoolId }: Props) {
  const { data: schoolData, isLoading } = useGetSchoolById(schoolId || null);

  if (isLoading) {
    return (
      <div className="relative bg-gradient-to-r from-green-900 to-green-500 text-white rounded-lg shadow-md overflow-hidden">
        <div className="absolute top-4 left-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg animate-pulse" />
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center animate-pulse">
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
    <div className="relative bg-gradient-to-r from-green-900 to-green-500 text-white rounded-lg shadow-md overflow-hidden">
      {/* Logo placeholder - Top Left */}
      <div className="absolute top-4 left-4">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <School className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Centered Content */}
      <div className="p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold">
          {schoolData?.name ?? "—"}
          <span className="text-xs font-normal pl-2">(Estd 2065 BS)</span>
        </h2>

        <div className="mt-3 space-y-2 text-sm">
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