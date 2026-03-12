"use client";

import { useRef, useState } from 'react';
import { Filter, RotateCcw, Plus } from 'lucide-react';
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import Pagination from "@/components/Pagination";
import { AppCombobox } from "@/components/Input/ComboBox";
import DateRangeFilter from "@/components/DateFilter/FilterComponent";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import { Appointment } from '../types/IAppointment';
import { useAppointmentMutations } from '../hooks/UseAppointmentMutation';
import { AppointmentActionMenu } from './AppointmentActionMenu';
import { AddAppointmentModal } from '../model/AddAppointmentModel';

const APPOINTMENT_STATUS_LABELS: Record<number, string> = {
  1: 'Scheduled',
  2: 'Completed',
  3: 'Cancelled',
  4: 'Pending',
};

const StatusBadge = ({ status }: { status: string }) => {
  const colorMap: Record<string, string> = {
    Scheduled: 'bg-blue-100 text-blue-700 border border-blue-300',
    Completed: 'bg-green-100 text-green-700 border border-green-300',
    Cancelled: 'bg-red-100 text-red-700 border border-red-300',
    Pending: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorMap[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

// Static mock data — replace with real API hook later
const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', studentName: 'Alice Turner', counselorName: 'Dr. Sarah Johnson', date: '2024-03-15', time: '10:00 AM', type: 'Career Counseling', status: 'Scheduled', notes: 'First session' },
  { id: '2', studentName: 'Bob Martinez', counselorName: 'Prof. Michael Chen', date: '2024-03-16', time: '11:30 AM', type: 'Academic Advisor', status: 'Completed', notes: 'Follow-up' },
  { id: '3', studentName: 'Clara Singh', counselorName: 'Ms. Emily Rodriguez', date: '2024-03-17', time: '02:00 PM', type: 'Mental Health', status: 'Pending', notes: 'Initial consultation' },
  { id: '4', studentName: 'David Kim', counselorName: 'Dr. James Wilson', date: '2024-03-18', time: '09:00 AM', type: 'Study Abroad', status: 'Scheduled', notes: 'Visa guidance' },
  { id: '5', studentName: 'Eva Patel', counselorName: 'Dr. Sarah Johnson', date: '2024-03-19', time: '03:30 PM', type: 'Career Counseling', status: 'Cancelled', notes: 'Student request' },
];

const MOCK_SEARCH_RESULTS = [
  { id: '1', fullName: 'Alice Turner', email: 'alice.t@example.com', status: 'Scheduled' },
  { id: '2', fullName: 'Bob Martinez', email: 'bob.m@example.com', status: 'Completed' },
  { id: '3', fullName: 'Clara Singh', email: 'clara.s@example.com', status: 'Pending' },
  { id: '4', fullName: 'David Kim', email: 'david.k@example.com', status: 'Scheduled' },
  { id: '5', fullName: 'Eva Patel', email: 'eva.p@example.com', status: 'Cancelled' },
];

const AllAppointmentsForm = () => {
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);

  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [searchResults, setSearchResults] = useState(MOCK_SEARCH_RESULTS);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const dateFilterRef = useRef<any>(null);

  // Stub refetch — replace with real fetch when API is ready
  const refetch = () => {};

  const { handleAdd, handleDelete, handleEdit } = useAppointmentMutations(refetch);

  const filterForm = useForm({
    defaultValues: { firstName: '', startDate: '', endDate: '' },
  });

  const paginationForm = useForm({
    defaultValues: { pageSize: 10, pageIndex: 1, isPagination: true },
  });

  const handleSearch = (searchParams: any) => {
    setPageSize(searchParams.pageSize || pageSize);
    setCurrentPage(searchParams.pageIndex);
  };

  const handleFilterSubmit = (data: any) => {
    console.log('Filter data:', data);
    setOpenFilter(false);
  };

  const fetchUsers = (searchTerm: string) => {
    if (searchTerm) {
      setSearchResults(
        MOCK_SEARCH_RESULTS.filter((u) =>
          u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setSearchResults(MOCK_SEARCH_RESULTS);
    }
  };

  const handleProfileSelected = (profile: any) => {
    setSelectedProfile(profile);
    filterForm.setValue('firstName', profile?.fullName || '');
  };

  const onClearClick = () => {
    filterForm.reset({ firstName: '', startDate: '', endDate: '' });
    setSelectedProfile(null);
    setSearchResults(MOCK_SEARCH_RESULTS);
    setOpenFilter(false);
  };

  const handleView = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

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

          {/* Header */}
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
                  onClick={() => setShowAddModal(true)}
                  className="!bg-emerald-600 hover:!bg-emerald-700 !text-white"
                />
              )}
            </div>
          </div>

          {/* Filter Panel */}
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
                    value={selectedProfile?.fullName || ''}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Search by Name"
                    name="firstName"
                    form={filterForm}
                    options={searchResults}
                    selected={selectedProfile}
                    onSelect={handleProfileSelected}
                    onFocus={() => fetchUsers('')}
                    getLabel={(profile) => profile?.fullName ?? ''}
                    getValue={(profile) => profile?.id ?? ''}
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

          {/* Table */}
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
                  <th className="px-4 py-3 text-center w-[80px]">Actions</th>
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
                        <AppointmentActionMenu
                          appointment={appointment}
                          onView={handleView}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          canEdit={canEdit}
                          canDelete={canDelete}
                        />
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

        {/* Add Appointment Modal */}
        <AddAppointmentModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAdd}
        />

        {/* View Detail Modal — reuse StudentDetailModal pattern */}
        {showDetailModal && selectedAppointment && (
          <div
            className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
            onClick={() => setShowDetailModal(false)}
          >
            <div
              className="relative bg-white dark:bg-[#353535] rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Appointment Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-gray-500 dark:text-gray-400 text-lg leading-none">✕</span>
                </button>
              </div>
              <div className="overflow-y-auto px-6 py-4 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-lg shrink-0">
                    {selectedAppointment.studentName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedAppointment.studentName}</p>
                    <StatusBadge status={selectedAppointment.status} />
                  </div>
                </div>
                {[
                  { label: 'Counselor', value: selectedAppointment.counselorName },
                  { label: 'Date', value: selectedAppointment.date },
                  { label: 'Time', value: selectedAppointment.time },
                  { label: 'Type', value: selectedAppointment.type },
                  { label: 'Notes', value: selectedAppointment.notes },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide sm:w-48 shrink-0">{label}</span>
                    <span className="text-sm text-gray-800 dark:text-gray-200">{value || 'N/A'}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {appointments.length > 0 && (
          <div className="mt-4">
            <Pagination
              form={paginationForm}
              pagination={{
                currentPage,
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

