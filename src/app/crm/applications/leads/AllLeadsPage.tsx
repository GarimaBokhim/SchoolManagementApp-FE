"use client";

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Toaster } from 'react-hot-toast';
import { usePermissions } from '@/context/auth/PermissionContext';
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData';
import Pagination from '@/components/Pagination';
import AddLeadModal from './model/AddLeadFormModel';
import ConvertToApplicantModal from './model/ConvertToApplicationModel';
import DateRangeFilter, { DateRangeFilterRef } from '@/components/DateFilter/FilterComponent';
import { LeadsHeader } from './components/LeadsHeader';
import { useLeads } from './hooks/useLeads';
import { useLeadFilters } from './hooks/useLeadFilters';
import { useLeadMutations } from './hooks/useLeadsMutations';
import { ConvertToApplicantPayload, Lead, SearchParam } from './types';
import { LeadsFilter } from './components/LeadsFilter';
import { LeadsTable } from './components/LeadsTable';
import { LeadDetailModal } from './components/LeadDetailModel';

const AllLeadsPage = () => {
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);

  const dateFilterRef = useRef<DateRangeFilterRef>(null);

  // ✅ Single lead override: when a user is picked from search, show only this lead
  const [singleLead, setSingleLead] = useState<Lead | null>(null);

  const paginationForm = useForm<SearchParam>({
    defaultValues: {
      pageSize: 10,
      pageIndex: 1,
      isPagination: true,
    },
  });

  const {
    leads,
    loading,
    error,
    paginationParams,
    setPaginationParams,
    totalPages,
    currentPage,
    params,
    setParams,
    fetchLeads,
  } = useLeads();

  const {
    openFilter,
    setOpenFilter,
    filterForm,
    selectedProfile,
    setSelectedProfile,
    searchResults,
    isSearching,
    handleFilterSubmit,
    fetchUsers,
    handleProfileSelected,
    onClearClick,
  } = useLeadFilters(setParams, setPaginationParams, setSingleLead); // ✅ pass setSingleLead

  const { convertingId, handleDelete, handleConvert } = useLeadMutations(fetchLeads);

  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [conversionData, setConversionData] = useState<ConvertToApplicantPayload>({
    userId: '',
    passportNo: '',
    targetCountry: '',
  });

  const handleConvertClick = (lead: Lead) => {
    setSelectedLead(lead);
    setConversionData({ userId: lead.userId, passportNo: '', targetCountry: '' });
    setShowConvertModal(true);
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedUserId(lead.userId);
    setShowDetailModal(true);
  };

  const handleConversionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConversionData(prev => ({ ...prev, [name]: value }));
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    const success = await handleConvert(selectedLead, conversionData);
    if (success) {
      setShowConvertModal(false);
    }
  };

  const handleEdit = (lead: Lead) => {
    // Handle edit logic
  };

  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
  };

  const handleLeadSuccess = () => {
    fetchLeads();
    setIsAddLeadModalOpen(false);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedUserId(null);
  };

  // ✅ If a single lead is selected from search, show only that; otherwise show full list
  const displayedLeads = singleLead ? [singleLead] : leads;

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
          <LeadsHeader
            onToggleFilter={() => setOpenFilter(!openFilter)}
            onAddNew={() => setIsAddLeadModalOpen(true)}
          />

          {openFilter && (
            <LeadsFilter
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
          )}

          {/* ✅ Pass displayedLeads instead of leads */}
          <LeadsTable
            leads={displayedLeads}
            loading={loading}
            currentPage={currentPage}
            pageSize={paginationParams.pageSize}
            onView={handleViewDetails}
            onEdit={handleEdit}
            onConvert={handleConvertClick}
            onDelete={handleDelete}
            canEdit={canEdit}
            canDelete={canDelete}
          />

          <AddLeadModal
            isOpen={isAddLeadModalOpen}
            onClose={() => setIsAddLeadModalOpen(false)}
            onSuccess={handleLeadSuccess}
          />

          {showConvertModal && selectedLead && (
            <ConvertToApplicantModal
              isOpen={showConvertModal}
              onClose={() => setShowConvertModal(false)}
              selectedLead={selectedLead}
              conversionData={conversionData}
              convertingId={convertingId}
              onInputChange={handleConversionInputChange}
              onSubmit={handleConvertSubmit}
            />
          )}

          <LeadDetailModal
            isOpen={showDetailModal}
            onClose={handleCloseDetailModal}
            userId={selectedUserId}
          />
        </div>

        {/* ✅ Hide pagination when a single lead is displayed */}
        {!loading && !singleLead && leads.length > 0 && (
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

export default AllLeadsPage;