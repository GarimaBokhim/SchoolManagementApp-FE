"use client";

import { useRef, useState } from 'react';
import { Filter, RotateCcw, Plus, X } from 'lucide-react';
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import Pagination from "@/components/Pagination";
import { AppCombobox } from "@/components/Input/ComboBox";
import DateRangeFilter from "@/components/DateFilter/FilterComponent";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import { Counselor } from '../types/ICounselor';
import { CounselorActionMenu } from './CounselorActionMenu';
import { useCounselorMutations } from '../hooks/useCounselorMutation';
import { AddCounselorModal } from './AddCounselorModel';


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

const MOCK_COUNSELORS: Counselor[] = [
  { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah.j@example.com', phone: '+1 234-567-8901', specialization: 'Career Counseling', status: 'Active', students: 24, joinDate: '2023-01-15' },
  { id: '2', name: 'Prof. Michael Chen', email: 'michael.c@example.com', phone: '+1 234-567-8902', specialization: 'Academic Advisor', status: 'Active', students: 18, joinDate: '2023-03-20' },
  { id: '3', name: 'Ms. Emily Rodriguez', email: 'emily.r@example.com', phone: '+1 234-567-8903', specialization: 'Mental Health', status: 'On Leave', students: 12, joinDate: '2022-11-10' },
  { id: '4', name: 'Dr. James Wilson', email: 'james.w@example.com', phone: '+1 234-567-8904', specialization: 'Study Abroad', status: 'Active', students: 21, joinDate: '2023-06-05' },
  { id: '5', name: 'Prof. Lisa Thompson', email: 'lisa.t@example.com', phone: '+1 234-567-8905', specialization: 'Research Guidance', status: 'Inactive', students: 0, joinDate: '2022-08-12' },
];

const MOCK_SEARCH_RESULTS = [
  { id: '1', fullName: 'Dr. Sarah Johnson', email: 'sarah.j@example.com', status: 'Active' },
  { id: '2', fullName: 'Prof. Michael Chen', email: 'michael.c@example.com', status: 'Active' },
  { id: '3', fullName: 'Ms. Emily Rodriguez', email: 'emily.r@example.com', status: 'On Leave' },
  { id: '4', fullName: 'Dr. James Wilson', email: 'james.w@example.com', status: 'Active' },
  { id: '5', fullName: 'Prof. Lisa Thompson', email: 'lisa.t@example.com', status: 'Inactive' },
];

const AllCounselorsForm = () => {
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);

  const [counselors] = useState<Counselor[]>(MOCK_COUNSELORS);
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [searchResults, setSearchResults] = useState(MOCK_SEARCH_RESULTS);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);

  const dateFilterRef = useRef<any>(null);

  const refetch = () => {};

  const { handleAdd, handleDelete, handleEdit } = useCounselorMutations(refetch);

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

  const handleView = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
    setShowDetailModal(true);
  };

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

          {/* Header */}
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
                  <th className="px-4 py-3 text-left">Counselor Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Specialization</th>
                  <th className="px-4 py-3 text-left">Students</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center w-[80px]">Actions</th>
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
                        <CounselorActionMenu
                          counselor={counselor}
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
                      No counselors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Counselor Modal */}
        <AddCounselorModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAdd}
        />

        {/* View Detail Modal */}
        {showDetailModal && selectedCounselor && (
          <div
            className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
            onClick={() => setShowDetailModal(false)}
          >
            <div
              className="relative bg-white dark:bg-[#353535] rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Counselor Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={18} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <div className="overflow-y-auto px-6 py-4 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-lg shrink-0">
                    {selectedCounselor.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{selectedCounselor.name}</p>
                    <StatusBadge status={selectedCounselor.status} />
                  </div>
                </div>
                {[
                  { label: 'Email', value: selectedCounselor.email },
                  { label: 'Phone', value: selectedCounselor.phone },
                  { label: 'Specialization', value: selectedCounselor.specialization },
                  { label: 'Students', value: String(selectedCounselor.students) },
                  { label: 'Join Date', value: selectedCounselor.joinDate },
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
        {counselors.length > 0 && (
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

export default AllCounselorsForm;