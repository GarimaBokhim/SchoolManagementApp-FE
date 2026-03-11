"use client";

import { useRef, useState } from 'react';
import { Filter, RotateCcw, Plus, User } from 'lucide-react';
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import Pagination from "@/components/Pagination";
import { AppCombobox } from "@/components/Input/ComboBox";
import DateRangeFilter from "@/components/DateFilter/FilterComponent";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";

// Simple status badge component
const StatusBadge = ({ status }: { status: string }) => {
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
    { id: '1', studentName: 'Alice Turner', counselorName: 'Dr. Sarah Johnson', date: '2024-03-15', time: '10:00 AM', type: 'Career Counseling', status: 'Scheduled', notes: 'First session' },
    { id: '2', studentName: 'Bob Martinez', counselorName: 'Prof. Michael Chen', date: '2024-03-16', time: '11:30 AM', type: 'Academic Advisor', status: 'Completed', notes: 'Follow-up' },
    { id: '3', studentName: 'Clara Singh', counselorName: 'Ms. Emily Rodriguez', date: '2024-03-17', time: '02:00 PM', type: 'Mental Health', status: 'Pending', notes: 'Initial consultation' },
    { id: '4', studentName: 'David Kim', counselorName: 'Dr. James Wilson', date: '2024-03-18', time: '09:00 AM', type: 'Study Abroad', status: 'Scheduled', notes: 'Visa guidance' },
    { id: '5', studentName: 'Eva Patel', counselorName: 'Dr. Sarah Johnson', date: '2024-03-19', time: '03:30 PM', type: 'Career Counseling', status: 'Cancelled', notes: 'Student request' },
  ];

  // Mock data for combobox search results
  const mockSearchResults = [
    { id: '1', fullName: 'Alice Turner', email: 'alice.t@example.com', status: 'Scheduled' },
    { id: '2', fullName: 'Bob Martinez', email: 'bob.m@example.com', status: 'Completed' },
    { id: '3', fullName: 'Clara Singh', email: 'clara.s@example.com', status: 'Pending' },
    { id: '4', fullName: 'David Kim', email: 'david.k@example.com', status: 'Scheduled' },
    { id: '5', fullName: 'Eva Patel', email: 'eva.p@example.com', status: 'Cancelled' },
  ];

  const [openFilter, setOpenFilter] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [searchResults, setSearchResults] = useState(mockSearchResults);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dateFilterRef = useRef<any>(null);

  const filterForm = useForm({
    defaultValues: {
      firstName: "",
      startDate: "",
      endDate: "",
    }
  });

  const paginationForm = useForm({
    defaultValues: { pageSize: 10, pageIndex: 1, isPagination: true },
  });

  const handleSearch = (searchParams: any) => {
    setPageSize(searchParams.pageSize || pageSize);
    setCurrentPage(searchParams.pageIndex);
  };

  const handleFilterSubmit = (data: any) => {
    console.log("Filter data:", data);
    setOpenFilter(false);
    alert(`Filter applied: ${JSON.stringify(data)}`);
  };

  const fetchUsers = (searchTerm: string) => {
    if (searchTerm) {
      const filtered = mockSearchResults.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(mockSearchResults);
    }
  };

  const handleProfileSelected = (profile: any) => {
    setSelectedProfile(profile);
    filterForm.setValue("firstName", profile?.fullName || "");
  };

  const onClearClick = () => {
    filterForm.reset({
      firstName: "",
      startDate: "",
      endDate: "",
    });
    setSelectedProfile(null);
    setSearchResults(mockSearchResults);
    setOpenFilter(false);
  };

  const handleAddNew = () => {
    alert('Add new appointment feature coming soon!');
  };

  const handleEdit = (appointment: any) => {
    alert(`Edit appointment: ${appointment.studentName}`);
  };

  const handleDelete = (appointment: any) => {
    if (confirm(`Are you sure you want to delete appointment for ${appointment.studentName}?`)) {
      alert(`Delete appointment: ${appointment.studentName}`);
    }
  };

  const handleView = (appointment: any) => {
    alert(`View appointment details: ${appointment.studentName}`);
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
                  text="Add Appointment"
                  onClick={handleAddNew}
                  className="!bg-emerald-600 hover:!bg-emerald-700 !text-white"
                />
              )}
            </div>
          </div>

          {openFilter && (
            <div className="mb-6 mx-4 sm:mx-6 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <form
                onSubmit={filterForm.handleSubmit(handleFilterSubmit)}
                className="flex flex-wrap items-end gap-4 md:gap-6"
              >
                <DateRangeFilter
                  ref={dateFilterRef}
                  form={filterForm}
                  onSubmit={handleFilterSubmit}
                  setParams={() => {}}
                />
                <div className="flex-1 min-w-[240px]">
                  <AppCombobox
                    value={selectedProfile?.fullName || ""}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Search by Name"
                    name="firstName"
                    form={filterForm}
                    options={searchResults}
                    selected={selectedProfile}
                    onSelect={handleProfileSelected}
                    onFocus={() => fetchUsers("")}
                    getLabel={(profile) => profile?.fullName ?? ""}
                    getValue={(profile) => profile?.id ?? ""}
                    renderOptionExtra={(profile) => (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {profile.email} • {profile.status}
                      </div>
                    )}
                  />
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
                    onClick={onClearClick}
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
                  <th className="px-4 py-3 text-left">Student Name</th>
                  <th className="px-4 py-3 text-left">Counselor Name</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Time</th>
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
                      <td className="py-2 px-4">{appointment.date}</td>
                      <td className="py-2 px-4">{appointment.time}</td>
                      <td className="py-2 px-4">{appointment.type}</td>
                      <td className="py-2 px-4">
                        <StatusBadge status={appointment.status} />
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(appointment)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            title="View"
                          >
                            <User size={16} className="text-blue-600" />
                          </button>
                          {canEdit && (
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
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(appointment)}
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