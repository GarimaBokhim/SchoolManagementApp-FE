import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface SectionLinkProps {
    href: string;
    label: string;
    description?: string;
    icon: LucideIcon;
}

export const SectionLink = ({ href, label, description, icon: Icon }: SectionLinkProps) => {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-4 hover:border-[#4788CD] transition-colors"
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950 text-[#035BBA]">
                <Icon size={20} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                {description && (
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">{description}</p>
                )}
            </div>
        </Link>
    );
};
