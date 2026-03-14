// components/stats_card.tsx
import React from "react";
import { LucideIcon } from "lucide-react";

export interface StatItem {
  label: string;
  count: number | string;
  icon: LucideIcon;
  iconBg: string;   // e.g. "bg-blue-100 dark:bg-blue-900/40"
  iconColor: string; // e.g. "text-blue-600 dark:text-blue-400"
}

interface StatsCardProps {
  stat: StatItem;
}

const StatsCard: React.FC<StatsCardProps> = ({ stat }) => {
  const Icon = stat.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
      {/* Circular Icon Frame */}
      <div
        className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${stat.iconBg}`}
      >
        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
      </div>

      {/* Label & Count */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-tight">
          {stat.label}
        </span>
        <span className="text-2xl font-bold text-gray-800 dark:text-white mt-0.5">
          {stat.count}
        </span>
      </div>
    </div>
  );
};

export default StatsCard;