'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Filter, RotateCcw, Search, Eye, Edit, Trash, MoreVertical, UserCheck, X, Plus } from 'lucide-react';
import { ADToBS, BSToAD } from 'bikram-sambat-js';
import { api } from '@/utils/instance';
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import Pagination from "@/components/Pagination";
import { AppCombobox } from "@/components/Input/ComboBox";
import DateRangeFilter, { DateRangeFilterRef } from "@/components/DateFilter/FilterComponent";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import useErrorHandler from "@/components/helpers/ErrorHandling";
import { Toast } from "@/components/Toast/toast";

// ─── BS Date Helpers ───────────────────────────────────────────

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

function getBSDateDaysAgo(daysAgo: number): string {
  const d = getLocalToday();
  d.setDate(d.getDate() - daysAgo);
  return ADToBS(formatADDate(d));
}

function getFirstDayOfCurrentBSMonth(): string {
  const bsToday = getTodayBS();
  const [year, month] = bsToday.split('-');
  return `${year}-${month}-01`;
}

function getFirstDayOfCurrentBSYear(): string {
  const bsToday = getTodayBS();
  const [year] = bsToday.split('-');
  return `${year}-01-01`;
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Applicant {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  appliedProgram: string;
  status: 'pending' | 'approved' | 'rejected';
  passportNo?: string;
  targetCountry?: string;
}

interface ApiResponse {
  Items: Array<{
    id?: string;
    userId?: string;
    fullName?: string;
    name?: string;
    email?: string;
    contactNumber?: string;
    phone?: string;
    appliedProgram?: string;
    program?: string;
    status?: 'pending' | 'approved' | 'rejected';
    passportNo?: string;
    targetCountry?: string;
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

interface ConvertToStudentPayload {
  userId: string;
  universityName: string;
  visaId: string;
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

// ─── Status Style Helper ───────────────────────────────────────────────────────

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'rejected':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default:
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  }
};

// ─── Convert to Student Modal ──────────────────────────────────────────────────

interface ConvertToStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedApplicant: Applicant | null;
  onSuccess: () => void;
}

const ConvertToStudentModal = ({ isOpen, onClose, selectedApplicant, onSuccess }: ConvertToStudentModalProps) => {
  const [formData, setFormData] = useState<ConvertToStudentPayload>({ userId: '', universityName: '', visaId: '' });
  const [converting, setConverting] = useState(false);

  useEffect(() => {
    if (selectedApplicant) {
      setFormData({ userId: selectedApplicant.userId || selectedApplicant.id, universityName: '', visaId: '' });
    }
  }, [selectedApplicant]);

  if (!isOpen || !selectedApplicant) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setConverting(true);
      await api.post('/api/Enrolments/ConvertToStudents', formData);
      Toast.success(`Successfully converted ${selectedApplicant.name} to student!`);
      onSuccess();
      onClose();
    } catch (error: any) {
      Toast.error(`Error: ${error.response?.data?.message || error.message || 'Failed to convert to student'}`);
    } finally {
      setConverting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <UserCheck size={20} /> Convert to Student
                </h2>
                <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Converting{' '}
                <span className="font-semibold text-purple-600 dark:text-purple-400">{selectedApplicant.name}</span>{' '}
                to a student. Please provide the additional information below.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    University Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="universityName"
                    value={formData.universityName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Harvard University"
                    className="w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Visa ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="visaId"
                    value={formData.visaId}
                    onChange={handleChange}
                    required
                    placeholder="e.g., V-123456"
                    className="w-full px-4 py-2.5 border rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={converting}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg text-sm"
                  >
                    {converting ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Converting...
                      </>
                    ) : (
                      <><UserCheck size={16} /> Convert to Student</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Fixed-position Action Dropdown ───────────────────────────────────────────

interface ActionMenuProps {
  applicant: Applicant;
  onView: (applicant: Applicant) => void;
  onEdit: (applicant: Applicant) => void;
  onConvert: (applicant: Applicant) => void;
  onDelete: (id: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const ActionMenu = ({ applicant, onView, onEdit, onConvert, onDelete, canEdit = true, canDelete = true }: ActionMenuProps) => {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = 160;
    const menuWidth = 180;
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
    const handle = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const update = () => calculatePosition();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, calculatePosition]);

  return (
    <div className="flex justify-center">
      <button
        ref={buttonRef}
        onClick={toggle}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        title="Actions"
      >
        <MoreVertical size={18} className="text-gray-600 dark:text-gray-300" />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={menuStyle}
          className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1"
        >
          <button
            onClick={() => { onView(applicant); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Eye size={14} /> View Details
          </button>
          
          {canEdit && (
            <button
              onClick={() => { onEdit(applicant); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Edit size={14} /> Edit
            </button>
          )}
          
          <button
            onClick={() => { onConvert(applicant); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <UserCheck size={14} /> Convert to Student
          </button>
          
          {canDelete && (
            <button
              onClick={() => { onDelete(applicant.id); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
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

const AllApplicantsPage = () => {
  // ── Permissions ──
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);

  // ── State ──
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [conversionData, setConversionData] = useState<ConvertToStudentPayload>({
    userId: '',
    universityName: '',
    visaId: '',
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [params, setParams] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | undefined>(undefined);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // ── Forms ──
  const filterForm = useForm<FilterFormData>({
    defaultValues: {
      startDate: "",
      endDate: "",
      firstName: "",
    },
  });

  const paginationForm = useForm<SearchParam>({
    defaultValues: {
      pageSize: 10,
      pageIndex: 1,
      isPagination: true,
    },
  });

  // ── Refs ──
  const dateFilterRef = useRef<DateRangeFilterRef>(null);
  const { handleError, clearError } = useErrorHandler();

  // ── Pagination state ──
  const [paginationParams, setPaginationParams] = useState({
    pageSize: 10,
    pageIndex: 1,
    isPagination: true,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Build query string ──
  const buildQueryString = () => {
    const baseQuery = `?pageSize=${paginationParams.pageSize}&pageIndex=${paginationParams.pageIndex}&IsPagination=${paginationParams.isPagination}`;
    return baseQuery + (params || "");
  };

  // ── Fetch applicants ──
  const fetchApplicants = async (customParams?: string) => {
    try {
      setLoading(true);
      setError(null);

      const queryString = customParams || buildQueryString();
      const url = `/api/Enrolments/FilterApplicants${queryString}`;
      console.log('Fetching applicants:', url);

      const response = await api.get<ApiResponse>(url);
      const data = response.data;
      const items = data.Items || [];

      const formattedApplicants: Applicant[] = items.map((item: any, index: number) => ({
        id: item.id || item.userId || `temp-${index}`,
        userId: item.userId || item.id || `temp-${index}`,
        name: item.fullName || item.name || 'N/A',
        email: item.email || 'N/A',
        phone: item.contactNumber || item.phone || 'N/A',
        appliedProgram: item.appliedProgram || item.program || item.targetCountry || 'N/A',
        status: item.status || 'pending',
        passportNo: item.passportNo,
        targetCountry: item.targetCountry,
      }));

      setApplicants(formattedApplicants);
      setTotalItems(data.TotalItems ?? 0);
      setTotalPages(data.TotalPages ?? 1);
      setCurrentPage(data.PageIndex ?? paginationParams.pageIndex);
    } catch (error: any) {
      const errorMsg = handleError(error);
      setError(errorMsg);
      Toast.error('Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  // ── Initial fetch ──
  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationParams.pageIndex, paginationParams.pageSize, params]);

  // ── Handle filter submit ──
  const handleFilterSubmit = async (formData: FilterFormData) => {
    clearError();
    try {
      const queryParams = [
        formData.firstName
          ? `firstName=${encodeURIComponent(formData.firstName)}`
          : null,
        formData.startDate
          ? `startDate=${encodeURIComponent(formData.startDate)}`
          : null,
        formData.endDate
          ? `endDate=${encodeURIComponent(formData.endDate)}`
          : null,
      ]
        .filter(Boolean)
        .join("&");
      
      const fullQuery = queryParams ? `&${queryParams}` : "";
      
      await toast.promise(
        (async () => {
          setParams(fullQuery);
          setPaginationParams(prev => ({ ...prev, pageIndex: 1 }));
        })(),
        {
          loading: "Fetching applicants...",
          success: "Applicants fetched successfully!",
        }
      );
    } catch (error) {
      const errorMsg = handleError(error);
      Toast.error(errorMsg);
      console.error("Error during filter submission:", error);
    }
  };

  // ── Handle clear filter ──
  const onClearClick = () => {
    setParams("");
    dateFilterRef.current?.handleClear();
    setSelectedProfile(undefined);
    filterForm.reset();
    setPaginationParams(prev => ({ ...prev, pageIndex: 1 }));
    Toast.success('Filters cleared');
  };

  // ── Handle pagination ──
  const handleSearch = (params: SearchParam) => {
    params.pageSize = paginationParams.pageSize;
    setPaginationParams(params);
  };

  // ── Handle profile search ──
  const fetchUsers = async (search: string = "") => {
    setIsSearching(true);
    try {
      const response = await api.get<UserProfileResponse>(
        `/api/Enrolments/GetAllUserProfile?search=${encodeURIComponent(search)}`
      );
      if (response.data?.Items) {
        setSearchResults(response.data.Items);
      }
    } catch (error) {
      Toast.error('Failed to search profiles');
    } finally {
      setIsSearching(false);
    }
  };

  // ── Handle profile selection ──
  const handleProfileSelected = (profile: UserProfile | null) => {
    if (!profile) return;
    
    setSelectedProfile(profile);
    
    // Check if applicant already exists
    const existingApplicant = applicants.find(applicant => applicant.email === profile.email);
    if (existingApplicant) {
      Toast.success(`Profile ${profile.fullName} already exists in applicants`);
      const element = document.getElementById(`applicant-${existingApplicant.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('bg-yellow-100', 'dark:bg-yellow-900/30');
        setTimeout(() => element.classList.remove('bg-yellow-100', 'dark:bg-yellow-900/30'), 2000);
      }
    } else {
      // Add to filter and fetch
      filterForm.setValue('firstName', profile.fullName);
      handleFilterSubmit(filterForm.getValues());
      Toast.success(`Added ${profile.fullName} to applicants`);
    }
  };

  // ── Handle convert ──
  const handleConvertClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setConversionData({ userId: applicant.userId, universityName: '', visaId: '' });
    setShowConvertModal(true);
  };

  // ── Handle CRUD operations ──
  const handleDelete = async (id: string) => {
    try {
      // Add your delete API call here
      // await api.delete(`/api/Enrolments/${id}`);
      Toast.success('Applicant deleted successfully!');
      fetchApplicants();
    } catch (error) {
      Toast.error('Error deleting applicant.');
    }
  };

  const handleViewDetails = (applicant: Applicant) => {
    Toast.info(`Viewing details for ${applicant.name}`);
    // Add your view logic here
  };

  const handleEdit = (applicant: Applicant) => {
    // Add your edit logic here
    Toast.info(`Editing ${applicant.name}`);
  };

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
          {/* Header */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">All Applicants</h1>
            <div className="flex items-center space-x-3">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !font-bold"
              />

              {canAdd && (
                <ButtonElement
                  icon={<Plus size={24} />}
                  type="button"
                  text="Add New Applicant"
                  onClick={() => Toast.info('Add new applicant feature coming soon!')}
                  className="!text-md !font-bold !text-white"
                />
              )}
            </div>
          </div>

          {/* Filter Section */}
          {openFilter && (
            <div className="mb-6 mx-4 bg-white dark:bg-[#353535] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
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
                    label="Search Users"
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
                        {profile.email} • {profile.enrolmentType === 1 ? 'Student' : 'Partner'}
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
                  <th className="px-4 py-3 text-left w-[60px]">S.N</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Program / Country</th>
                  <th className="px-4 py-3 text-left">Passport No</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      Loading Applicants...
                    </td>
                  </tr>
                ) : applicants.length > 0 ? (
                  applicants.map((applicant, index) => (
                    <tr
                      key={applicant.id}
                      id={`applicant-${applicant.id}`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                    >
                      <td className="py-1 px-4">
                        {((currentPage - 1) * paginationParams.pageSize + index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="py-1 px-4 font-medium">{applicant.name}</td>
                      <td className="py-1 px-4">{applicant.email}</td>
                      <td className="py-1 px-4">{applicant.phone}</td>
                      <td className="py-1 px-4">{applicant.appliedProgram}</td>
                      <td className="py-1 px-4">{applicant.passportNo || '-'}</td>
                      <td className="py-1 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize font-medium ${getStatusStyle(applicant.status)}`}>
                          {applicant.status}
                        </span>
                      </td>
                      <td className="py-1 px-4">
                        <ActionMenu
                          applicant={applicant}
                          onView={handleViewDetails}
                          onEdit={handleEdit}
                          onConvert={handleConvertClick}
                          onDelete={handleDelete}
                          canEdit={canEdit}
                          canDelete={canDelete}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500 italic">
                      No applicants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modals */}
          {showConvertModal && selectedApplicant && (
            <ConvertToStudentModal
              isOpen={showConvertModal}
              onClose={() => setShowConvertModal(false)}
              selectedApplicant={selectedApplicant}
              onSuccess={() => {
                fetchApplicants();
              }}
            />
          )}
        </div>

        {/* Pagination */}
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

export default AllApplicantsPage;