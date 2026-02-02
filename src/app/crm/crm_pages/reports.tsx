// src/pages/Reports.tsx
import React from 'react';
import { BarChart3, TrendingUp, Download, Filter } from 'lucide-react';

const Reports: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Reports
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Analytics and performance reports
          </p>
        </div>

        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Performance Overview
            </h3>
            <BarChart3 className="h-6 w-6 text-blue-500" />
          </div>

          <div className="text-center py-12">
            <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              94%
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Visa Success Rate
            </p>
            <div className="flex items-center justify-center mt-2 text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+2.5% from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Monthly Analytics
            </h3>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>

          <div className="text-center py-12">
            <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              248
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              New Students This Month
            </p>
            <div className="flex items-center justify-center mt-2 text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+18% from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
          Report Categories
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-gray-800 dark:text-white mb-2">
              Student Reports
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enrollment and progress reports
            </p>
          </div>

          <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-gray-800 dark:text-white mb-2">
              Financial Reports
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Revenue and payment reports
            </p>
          </div>

          <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="font-medium text-gray-800 dark:text-white mb-2">
              Performance Reports
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Counselor and service reports
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
