import { LucideIcon } from "lucide-react";

export type StatTileColor = "blue" | "green" | "rose" | "amber" | "indigo" | "teal";

const colorClasses: Record<StatTileColor, { icon: string; ring: string }> = {
    blue: { icon: "bg-blue-600 text-white dark:bg-blue-500", ring: "hover:ring-blue-200 dark:hover:ring-blue-900" },
    green: { icon: "bg-green-600 text-white dark:bg-green-500", ring: "hover:ring-green-200 dark:hover:ring-green-900" },
    rose: { icon: "bg-rose-600 text-white dark:bg-rose-500", ring: "hover:ring-rose-200 dark:hover:ring-rose-900" },
    amber: { icon: "bg-amber-600 text-white dark:bg-amber-500", ring: "hover:ring-amber-200 dark:hover:ring-amber-900" },
    indigo: { icon: "bg-indigo-600 text-white dark:bg-indigo-500", ring: "hover:ring-indigo-200 dark:hover:ring-indigo-900" },
    teal: { icon: "bg-teal-600 text-white dark:bg-teal-500", ring: "hover:ring-teal-200 dark:hover:ring-teal-900" },
};

interface StatTileProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color?: StatTileColor;
    loading?: boolean;
}

export const StatTile = ({ label, value, icon: Icon, color = "blue", loading }: StatTileProps) => {
    const { icon, ring } = colorClasses[color];

    return (
        <div
            className={`flex flex-col items-center rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#2a2b2e] p-2.5 text-center ring-1 ring-transparent transition-all active:scale-[0.97] ${ring}`}
        >
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${icon}`}>
                <Icon size={19} />
            </div>
            <p className="mt-1.5 w-full truncate text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="w-full truncate text-xs font-bold text-gray-900 dark:text-white">{loading ? "…" : value}</p>
        </div>
    );
};

