"use client";
import {
  GraduationCap,
  MapPin,
  Award,
  Globe,
  ExternalLink,
  Search,
  ChevronRight,
  Plus,
} from "lucide-react";
import { IUniversity } from "../types/IUniversity";

interface UniversityCardProps {
  university: IUniversity;
  index: number;
  canAdd?: boolean;
  onViewDetails: (universityId: string) => void;
  onAddCountry?: (universityId: string) => void;
}

const cardTheme = {
  gradient: "from-emerald-500 to-teal-600",
  light: "bg-emerald-50 dark:bg-emerald-900/20",
  text: "text-emerald-700 dark:text-emerald-300",
  border: "border-emerald-200 dark:border-emerald-800/50",
  icon: "text-emerald-600 dark:text-emerald-400",
  badge: "bg-emerald-500",
  button: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-700 dark:hover:text-emerald-300",
};

const generateLocation = (university: IUniversity): string => {
  return university.country || "Location not specified";
};

const generateDescription = (university: IUniversity): string => {
  if (university.descriptions && university.descriptions !== "str") {
    return university.descriptions;
  }
  return `${university.name} is a distinguished institution in ${university.country} holding global ranking #${university.globalRanking}.`;
};

export const UniversityCard = ({
  university,
  index,
  canAdd = false,
  onViewDetails,
  onAddCountry,
}: UniversityCardProps) => {
  const theme = cardTheme;

  return (
    <div className="group relative bg-white dark:bg-[#1e1e21] border border-gray-200 dark:border-gray-700/50 rounded-2xl hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Gradient Header Banner */}
      <div className={`relative bg-gradient-to-br ${theme.gradient} p-5 pb-8`}>
        {/* Icon + Rank badge row */}
        <div className="relative flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <GraduationCap size={20} className="text-white" />
          </div>
          {university.globalRanking && (
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1">
              <Award size={11} className="text-white/80" />
              <span className="text-xs font-bold text-white">
                #{university.globalRanking}
              </span>
            </div>
          )}
        </div>

        {/* University name */}
        <h3 className="relative mt-3 text-sm font-bold text-white leading-snug line-clamp-2 drop-shadow-sm">
          {university.name}
        </h3>
      </div>

      {/* Overlap avatar bump */}
      <div className="relative -mt-4 mx-5 z-10">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.light} ${theme.border} shadow-sm`}>
          <MapPin size={11} className={theme.icon} />
          <span className={`text-xs font-semibold ${theme.text} truncate max-w-[180px]`}>
            {generateLocation(university)}
          </span>
          {canAdd && onAddCountry && (
            <button
              type="button"
              onClick={() => onAddCountry(university.id)}
              title="Add Country"
              className={`ml-1 w-4 h-4 rounded flex items-center justify-center ${theme.text} border border-current hover:opacity-70 transition-opacity flex-shrink-0`}
            >
              <Plus size={9} />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 pt-3 flex flex-col flex-1">
        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
          {generateDescription(university)}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center gap-0.5 border border-gray-100 dark:border-gray-700/30">
            <Award size={13} className={`${theme.icon} mb-0.5`} />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Global Rank</span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
              {university.globalRanking ? `#${university.globalRanking}` : "N/A"}
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center gap-0.5 border border-gray-100 dark:border-gray-700/30">
            <Globe size={13} className={`${theme.icon} mb-0.5`} />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Country</span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate max-w-full">
              {university.country || "N/A"}
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Website */}
        {university.website && university.website !== "str" && (
          <a
            href={university.website.startsWith("http") ? university.website : `https://${university.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-blue-500 dark:text-blue-400 hover:underline truncate mb-3"
          >
            <ExternalLink size={11} className="flex-shrink-0" />
            <span className="truncate">{university.website}</span>
          </a>
        )}

        {/* View Details button */}
        <button
          type="button"
          onClick={() => onViewDetails(university.id)}
          className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl
            text-xs font-semibold border transition-all duration-200
            bg-white dark:bg-[#252528] text-gray-600 dark:text-gray-300
            border-gray-200 dark:border-gray-600/50
            ${theme.button}`}
        >
          <Search size={12} />
          View Details
          <ChevronRight
            size={12}
            className="ml-auto opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200"
          />
        </button>
      </div>
    </div>
  );
};