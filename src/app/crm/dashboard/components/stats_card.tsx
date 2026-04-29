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
  gradient?: string;
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

  const getGradient = () => {
    if (stat.gradient) return stat.gradient;

    const gradientMap: Record<string, string> = {
      'text-sky-600': 'from-sky-500 to-sky-600',
      'text-yellow-600': 'from-yellow-500 to-yellow-600',
      'text-purple-600': 'from-purple-500 to-purple-600',
      'text-indigo-600': 'from-indigo-500 to-indigo-600',
      'text-violet-600': 'from-violet-500 to-violet-600',
      'text-emerald-600': 'from-emerald-500 to-emerald-600',
      'text-blue-600': 'from-blue-500 to-blue-600',
      'text-teal-600': 'from-teal-500 to-teal-600',
      'text-orange-600': 'from-orange-500 to-orange-600',
      'text-pink-600': 'from-pink-500 to-pink-600',
    };

    return gradientMap[stat.iconColor] || 'from-[#0A53C3] to-[#3B82F6]';
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group relative overflow-hidden
        bg-gradient-to-br ${getGradient()}
        rounded-xl shadow-lg
        p-5 flex items-center gap-4
        transition-all duration-300
        ${
          stat.route
            ? "cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1"
            : "cursor-default hover:shadow-xl"
        }
      `}
    >
      {/* Icon */}
      <div
        className="
          flex-shrink-0 w-12 h-12 rounded-xl
          flex items-center justify-center
          bg-white/20 backdrop-blur-sm
          group-hover:scale-110 transition-transform duration-300
          shadow-md
        "
      >
        <Icon className="w-5 h-5 text-white" />
      </div>

      {/* Label & Count */}
      <div className="flex flex-col flex-1 min-w-0 relative z-10">
        <span className="text-xs font-medium text-white/80 leading-tight truncate">
          {stat.label}
        </span>
        <span className="text-2xl font-bold text-white mt-0.5 tabular-nums">
          {stat.count}
        </span>
      </div>

      {/* Arrow — only for clickable cards */}
      {stat.route && (
        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 flex-shrink-0 relative z-10">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  );
};

export default StatsCard;