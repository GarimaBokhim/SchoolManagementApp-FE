// src/components/PopularPrograms.tsx
import React from 'react';
import { programs } from '../data/mock_data';

interface Program {
  name: string;
  count: number;
  color: string; // Tailwind color classes, e.g., "bg-blue-500"
}

const PopularPrograms: React.FC = () => {
  const maxCount = Math.max(...(programs as Program[]).map((p) => p.count));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          Popular Programs
        </h3>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {(programs as Program[]).map((program, index) => (
          <div key={index} className="space-y-2">
            {/* Program Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 ${program.color} rounded-full`}></div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {program.name}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {program.count} students
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${program.color} rounded-full`}
                style={{ width: `${(program.count / maxCount) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularPrograms;
