// src/components/StudentTable.tsx
import React, { useState } from 'react';
import { Eye, Edit, Phone, Mail, MoreVertical } from 'lucide-react';
import { students } from '../data/mock_data';

type StudentStatus = 'active' | 'pending' | 'rejected';
type ApplicationStage =
  | 'Visa Approved'
  | 'Documentation'
  | 'Offer Received'
  | 'Visa Rejected'
  | 'Under Review'
  | 'Interview Scheduled';

interface Student {
  id: number;
  name: string;
  location: string;
  program: string;
  university: string;
  country: string;
  status: StudentStatus;
  stage: ApplicationStage;
  intake: string;
  applicationDate: string;
}

const StudentTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'rejected' | 'all'>('active');

  const statusBadge = (status: StudentStatus) => {
    const styles: Record<StudentStatus, string> = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const stageBadge = (stage: ApplicationStage) => {
    const colors: Record<ApplicationStage, string> = {
      'Visa Approved': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      Documentation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Offer Received': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Visa Rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Under Review': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'Interview Scheduled': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[stage] || 'bg-gray-100'}`}>
        {stage}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header & Tabs */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Student Applications</h2>
            <p className="text-gray-500 dark:text-gray-400">Track and manage all student applications</p>
          </div>
          <div className="flex space-x-2">
            {['active', 'pending', 'rejected', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-4 py-2 rounded-lg font-medium transition duration-200 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Student
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Program & University
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Destination
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Status
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Application Stage
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Intake
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {(students as Student[])
              .filter((student) => activeTab === 'all' || student.status === activeTab)
              .map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  {/* Student */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold">
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{student.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {student.location}, Nepal
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Program & University */}
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{student.program}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{student.university}</p>
                    </div>
                  </td>

                  {/* Destination */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-800 dark:text-white">{student.country}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">{statusBadge(student.status)}</td>

                  {/* Stage */}
                  <td className="py-4 px-6">{stageBadge(student.stage)}</td>

                  {/* Intake */}
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{student.intake}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Applied: {student.applicationDate}
                      </p>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Eye className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Edit className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Phone className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <Mail className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
