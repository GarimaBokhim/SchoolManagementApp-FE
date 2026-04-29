"use client";

import { GraduationCap, Building2, Eye, Send, Award, Clock, BookOpen, ExternalLink } from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";

interface Course {
  id: string;
  title: string;
  studyLevel: number;
  tuationFee: number;
  currency: string;
  universityId: string;
  isActive: boolean;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

interface CourseCardProps {
  course: Course;
  universityName: string;
  studyLevelLabel: string;
  formattedFee: string;
  onViewDetails: (courseId: string) => void;
  onApplyNow: (courseId: string) => void;
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

const CourseCard = ({
  course,
  universityName,
  studyLevelLabel,
  formattedFee,
  onViewDetails,
  onApplyNow,
}: CourseCardProps) => {
  const theme = cardTheme;

  // Helper to get study level icon
  const getStudyLevelIcon = () => {
    const level = course.studyLevel;
    if (level <= 2) return <GraduationCap size={14} />;
    if (level === 3) return <Award size={14} />;
    return <BookOpen size={14} />;
  };

  return (
    <div className="group relative bg-white dark:bg-[#1e1e21] border border-gray-200 dark:border-gray-700/50 rounded-2xl hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Gradient Header Banner */}
      <div className={`relative bg-gradient-to-br ${theme.gradient} p-5 pb-8`}>
        {/* Icon + Badge row */}
        <div className="relative flex items-start justify-between">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <Building2 size={20} className="text-white" />
          </div>
          {course.isActive !== undefined && (
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-bold text-white">
                Active
              </span>
            </div>
          )}
        </div>

        {/* Course title */}
        <h3 className="relative mt-3 text-sm font-bold text-white leading-snug line-clamp-2 drop-shadow-sm">
          {course.title}
        </h3>
      </div>

      {/* Overlap avatar bump - University info */}
      <div className="relative -mt-4 mx-5 z-10">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${theme.light} ${theme.border} shadow-sm`}>
          <GraduationCap size={11} className={theme.icon} />
          <span className={`text-xs font-semibold ${theme.text} truncate max-w-[180px]`}>
            {universityName}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 pt-3 flex flex-col flex-1">
        {/* Description / Info */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            {getStudyLevelIcon()}
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Study Level
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
            {studyLevelLabel}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center gap-0.5 border border-gray-100 dark:border-gray-700/30">
            <Award size={13} className={`${theme.icon} mb-0.5`} />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Tuition Fee</span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
              {formattedFee}
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 flex flex-col items-center gap-0.5 border border-gray-100 dark:border-gray-700/30">
            <Clock size={13} className={`${theme.icon} mb-0.5`} />
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Duration</span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
              Varies
            </span>
          </div>
        </div>

        {/* Additional course details */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
            <span className="truncate">Course ID: {course.id.slice(0, 8)}...</span>
            {course.createdAt && (
              <>
                <span>•</span>
                <span>Added: {new Date(course.createdAt).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => onViewDetails(course.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl
              text-xs font-semibold border transition-all duration-200
              bg-white dark:bg-[#252528] text-gray-600 dark:text-gray-300
              border-gray-200 dark:border-gray-600/50
              ${theme.button}`}
          >
            <Eye size={12} />
            View Details
          </button>
          <button
            type="button"
            onClick={() => onApplyNow(course.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl
              text-xs font-semibold border transition-all duration-200
              bg-gradient-to-r ${theme.gradient} text-white border-transparent
              hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5
              transition-all duration-200`}
          >
            <Send size={12} />
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;