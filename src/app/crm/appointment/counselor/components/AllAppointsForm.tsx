"use client";

import { useState } from 'react';
import { Filter, RotateCcw, Plus, Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import Pagination from "@/components/Pagination";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";

// Simple status badge component
const AppointmentStatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    'Scheduled': 'bg-blue-100 text-blue-700 border border-blue-300',
    'Completed': 'bg-green-100 text-green-700 border border-green-300',
    'Cancelled': 'bg-red-100 text-red-700 border border-red-300',
    'Pending': 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorMap[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

const AllAppointmentsForm = () => {
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);
  
  // Simple static data for appointments
  const appointments = [
    { 
      id: '1', 
      studentName: 'John Smith', 
      counselorName: 'Dr. Sarah Johnson', 
      date: '2024-03-25', 
      time: '10:00 AM', 
      duration: '45 min',
      type: 'Career Counseling',
      status: 'Scheduled',
      notes: 'Discuss career options in tech'
    },
    { 
      id: '2', 
      studentName: 'Emma Wilson', 
      counselorName: 'Prof. Michael Chen', 
      date: '2024-03-25', 
      time: '11:30 AM', 
      duration: '30 min',
      type: 'Academic Advisor',
      status: 'Scheduled',
      notes: 'Course selection for next semester'
    },
    { 
      id: '3', 
      studentName: 'David Lee', 
      counselorName: 'Ms. Emily Rodriguez', 
      date: '2024-03-24', 
      time: '02:00 PM', 
      duration: '60 min',
      type: 'Mental Health',
      status: 'Completed',
      notes: 'Follow-up session'
    },
    { 
      id: '4', 
      studentName: 'Maria Garcia', 
      counselorName: 'Dr. James Wilson', 
      date: '2024-03-24', 
      time: '03:30 PM', 
      duration: '45 min',
      type: 'Study Abroad',
      status: 'Completed',
      notes: 'University application review'
    },
    { 
      id: '5', 
      studentName: 'Robert Brown', 
      counselorName: 'Prof. Lisa Thompson', 
      date: '2024-03-23', 
      time: '09:30 AM', 
      duration: '30 min',
      type: 'Research Guidance',
      status: 'Cancelled',
      notes: 'Rescheduled to next week'
    },
    { 
      id: '6', 
      studentName: 'Jennifer Lee', 
      counselorName: 'Dr. Sarah Johnson', 
      date: '2024-03-26', 
      time: '01:00 PM', 
      duration: '45 min',
      type: 'Career Counseling',
      status: 'Pending',
      notes: 'Initial consultation'
    },
  ];

  const [openFilter, setOpenFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filterForm = useForm();
  const paginationForm = useForm({
    defaultValues: { pageSize: 10, pageIndex: 1, isPagination: true },
  });

  const handleSearch = (searchParams: any) => {
    setPageSize(searchParams.pageSize || pageSize);
    setCurrentPage(searchParams.pageIndex);
  };

  const handleAddNew = () => {
    alert('Schedule new appointment feature coming soon!');
  };

  const handleEdit = (appointment: any) => {
    alert(`Edit appointment: ${appointment.studentName} with ${appointment.counselorName}`);
  };

  const handleDelete = (appointment: any) => {
    if (confirm(`Are you sure you want to cancel this appointment?`)) {
      alert(`Cancel appointment: ${appointment.studentName}`);
    }
  };

  const handleView = (appointment: any) => {
    alert(`View appointment details: ${appointment.studentName} - ${appointment.date} ${appointment.time}`);
  };

  // Simple pagination calculation
  const totalPages = Math.ceil(appointments.length / pageSize);
  const paginatedData = appointments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

          <div className="flex flex-col sm:flex-row w-full justify-between p-4 px-4 sm:px-6 gap-4 items-start sm:items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Appointments</h1>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700 !text-white"
              />
              {canAdd && (
                <ButtonElement
                  icon={<Plus size={20} />}
                  type="button"
                  text="Schedule"
                  onClick={handleAddNew}
                  className="!bg-emerald-600 hover:!bg-emerald-700 !text-white"
                />
              )}
            </div>
          </div>

          {openFilter && (
            <div className="mb-6 mx-4 sm:mx-6 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <form className="flex flex-wrap items-end gap-4 md:gap-6">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-[#2a2a2a] dark:text-white"
                    />
                    <span className="text-gray-500 self-center">to</span>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-[#2a2a2a] dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-[#2a2a2a] dark:text-white">
                    <option value="">All</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="flex gap-2 ml-auto">
                  <ButtonElement
                    type="submit"
                    text="Apply"
                    icon={<Filter size={14} />}
                    className="!bg-emerald-600 hover:!bg-emerald-700 !text-white"
                  />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={() => setOpenFilter(false)}
                    className="!bg-gray-500 hover:!bg-gray-600 !text-white"
                  />
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto relative">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-200 uppercase text-xs font-semibold border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 text-left w-[60px]">S.N</th>
                  <th className="px-4 py-3 text-left">Student</th>
                  <th className="px-4 py-3 text-left">Counselor</th>
                  <th className="px-4 py-3 text-left">Date & Time</th>
                  <th className="px-4 py-3 text-left">Duration</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((appointment, index) => (
                    <tr
                      key={appointment.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      <td className="py-2 px-4">
                        {((currentPage - 1) * pageSize + index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="py-2 px-4 font-medium">{appointment.studentName}</td>
                      <td className="py-2 px-4">{appointment.counselorName}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-gray-400" />
                          <span>{appointment.date}</span>
                          <Clock size={12} className="text-gray-400 ml-1" />
                          <span>{appointment.time}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4">{appointment.duration}</td>
                      <td className="py-2 px-4">{appointment.type}</td>
                      <td className="py-2 px-4">
                        <AppointmentStatusBadge status={appointment.status} />
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(appointment)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            title="View"
                          >
                            <Calendar size={16} className="text-blue-600" />
                          </button>
                          {canEdit && appointment.status === 'Scheduled' && (
                            <button
                              onClick={() => handleEdit(appointment)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          )}
                          {canDelete && appointment.status === 'Scheduled' && (
                            <button
                              onClick={() => handleDelete(appointment)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                              title="Cancel"
                            >
                              <XCircle size={16} className="text-red-600" />
                            </button>
                          )}
                          {appointment.status === 'Completed' && (
                            <button
                              className="p-1 opacity-50 cursor-not-allowed"
                              title="Completed"
                              disabled
                            >
                              <CheckCircle size={16} className="text-green-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500 dark:text-gray-400 italic">
                      No appointments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {appointments.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={paginationForm}
              pagination={{
                currentPage: currentPage,
                firstPage: 1,
                lastPage: totalPages,
                nextPage: currentPage < totalPages ? currentPage + 1 : currentPage,
                previousPage: currentPage > 1 ? currentPage - 1 : 1,
              }}
              handleSearch={handleSearch}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AllAppointmentsForm;