import React from "react";
import { Globe } from "lucide-react";
import { destinations } from "../data/mock_data";

interface Destination {
  country: string;
  students: number;
  color: string;
}

const StudentDestinations: React.FC = () => {
  const maxStudents = Math.max(...destinations.map((d: Destination) => d.students));

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
            Student Destinations
          </h3>
        </div>
        <Globe className="h-4 w-4" style={{ color: "#0A53C3" }} />
      </div>

      <div className="space-y-4">
        {destinations.map((dest: Destination, index: number) => {
          const pct = Math.round((dest.students / maxStudents) * 100);
          return (
            <div key={index} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dest.color}`}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {dest.country}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
                    Popular
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                  {dest.students} students
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-gray-100 dark:bg-[#1E2A3E] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    index === 0 ? "" : dest.color
                  }`}
                  style={{
                    width: `${pct}%`,
                    ...(index === 0 ? { backgroundColor: "#0A53C3" } : {}),
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

export default StudentDestinations;