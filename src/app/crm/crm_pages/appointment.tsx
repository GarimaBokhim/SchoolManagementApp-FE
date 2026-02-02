// src/pages/Appointments.tsx
import React from 'react';
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  Clock as ClockIcon,
} from 'lucide-react';

type AppointmentStatus = 'confirmed' | 'pending';

interface Appointment {
  id: number;
  student: string;
  time: string;
  date: string;
  type: string;
  status: AppointmentStatus;
}

const Appointments: React.FC = () => {
  const appointments: Appointment[] = [
    {
      id: 1,
      student: 'Aarav Sharma',
      time: '10:00 AM',
      date: 'Today',
      type: 'Visa Counseling',
      status: 'confirmed',
    },
    {
      id: 2,
      student: 'Priya Maharjan',
      time: '2:30 PM',
      date: 'Tomorrow',
      type: 'Document Review',
      status: 'pending',
    },
    {
      id: 3,
      student: 'Rohan Gurung',
      time: '11:15 AM',
      date: 'Jan 30',
      type: 'University Selection',
      status: 'confirmed',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Appointments
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage counseling sessions and meetings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Today's Schedule
            </h3>
            <Calendar className="h-6 w-6 text-blue-500" />
          </div>

          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-800 dark:text-white">
                      {appointment.student}
                    </span>
                  </div>

                  {appointment.status === 'confirmed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <ClockIcon className="h-5 w-5 text-yellow-500" />
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.time}</span>
                  </div>
                  <span className="text-gray-500">
                    {appointment.date}
                  </span>
                </div>

                <div className="mt-2">
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    {appointment.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
            All Appointments
          </h3>

          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              Appointments Calendar
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              View and manage all scheduled appointments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
