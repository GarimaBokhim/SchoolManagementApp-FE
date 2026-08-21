import { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    loading?: boolean;
}

export const StatCard = ({ label, value, icon: Icon, loading }: StatCardProps) => {
    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2b2e] p-3 text-center">
            <Icon size={20} className="mx-auto text-[#035BBA]" />
            <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                {loading ? "…" : value}
            </p>
            <p className="text-[11px] leading-tight text-gray-500 dark:text-gray-400">{label}</p>
        </div>
    );
};
