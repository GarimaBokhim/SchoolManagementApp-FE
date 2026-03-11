"use client";

import { useState } from 'react';
import { Filter, RotateCcw, Plus, User, Phone, Mail, Calendar } from 'lucide-react';
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import Pagination from "@/components/Pagination";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";

// Simple status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    'Active': 'bg-green-100 text-green-700 border border-green-300',
    'Inactive': 'bg-gray-100 text-gray-700 border border-gray-300',
    'On Leave': 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorMap[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

const AllCounselorsForm = () => {
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);
  
  // Simple static data for counselors
  const counselors = [
    { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah.j@example.com', phone: '+1 234-567-8901', specialization: 'Career Counseling', status: 'Active', students: 24, joinDate: '2023-01-15' },
    { id: '2', name: 'Prof. Michael Chen', email: 'michael.c@example.com', phone: '+1 234-567-8902', specialization: 'Academic Advisor', status: 'Active', students: 18, joinDate: '2023-03-20' },
    { id: '3', name: 'Ms. Emily Rodriguez', email: 'emily.r@example.com', phone: '+1 234-567-8903', specialization: 'Mental Health', status: 'On Leave', students: 12, joinDate: '2022-11-10' },
    { id: '4', name: 'Dr. James Wilson', email: 'james.w@example.com', phone: '+1 234-567-8904', specialization: 'Study Abroad', status: 'Active', students: 21, joinDate: '2023-06-05' },
    { id: '5', name: 'Prof. Lisa Thompson', email: 'lisa.t@example.com', phone: '+1 234-567-8905', specialization: 'Research Guidance', status: 'Inactive', students: 0, joinDate: '2022-08-12' },
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
    alert('Add new counselor feature coming soon!');
  };

  const handleEdit = (counselor: any) => {
    alert(`Edit counselor: ${counselor.name}`);
  };

  const handleDelete = (counselor: any) => {
    if (confirm(`Are you sure you want to delete ${counselor.name}?`)) {
      alert(`Delete counselor: ${counselor.name}`);
    }
  };

  const handleView = (counselor: any) => {
    alert(`View counselor details: ${counselor.name}`);
  };

  // Simple pagination calculation
  const totalPages = Math.ceil(counselors.length / pageSize);
  const paginatedData = counselors.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

          <div className="flex flex-col sm:flex-row w-full justify-between p-4 px-4 sm:px-6 gap-4 items-start sm:items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Counselors</h1>
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
                  text="Add Counselor"
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
                    Search by Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter counselor name..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-[#2a2a2a] dark:text-white"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Specialization
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-[#2a2a2a] dark:text-white">
                    <option value="">All</option>
                    <option value="career">Career Counseling</option>
                    <option value="academic">Academic Advisor</option>
                    <option value="mental">Mental Health</option>
                    <option value="study">Study Abroad</option>
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
                  <th className="px-4 py-3 text-left">Counselor Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Specialization</th>
                  <th className="px-4 py-3 text-left">Students</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((counselor, index) => (
                    <tr
                      key={counselor.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      <td className="py-2 px-4">
                        {((currentPage - 1) * pageSize + index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="py-2 px-4 font-medium">{counselor.name}</td>
                      <td className="py-2 px-4">{counselor.email}</td>
                      <td className="py-2 px-4">{counselor.phone}</td>
                      <td className="py-2 px-4">{counselor.specialization}</td>
                      <td className="py-2 px-4">{counselor.students}</td>
                      <td className="py-2 px-4">
                        <StatusBadge status={counselor.status} />
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(counselor)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            title="View"
                          >
                            <User size={16} className="text-blue-600" />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => handleEdit(counselor)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(counselor)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500 dark:text-gray-400 italic">
                      No counselors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {counselors.length > 0 && (
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

export default AllCounselorsForm;