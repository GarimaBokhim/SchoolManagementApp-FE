import React from 'react';
import { BookOpen, Globe, Star, Users } from 'lucide-react';

interface University {
  name: string;
  country: string;
  students: number;
  rating: number;
}

const Universities: React.FC = () => {
  const universities: University[] = [
    { name: 'University of Melbourne', country: 'Australia', students: 45, rating: 4.8 },
    { name: 'University of Toronto', country: 'Canada', students: 38, rating: 4.7 },
    { name: 'University of Leeds', country: 'UK', students: 32, rating: 4.6 },
    { name: 'Monash University', country: 'Australia', students: 28, rating: 4.5 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Universities
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Partner universities and institutions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Universities List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
            Partner Universities
          </h3>

          <div className="space-y-4">
            {universities.map((uni, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {uni.name}
                    </h4>

                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          {uni.country}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">
                          {uni.students} students
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium text-gray-800 dark:text-white">
                      {uni.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              University Partners
            </h3>
            <BookOpen className="h-6 w-6 text-blue-500" />
          </div>

          <div className="text-center py-8">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="font-medium text-gray-800 dark:text-white mb-2">
              Global Network
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Partnerships with 150+ universities worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Universities;
