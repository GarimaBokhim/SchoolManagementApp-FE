import React from 'react';
import { Globe } from 'lucide-react';
import { destinations } from '../data/mock_data';

interface Destination {
  country: string;
  students: number;
  color: string;
}

const StudentDestinations: React.FC = () => {
  const maxStudents = Math.max(...destinations.map(d => d.students));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">Student Destinations</h3>
        <Globe className="h-6 w-6 text-blue-500" />
      </div>
      <div className="space-y-4">
        {destinations.map((dest: Destination, index: number) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 ${dest.color} rounded-full`}></div>
                <span className="font-medium text-gray-700 dark:text-gray-300">{dest.country}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Popular destination</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{dest.students} students</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${dest.color} rounded-full`}
                style={{ width: `${(dest.students / maxStudents) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDestinations;