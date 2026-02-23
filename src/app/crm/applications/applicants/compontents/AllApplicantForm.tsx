"use client";

import { useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { usePermissions } from '@/context/auth/PermissionContext';
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData';
import { useGetAllSchool } from '@/app/admin/Setup/School/hooks';
import Pagination from '@/components/Pagination';
import { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent';
import { useApplicants } from '../hooks/useApplicants';
import { useApplicantFilters } from '../hooks/useApplicantFilters';
import { useApplicantMutations } from '../hooks/useApplicantMutations';
import { Applicant, SearchParam } from '../types';
import { ConvertToStudentModal } from './ConvertToStudentModel';
import { ApplicantDetailModal } from '../model/ApplicantDetailModel';
import { ApplicantsFilter } from './applicant_ui_components/ApplicantsFilter';
import { ApplicantsHeader } from './applicant_ui_components/ApplicantsHeader';
import { ApplicantsTable } from './applicant_ui_components/ApplicantsTable';

const AllApplicantsForm = () => {
  // ── Permissions ──
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);

  // ── Get all schools data ──
  const { data: allSchools } = useGetAllSchool();

  const dateFilterRef = useRef<DateRangeFilterRef>(null) as React.RefObject<DateRangeFilterRef>;

  // ── Main applicants state and fetching ──
  const {
    applicants,
    loading,
    error,
    paginationParams,
    setPaginationParams,
    totalPages,
    currentPage,
    setParams,
    fetchApplicants,
  } = useApplicants(allSchools);

  // ── Filter state and handlers ──
  const {
    openFilter,
    setOpenFilter,
    filterForm,
    selectedProfile,
    searchResults,
    isSearching,
    handleFilterSubmit,
    fetchUsers,
    handleProfileSelected,
    onClearClick,
  } = useApplicantFilters(setParams, setPaginationParams);

  // ── Mutations ──
  const {
    handleDelete,
    handleEdit,
  } = useApplicantMutations(fetchApplicants);

  // ── Convert modal state ──
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  // ── Detail modal state ──
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);

  // ── Pagination form ──
  const paginationForm = useForm<SearchParam>({
    defaultValues: {
      pageSize: 10,
      pageIndex: 1,
      isPagination: true,
    },
  });

  // ── Handlers ──
  const handleConvertClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setShowConvertModal(true);
  };

  const handleViewClick = (applicant: Applicant) => {
    setSelectedApplicantId(applicant.userId ?? applicant.id);
    setShowDetailModal(true);
  };

  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
  };

  // ── Loading state while schools are being fetched ──
  if (!allSchools) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading schools data...</div>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Toaster position="top-right" />
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <ApplicantsHeader
            onToggleFilter={() => setOpenFilter(!openFilter)}
            canAdd={canAdd}
          />

          <ApplicantsFilter
            openFilter={openFilter}
            filterForm={filterForm}
            dateFilterRef={dateFilterRef}
            selectedProfile={selectedProfile}
            searchResults={searchResults}
            isSearching={isSearching}
            onFilterSubmit={handleFilterSubmit}
            onProfileSelected={handleProfileSelected}
            onFetchUsers={fetchUsers}
            onClear={onClearClick}
            setParams={setParams}
          />

          <ApplicantsTable
            applicants={applicants}
            loading={loading}
            currentPage={currentPage}
            pageSize={paginationParams.pageSize}
            onView={handleViewClick}
            onEdit={handleEdit}
            onConvert={handleConvertClick}
            onDelete={handleDelete}
            canEdit={canEdit}
            canDelete={canDelete}
          />

          <ConvertToStudentModal
            isOpen={showConvertModal}
            onClose={() => setShowConvertModal(false)}
            selectedApplicant={selectedApplicant}
            onSuccess={fetchApplicants}
          />

          <ApplicantDetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedApplicantId(null);
            }}
            applicantId={selectedApplicantId}
          />
        </div>

        {!loading && applicants.length > 0 && (
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

export default AllApplicantsForm;