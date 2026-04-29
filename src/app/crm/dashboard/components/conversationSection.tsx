// conversions_section.tsx - New component for the Conversions section
"use client";
import React from "react";
import { Users, TrendingUp, FileText, GraduationCap, Calendar, CheckCircle } from "lucide-react";

interface ConversionMetric {
  label: string;
  count: number;
  icon: React.ElementType;
  color: string;
  change?: number;
}

const ConversionsSection: React.FC = () => {
  const conversionMetrics: ConversionMetric[] = [
    { label: "Total Applicants", count: 328, icon: Users, color: "#0A53C3", change: 12 },
    { label: "Visa Processing", count: 156, icon: FileText, color: "#10B981", change: -5 },
    { label: "Class Enrollments", count: 892, icon: GraduationCap, color: "#8B5CF6", change: 8 },
  ];

  return (
    <div className="bg-white dark:bg-[#161B27] rounded-xl shadow-sm border border-gray-200 dark:border-[#1E2A3E] transition-colors duration-300">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 dark:border-[#1E2A3E]">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: "#0A53C3" }}
          />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Conversions
          </h3>
        </div>
      </div>

      <div className="p-5">
        {/* User Profile Section */}
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100 dark:border-[#1E2A3E]">
          <div className="relative">
            <div
              className="h-14 w-14 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
              style={{ backgroundColor: "#0A53C3" }}
            >
              SD
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#161B27]"></div>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-bold text-gray-900 dark:text-white">
              Sanjog Dhakal
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">User • Agent</p>
          </div>
          <button
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 hover:scale-105"
            style={{ backgroundColor: "#EBF1FB", color: "#0A53C3" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C2D5F5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#EBF1FB")}
          >
            View As
          </button>
        </div>

        {/* Conversion Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {conversionMetrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="p-4 rounded-lg bg-gray-50 dark:bg-[#0D1117]/60 border border-gray-100 dark:border-[#1E2A3E] hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${metric.color}10` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: metric.color }} />
                  </div>
                  {metric.change && (
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${
                        metric.change > 0 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {metric.change > 0 ? "↑" : "↓"} {Math.abs(metric.change)}%
                    </div>
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {metric.count.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{metric.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-[#1E2A3E] grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              This Month: +24%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Conversion Rate: 18.5%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionsSection;