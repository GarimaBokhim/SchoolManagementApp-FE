// src/components/UpcomingDeadlines.tsx
import React from "react";
import { Calendar, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { deadlines } from "../data/mock_data";

type DeadlineStatus = "urgent" | "warning" | "done";

interface Deadline {
  university: string;
  program: string;
  deadline: string;
  status: DeadlineStatus;
}

const statusConfig: Record<
  DeadlineStatus,
  {
    icon: React.FC<{ className?: string }>;
    iconClass: string;
    badgeClass: string;
    label: string;
  }
> = {
  urgent: {
    icon: AlertCircle,
    iconClass: "text-red-500 dark:text-red-400",
    badgeClass:
      "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800",
    label: "Urgent",
  },
  warning: {
    icon: Clock,
    iconClass: "text-amber-500 dark:text-amber-400",
    badgeClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
    label: "Warning",
  },
  done: {
    icon: CheckCircle,
    iconClass: "text-emerald-500 dark:text-emerald-400",
    badgeClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
    label: "Done",
  },
};

const UpcomingDeadlines: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#161B27] rounded-xl shadow-sm border border-gray-200 dark:border-[#1E2A3E] p-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: "#0A53C3" }}
          />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Upcoming Deadlines
          </h3>
        </div>
        <Calendar className="h-4 w-4" style={{ color: "#0A53C3" }} />
      </div>

      <div className="space-y-3">
        {(deadlines as Deadline[]).map((deadline, index) => {
          const cfg = statusConfig[deadline.status] ?? statusConfig["done"]; 
          const StatusIcon = cfg.icon;
          return (
            <div
              key={index}
              className="p-3.5 bg-gray-50 dark:bg-[#0D1117]/60 border border-gray-100 dark:border-[#1E2A3E] rounded-lg hover:border-[#0A53C3]/30 dark:hover:border-[#0A53C3]/30 transition-colors duration-150"
            >
              {/* University & icon */}
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {deadline.university}
                </h4>
                <StatusIcon className={`h-4 w-4 ${cfg.iconClass}`} />
              </div>

              {/* Program */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {deadline.program} Program
              </p>

              {/* Deadline & badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {deadline.deadline}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badgeClass}`}
                >
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;