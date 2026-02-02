// src/pages/Payments.tsx
import React from 'react';
import { DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Payments: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Payments
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage student payments and invoices
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="text-center py-12">
          <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />

          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payments Management
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Track all payments and generate invoices
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {/* Paid */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Paid
                </span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                ₨ 8.2M
              </div>
            </div>

            {/* Pending */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Pending
                </span>
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                ₨ 2.1M
              </div>
            </div>

            {/* Overdue */}
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Overdue
                </span>
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                ₨ 0.4M
              </div>
            </div>

            {/* This Month */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  This Month
                </span>
                <DollarSign className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                ₨ 1.5M
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
