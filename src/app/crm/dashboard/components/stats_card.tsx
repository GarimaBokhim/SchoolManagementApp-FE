"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export interface StatItem {
  label: string;
  count: number | string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  route?: string;
}

interface StatsCardProps {
  stat: StatItem;
}

const StatsCard: React.FC<StatsCardProps> = ({ stat }) => {
  const Icon = stat.icon;
  const router = useRouter();

  const handleClick = () => {
    if (stat.route) {
      router.push(stat.route);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4 transition-all duration-200
        ${stat.route
          ? 'cursor-pointer hover:shadow-md hover:border-emerald-400 dark:hover:border-emerald-500 hover:-translate-y-0.5'
          : 'cursor-default hover:shadow-md'
        }`}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${stat.iconBg}`}>
        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
      </div>

      {/* Label & Count */}
      <div className="flex flex-col flex-1">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-tight">
          {stat.label}
        </span>
        <span className="text-2xl font-bold text-gray-800 dark:text-white mt-0.5">
          {stat.count}
        </span>
      </div>

      {/* Arrow — only for clickable cards */}
      {stat.route && (
        <div className="text-emerald-500 dark:text-emerald-400 opacity-60">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default StatsCard;