"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ReactNode } from "react";

interface MobilePageHeaderProps {
    title: string;
    action?: ReactNode;
}

export const MobilePageHeader = ({ title, action }: MobilePageHeaderProps) => {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    aria-label="Go back"
                    onClick={() => router.back()}
                    className="rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h1>
            </div>
            {action}
        </div>
    );
};
