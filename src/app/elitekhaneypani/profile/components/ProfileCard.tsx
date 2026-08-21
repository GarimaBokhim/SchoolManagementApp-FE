"use client";

import { useRef, useState } from "react";
import { Camera, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { SchoolProfile } from "../types/profile.types";
import { getRoleFromToken, useUpdateProfilePicture } from "../hooks/useProfile";
import { useLanguage } from "../../context/LanguageContext";
import { toDevanagariDigits } from "../../utils/format";

const resolveImageUrl = (url?: string | null): string | null => {
    if (!url || url === "-" || url === "string" || url.trim() === "") return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return encodeURI(url);
    return encodeURI(`${process.env.NEXT_PUBLIC_API_URL}/${url.replace(/^\//, "")}`);
};

interface ProfileCardProps {
    profile?: SchoolProfile;
    isLoading?: boolean;
}

export const ProfileCard = ({ profile, isLoading }: ProfileCardProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const updatePicture = useUpdateProfilePicture();
    const { lang } = useLanguage();
    const [imageError, setImageError] = useState(false);
    const logoUrl = resolveImageUrl(profile?.imageUrl);
    const showImage = Boolean(logoUrl) && !imageError;
    const displayName = (lang === "np" && profile?.nameNp) || profile?.name;
    const displayAddress = (lang === "np" && profile?.addressNp) || profile?.address;
    const roleLabel = getRoleFromToken();

    const handlePictureClick = () => fileInputRef.current?.click();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && profile) {
            setImageError(false);
            updatePicture.mutate({ profile, logo: file });
        }
        event.target.value = "";
    };

    if (isLoading) {
        return (
            <section className="rounded-xl bg-gradient-to-br from-[#035BBA] to-[#4788CD] p-6 text-white">
                <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-white/20 animate-pulse" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-32 rounded bg-white/20 animate-pulse" />
                        <div className="h-3 w-48 rounded bg-white/20 animate-pulse" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="rounded-xl bg-gradient-to-br from-[#035BBA] to-[#4788CD] p-6 text-white">
            <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-xl font-bold">{displayName ?? "EliteKhaneyPani"}</h1>
                    <div className="mt-1 flex flex-col gap-1 text-xs text-white/80">
                        {displayAddress && (
                            <div className="flex items-center gap-1.5 truncate">
                                <MapPin size={12} className="shrink-0" />
                                <span className="truncate">{displayAddress}</span>
                            </div>
                        )}
                        {profile?.email && (
                            <div className="flex items-center gap-1.5 truncate">
                                <Mail size={12} className="shrink-0" />
                                <span className="truncate">{profile.email}</span>
                            </div>
                        )}
                        {profile?.contactNumber && (
                            <div className="flex items-center gap-1.5 truncate">
                                <Phone size={12} className="shrink-0" />
                                <span className="truncate">
                                    {lang === "np" ? toDevanagariDigits(profile.contactNumber) : profile.contactNumber}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex shrink-0 flex-col items-center gap-2">
                    <button
                        type="button"
                        onClick={handlePictureClick}
                        aria-label="Change profile picture"
                        className="relative h-14 w-14 shrink-0 rounded-full bg-white/10 overflow-hidden flex items-center justify-center ring-2 ring-white"
                    >
                        {showImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={logoUrl ?? undefined}
                                alt={profile?.name ?? "Profile"}
                                className="h-full w-full object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <span className="text-lg font-bold">{profile?.shortName?.charAt(0) ?? "E"}</span>
                        )}
                        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center bg-black/40 py-0.5">
                            <Camera size={12} />
                        </span>
                    </button>
                    {roleLabel && (
                        <span className="flex items-center gap-1 truncate rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium">
                            <ShieldCheck size={10} className="shrink-0" />
                            {roleLabel}
                        </span>
                    )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
        </section>
    );
};
