'use client';

import { useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { usePermissions } from '@/context/auth/PermissionContext';
import useMenuPermissionData from '@/app/SuperAdmin/navigation/hooks/useMenuPermissionData';
import { useGetAllSchool } from '@/app/admin/Setup/School/hooks';
import Pagination from '@/components/Pagination';
import { useStudentMutations } from './hooks/useStudentMutations';
import { StudentsTable } from './components/StudentsTable';
import { useStudents } from './hooks/useStudent';
import { useStudentFilters } from './hooks/useStudentFilter';
import { SearchParam } from '../applicants/types';
import { Student } from './type/studnets';
import { StudentsHeader } from './components/StudentHeader';
import { StudentsFilter } from './components/StudentFilder';
import { StudentDetailModal } from './model/StudentDetailModel';


const AllStudentsPage = () => {
  // ── Permissions ──
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);

  // ── Schools ──
  const { data: allSchools } = useGetAllSchool();

  // ── Students data & pagination ──
  const {
    students,
    loading,
    error,
    params,
    setParams,
    paginationParams,
    setPaginationParams,
    totalPages,
    currentPage,
    fetchStudents,
  } = useStudents(allSchools);

  // ── Filters ──
  const {
    openFilter,
    setOpenFilter,
    filterForm,
    dateFilterRef,
    selectedProfile,
    searchResults,
    isSearching,
    handleFilterSubmit,
    fetchUsers,
    handleProfileSelected,
    onClearClick,
  } = useStudentFilters(setParams, setPaginationParams);

  // ── Mutations ──
  const { handleDelete, handleEdit } = useStudentMutations(fetchStudents);

  // ── Detail modal state ──
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // ── Pagination form ──
  const paginationForm = useForm<SearchParam>({
    defaultValues: {
      pageSize: 10,
      pageIndex: 1,
      isPagination: true,
    },
  });

  // ── Handlers ──
  const handleViewClick = (student: Student) => {
    setSelectedStudentId(student.userId ?? student.id);
    setShowDetailModal(true);
  };

  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
  };

  // ── Loading state ──
  if (!allSchools) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading schools data...</div>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="p-6">
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

          <StudentsHeader
            onToggleFilter={() => setOpenFilter(!openFilter)}
            canAdd={canAdd}
          />

          <StudentsFilter
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

          <StudentsTable
            students={students}
            loading={loading}
            currentPage={currentPage}
            pageSize={paginationParams.pageSize}
            onView={handleViewClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canEdit={canEdit}
            canDelete={canDelete}
          />

          <StudentDetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedStudentId(null);
            }}
            studentId={selectedStudentId}
          />

        </div>

        {!loading && students.length > 0 && (
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

export default AllStudentsPage;