/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { Filter, RotateCcw, Eye, Edit, Trash, MoreVertical, Plus } from 'lucide-react';
import { ADToBS } from 'bikram-sambat-js';
import { api } from '@/utils/instance';
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import Pagination from "@/components/Pagination";
import { AppCombobox } from "@/components/Input/ComboBox";
import DateRangeFilter, { DateRangeFilterRef } from "@/components/DateFilter/FilterComponent";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";
import { useGetAllSchool } from "@/app/admin/Setup/School/hooks";
import { ViewStudentDetailModal } from '../../student/components/ViewStudentDetailModel';

function getLocalToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatADDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getTodayBS(): string {
  return ADToBS(formatADDate(getLocalToday()));
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface School {
  id: string;
  name: string;
}

interface Student {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  enrolmentType: number;
  universityName: string;
  visaId: string;
  isActive: boolean;
  schoolId: string;
  schoolName?: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

interface ApiResponse {
  Items: Array<{
    userId: string;
    fullName: string;
    email: string;
    enrolmentType: number;
    universityName: string;
    visaId: string;
    isActive: boolean;
    schoolId: string;
    createdBy: string;
    createdAt: string;
    modifiedBy: string;
    modifiedAt: string;
  }>;
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
  FirstPage: number;
  LastPage: number;
}

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  enrolmentType: number;
  createdAt: string;
  contactNumber?: string;
  source?: string;
}

interface UserProfileResponse {
  Items: UserProfile[];
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
  FirstPage: number;
  LastPage: number;
}

interface FilterFormData {
  startDate: string;
  endDate: string;
  firstName?: string;
}

interface SearchParam {
  pageSize: number;
  pageIndex: number;
  isPagination: boolean;
}

// ─── Enrolment Badge ──────────────────────────────────────────────────────────
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

// ─── Fixed-position Action Dropdown ───────────────────────────────────────────
interface ActionMenuProps {
  student: Student;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (userId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const ActionMenu = ({ student, onView, onEdit, onDelete, canEdit = true, canDelete = true }: ActionMenuProps) => {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = 110;
    const menuWidth = 176;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight + 8;
    setMenuStyle({
      position: 'fixed',
      right: window.innerWidth - rect.right,
      top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
      width: menuWidth,
      zIndex: 9999,
    });
  }, []);

  const toggle = () => {
    if (!open) calculatePosition();
    setOpen(prev => !prev);
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const updatePosition = () => calculatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, calculatePosition]);

  return (
    <div className="flex justify-center">
      <button
        ref={buttonRef}
        onClick={toggle}
        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
        title="Actions"
      >
        <MoreVertical size={18} className="text-gray-600 dark:text-gray-300" />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={menuStyle}
          className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 animate-in fade-in zoom-in-95 duration-100"
        >
          <button
            onClick={() => { onView(student); setOpen(false); }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            View Details
          </button>

          {canEdit && (
            <button
              onClick={() => { onEdit(student); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Edit size={14} className="text-amber-500" /> Edit
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this student?')) {
                  onDelete(student.userId);
                }
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Trash size={14} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AllCrmStudentsForm = () => {
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);
  const { data: allSchools, isLoading: schoolsLoading } = useGetAllSchool();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [params, setParams] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStudentUserId, setSelectedStudentUserId] = useState<string | null>(null);

  const filterForm = useForm<FilterFormData>({
    defaultValues: { startDate: "", endDate: "", firstName: "" },
  });

  const paginationForm = useForm<SearchParam>({
    defaultValues: { pageSize: 10, pageIndex: 1, isPagination: true },
  });

  const dateFilterRef = useRef<DateRangeFilterRef>(null);
  const { handleError, clearError } = useErrorHandler();

  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Fetch students ──
  useEffect(() => {
    if (!allSchools) return;

    const queryString =
      `?pageSize=${paginationParams.pageSize}` +
      `&pageIndex=${paginationParams.pageIndex}` +
      `&IsPagination=${paginationParams.isPagination}` +
      (params || "");

    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get<ApiResponse>(`/api/Enrolments/FilterCRMStudents${queryString}`);

        if (cancelled) return;

        const data = response.data;
        const items = data.Items || [];

        const formattedStudents: Student[] = items.map((item) => ({
          id: item.userId,
          userId: item.userId,
          fullName: item.fullName || '-',
          email: item.email || '-',
          enrolmentType: item.enrolmentType,
          universityName: item.universityName || '-',
          visaId: item.visaId || '-',
          isActive: item.isActive,
          schoolId: item.schoolId,
          createdBy: item.createdBy,
          createdAt: item.createdAt,
          modifiedBy: item.modifiedBy,
          modifiedAt: item.modifiedAt,
        }));

        setStudents(formattedStudents);
        setTotalPages(data.TotalPages ?? 1);
        setCurrentPage(data.PageIndex ?? paginationParams.pageIndex);
      } catch (error: any) {
        if (cancelled) return;
        const errorMsg = handleError(error);
        setError(errorMsg);
        Toast.error('Failed to fetch students');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => { cancelled = true; };
  }, [
    paginationParams.pageIndex,
    paginationParams.pageSize,
    paginationParams.isPagination,
    params,
    allSchools,
    refreshKey,
  ]);

  const handleFilterSubmit = async (formData: FilterFormData) => {
    clearError();
    try {
      const queryParams = [
        formData.firstName?.trim() ? `firstName=${encodeURIComponent(formData.firstName.trim())}` : null,
        formData.startDate ? `startDate=${encodeURIComponent(formData.startDate)}` : null,
        formData.endDate ? `endDate=${encodeURIComponent(formData.endDate)}` : null,
      ]
        .filter(Boolean)
        .join("&");

      const fullQuery = queryParams ? `&${queryParams}` : "";

      setParams(fullQuery);
      setPaginationParams(prev => ({ ...prev, pageIndex: 1 }));
      Toast.success("Students fetched successfully!");
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
    }
  };

  const onClearClick = () => {
    setParams("");
    dateFilterRef.current?.handleClear();
    setSelectedProfile(undefined);
    filterForm.reset();
    setPaginationParams(prev => ({ ...prev, pageIndex: 1 }));
    Toast.success('Filters cleared');
  };

  const handleSearch = (searchParams: SearchParam) => {
    setPaginationParams({
      pageSize: searchParams.pageSize || paginationParams.pageSize,
      pageIndex: searchParams.pageIndex,
      isPagination: true,
    });
  };

  const fetchUsers = async (search: string = "") => {
    setIsSearching(true);
    try {
      const response = await api.get<UserProfileResponse>(
        `/api/Enrolments/GetAllUserProfile?search=${encodeURIComponent(search)}`
      );
      if (response.data?.Items) {
        setSearchResults(response.data.Items);
      }
    } catch {
      Toast.error('Failed to search profiles');
    } finally {
      setIsSearching(false);
    }
  };

  const handleProfileSelected = (profile: UserProfile | null) => {
    if (!profile) return;
    setSelectedProfile(profile);
    filterForm.setValue('firstName', profile.fullName);
    handleFilterSubmit(filterForm.getValues());
  };

  const handleDelete = async (userId: string) => {
    try {
      Toast.success('Student deleted successfully!');
      setRefreshKey(k => k + 1);
    } catch {
      Toast.error('Error deleting student.');
    }
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudentUserId(student.userId);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    Toast.info(`Editing student: ${student.universityName}`);
  };

  const handleAddNew = () => {
    Toast.info('Add new student feature coming soon!');
  };

  if (schoolsLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin"></div>
            <div className="text-gray-500 dark:text-gray-400">Loading schools data...</div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="bg-white dark:bg-[#353535] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">

          {/* Header */}
          <div className="flex flex-col sm:flex-row w-full justify-between p-4 px-4 sm:px-6 gap-4 items-start sm:items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">All Students</h1>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !font-bold !px-4 !py-2 !text-sm !rounded-lg transition-all duration-150"
              />
              {canAdd && (
                <ButtonElement
                  icon={<Plus size={20} />}
                  type="button"
                  text="Add Student"
                  onClick={handleAddNew}
                  className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !font-bold !px-4 !py-2 !text-sm !rounded-lg transition-all duration-150"
                />
              )}
            </div>
          </div>

          {/* Filter Section */}
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
                  setParams={setParams}
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
                        {profile.email} • {profile.enrolmentType === 3 ? 'Student' : profile.enrolmentType === 2 ? 'Applicant' : 'Lead'}
                      </div>
                    )}
                  />
                </div>

                <div className="flex gap-2 ml-auto">
                  <ButtonElement
                    type="submit"
                    text="Apply"
                    icon={<Filter size={14} />}
                    className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !px-4 !py-2 !text-sm !rounded-lg transition-all duration-150"
                  />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={onClearClick}
                    className="!bg-gray-500 hover:!bg-gray-600 !text-white !px-4 !py-2 !text-sm !rounded-lg transition-all duration-150"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-200 uppercase text-xs font-semibold border-b border-gray-200 dark:border-gray-700">
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
                    <td colSpan={7} className="p-8 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <div className="w-5 h-5 border-2 border-gray-300 border-t-emerald-600 rounded-full animate-spin"></div>
                        <span className="text-gray-500 dark:text-gray-400">Loading students...</span>
                      </div>
                    </td>
                  </tr>
                ) : students.length > 0 ? (
                  students.map((student, index) => (
                    <tr
                      key={student.userId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      <td className="py-2 px-4">
                        {((currentPage - 1) * paginationParams.pageSize + index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="py-2 px-4 font-medium">{student.fullName}</td>
                      <td className="py-2 px-4">{student.email}</td>
                      <td className="py-2 px-4">
                        <EnrolmentBadge type={student.enrolmentType} />
                      </td>
                      <td className="py-2 px-4">{student.visaId}</td>
                      <td className="py-2 px-4">{student.universityName}</td>
                      <td className="py-2 px-4">
                        <ActionMenu
                          student={student}
                          onView={handleViewDetails}
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
                    <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400 italic">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
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

      {/* Student Detail Modal */}
      <ViewStudentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStudentUserId(null);
        }}
        studentUserId={selectedStudentUserId}
      />
    </>
  );
};

export default AllCrmStudentsForm;