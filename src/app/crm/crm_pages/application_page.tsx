// src/pages/Applications.tsx
import React from 'react';
import { FileText, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const Applications: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Applications
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track and manage all student applications
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />

          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            Applications Management
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Track all submitted applications and their status
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {/* Pending */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Pending
                </span>
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                142
              </div>
            </div>

            {/* Approved */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Approved
                </span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                94
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  In Progress
                </span>
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                106
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;
