// src/pages/Communications.tsx
import React from 'react';
import { MessageSquare, Mail, Phone, Send } from 'lucide-react';

const Communications: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Communications
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage all student communications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Recent Messages
            </h3>
            <MessageSquare className="h-6 w-6 text-blue-500" />
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800 dark:text-white">
                  Aarav Sharma
                </span>
                <span className="text-xs text-gray-500">
                  2 hours ago
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                When will my visa application be processed?
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800 dark:text-white">
                  Priya Maharjan
                </span>
                <span className="text-xs text-gray-500">
                  1 day ago
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Need help with document verification
              </p>
            </div>
          </div>
        </div>

        {/* Communication Tools */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
            Communication Tools
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                Email
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Send bulk emails to students
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Phone className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                SMS
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Send text notifications
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Send className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                Bulk Messaging
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Send announcements
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communications;
