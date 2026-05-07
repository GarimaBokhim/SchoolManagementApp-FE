"use client";

import { useRef, useState } from 'react';
import { Filter, RotateCcw, Plus } from 'lucide-react';
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import Pagination from "@/components/Pagination";
import { AppCombobox } from "@/components/Input/ComboBox";
import DateRangeFilter, { DateRangeFilterRef } from "@/components/DateFilter/FilterComponent";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import { Toast } from "@/components/Toast/toast";
import { useGetAllSchool } from "@/app/admin/Setup/School/hooks";
import { SearchParam, Student } from '../type/IStudents';
import { ActionMenu } from '../components/ActionMenu';
import { StudentDetailModal } from '../model/StudentDetailModel';
import { useStudentFilters, useStudentMutations, useStudents } from '../hooks';

const ENROLMENT_TYPE_LABELS: Record<number, string> = {
  1: 'Lead',
  2: 'Applicant',
  3: 'Student',
};

const EnrolmentBadge = ({ type }: { type?: number }) => {
  if (!type) return <span>-</span>;
  const label = ENROLMENT_TYPE_LABELS[type] ?? 'Unknown';
  const colorMap: Record<number, string> = {
    1: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    2: 'bg-blue-100 text-blue-700 border border-blue-300',
    3: 'bg-green-100 text-green-700 border border-green-300',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorMap[type] ?? 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  );
};

const AllCrmStudentsForm = () => {
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);
  const { data: allSchools, isLoading: schoolsLoading } = useGetAllSchool();

  const {
    students,
    loading,
    isFetching,
    error,
    paginationParams,
    setPaginationParams,
    totalPages,
    currentPage,
    setParams,
    fetchStudents,
  } = useStudents(allSchools);

  const {
    openFilter,
    setOpenFilter,
    filterForm,
    dateFilterRef,
    selectedProfile,
    searchResults,
    handleFilterSubmit,
    fetchUsers,
    handleProfileSelected,
    onClearClick,
  } = useStudentFilters(setParams, setPaginationParams);

  // Use the real mutations hook so delete actually calls the API
  const { handleDelete, handleEdit } = useStudentMutations(fetchStudents);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const paginationForm = useForm<SearchParam>({
    defaultValues: { pageSize: 10, pageIndex: 1, isPagination: true },
  });

  const handleSearch = (searchParams: SearchParam) => {
    setPaginationParams({
      pageSize: searchParams.pageSize || paginationParams.pageSize,
      pageIndex: searchParams.pageIndex,
      isPagination: true,
    });
  };

  const handleView = (student: Student) => {
    setSelectedStudentId(student.userId);
    setShowDetailModal(true);
  };

  const handleAddNew = () => {
    Toast.info('Add new student feature coming soon!');
  };

  if (schoolsLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading schools data...</div>
      </div>
    );
  }

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

          {/* Updated header section to match first component */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold">All Students</h1>
            <div className="flex items-center space-x-3">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700"
              />
              {canAdd && (
                <ButtonElement
                  icon={<Plus size={24} />}
                  type="button"
                  text="Add New Student"
                  onClick={handleAddNew}
                  className="!text-md !font-bold"
                />
              )}
            </div>
          </div>

          {openFilter && (
            <div className="mb-6 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <form
                onSubmit={filterForm.handleSubmit(handleFilterSubmit)}
                className="flex flex-wrap items-end gap-4 md:gap-6"
              >
                <DateRangeFilter
                  ref={dateFilterRef}
                  form={filterForm}
                  onSubmit={handleFilterSubmit}
                  setParams={setParams}
                />
                <div className="flex-1 min-w-[240px]">
                  <AppCombobox
                    value={selectedProfile?.fullName || ""}
                    dropDownWidth="w-full"
                    dropdownPositionClass="absolute"
                    label="Applicant Name"
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
                        {profile.email} •{' '}
                        {profile.enrolmentType === 3
                          ? 'Student'
                          : profile.enrolmentType === 2
                            ? 'Applicant'
                            : 'Lead'}
                      </div>
                    )}
                  />
                </div>
                <div className="flex gap-2 ml-auto">
                  <ButtonElement
                    type="submit"
                    text="Filter"
                    icon={<Filter size={14} />}
                    className="!bg-emerald-600 hover:!bg-emerald-700 transition-all duration-150"
                  />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={onClearClick}
                    className="!bg-gray-500 hover:!bg-gray-600 transition-all duration-150"
                  />
                </div>
              </form>
            </div>
          )}

          <div className="overflow-x-auto relative">
            {isFetching && (
              <div className="absolute inset-0 z-10 bg-white/50 dark:bg-black/30 flex items-center justify-center backdrop-blur-[1px]">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <table
              className={`w-full border-collapse text-xs sm:text-sm transition-opacity duration-150 ${isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
                }`}
            >
              <thead>
                <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
                  <th className="px-4 py-3 text-left w-[60px]">S.N</th>
                  <th className="px-4 py-3 text-left">Full Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Enrolment Type</th>
                  <th className="px-4 py-3 text-left">Visa ID</th>
                  <th className="px-4 py-3 text-left">University Name</th>
                  <th className="px-4 py-3 text-center w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Loading Students...
                    </td>
                  </tr>
                ) : students.length > 0 ? (
                  students.map((student, index) => (
                    <tr
                      key={student.userId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                    >
                      <td className="py-1 px-4">
                        {(currentPage - 1) * paginationParams.pageSize + index + 1}
                      </td>
                      <td className="py-1 px-4 font-medium">{student.fullName}</td>
                      <td className="py-1 px-4">{student.email}</td>
                      <td className="py-1 px-4">
                        <EnrolmentBadge type={student.enrolmentType} />
                      </td>
                      <td className="py-1 px-4">{student.visaId}</td>
                      <td className="py-1 px-4">{student.universityName}</td>
                      <td className="py-1 px-4">
                        <ActionMenu
                          student={student}
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
                    <td colSpan={7} className="p-4 text-center text-gray-500 italic">
                      No Students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <StudentDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedStudentId(null);
          }}
          studentId={selectedStudentId}
        />

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

export default AllCrmStudentsForm;