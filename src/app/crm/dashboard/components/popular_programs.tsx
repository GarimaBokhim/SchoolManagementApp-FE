// src/components/PopularPrograms.tsx
import React from "react";
import { programs } from "../data/mock_data";

interface Program {
  name: string;
  count: number;
  color: string;
}

const PopularPrograms: React.FC = () => {
  const maxCount = Math.max(...(programs as Program[]).map((p) => p.count));

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
            Popular Programs
          </h3>
        </div>
        <button
          className="text-xs font-medium transition-colors duration-150"
          style={{ color: "#0A53C3" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "#083F96")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "#0A53C3")
          }
        >
          View all
        </button>
      </div>

      <div className="space-y-4">
        {(programs as Program[]).map((program, index) => {
          const pct = Math.round((program.count / maxCount) * 100);
          return (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${program.color}`}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {program.name}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                  {program.count} students
                </span>
              </div>
              {/* Progress bar — use primary for first, keep original colors for rest */}
              <div className="h-1.5 bg-gray-100 dark:bg-[#1E2A3E] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    index === 0 ? "" : program.color
                  }`}
                  style={{
                    width: `${pct}%`,
                    ...(index === 0
                      ? { backgroundColor: "#0A53C3" }
                      : {}),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularPrograms;