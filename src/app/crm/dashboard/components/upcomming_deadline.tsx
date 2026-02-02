// src/components/UpcomingDeadlines.tsx
import React from 'react';
import { Calendar, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { deadlines } from '../data/mock_data';

type DeadlineStatus = 'urgent' | 'warning' | 'done';

interface Deadline {
  university: string;
  program: string;
  deadline: string;
  status: DeadlineStatus;
}

const UpcomingDeadlines: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
          Upcoming Deadlines
        </h3>
        <Calendar className="h-6 w-6 text-blue-500" />
      </div>

      <div className="space-y-4">
        {(deadlines as Deadline[]).map((deadline, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            {/* University & Status Icon */}
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800 dark:text-white">
                {deadline.university}
              </h4>
              {deadline.status === 'urgent' ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : deadline.status === 'warning' ? (
                <Clock className="h-5 w-5 text-yellow-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>

            {/* Program */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {deadline.program} Program
            </p>

            {/* Deadline & Status Badge */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {deadline.deadline}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  deadline.status === 'urgent'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : deadline.status === 'warning'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}
              >
                {deadline.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;
