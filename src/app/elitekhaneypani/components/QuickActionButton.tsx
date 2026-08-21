import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface QuickActionButtonProps {
    href: string;
    label: string;
    icon: LucideIcon;
}

export const QuickActionButton = ({ href, label, icon: Icon }: QuickActionButtonProps) => {
    return (
        <Link
            href={href}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4 text-center hover:border-[#4788CD] transition-colors"
        >
            <Icon size={24} className="text-[#035BBA]" />
            <span className="text-xs font-medium text-gray-900 dark:text-white">{label}</span>
        </Link>
    );
};
