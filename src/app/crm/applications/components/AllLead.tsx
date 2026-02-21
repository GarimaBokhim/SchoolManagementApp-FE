"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { Plus, Filter, RotateCcw, Edit, Trash, Eye, User, MoreVertical } from 'lucide-react';
import { ADToBS, BSToAD } from 'bikram-sambat-js';
import { api } from '@/utils/instance';
import ConvertToApplicantModal from '../model/ConvertToApplicationModel';
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import AddLeadModal from '../model/AddLeadFormModel';
import Pagination from "@/components/Pagination";
import { useForm } from "react-hook-form";
import { EditButton } from "@/components/Buttons/EditButton";
import DeleteButton from "@/components/Buttons/DeleteButton";
import DateRangeFilter, { DateRangeFilterRef } from "@/components/DateFilter/FilterComponent";
import { AppCombobox } from "@/components/Input/ComboBox";
import { usePermissions } from "@/context/auth/PermissionContext";
import useMenuPermissionData from "@/app/SuperAdmin/navigation/hooks/useMenuPermissionData";
import useErrorHandler from "@/components/helpers/ErrorHandling";

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

interface Lead {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  educationLevel: number;
  completionYear: string;
}

interface ApiResponse {
  Items: Array<{
    userId: string;
    fullName: string;
    email: string;
    dateOfBirth: string;
    gender: number;
    contactNumber: string;
    permanentAddress: string;
    educationLevel: number;
    completionYear: string;
    currentGpa: string;
    previousAcademicQualification: string;
    source: string;
    feedBackOrSuggestion: string;
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

interface ConvertToApplicantPayload {
  userId: string;
  passportNo: string;
  targetCountry: string;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getEducationLevelText = (level: number): string => {
  switch (level) {
    case 1: return 'Intermediate';
    case 2: return 'Bachelor';
    case 3: return 'Masters';
    default: return 'Not Specified';
  }
};

// ── Fixed-position Action Dropdown ───────────────────────────────────────────

interface ActionMenuProps {
  lead: Lead;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onConvert: (lead: Lead) => void;
  onDelete: (id: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const ActionMenu = ({ lead, onView, onEdit, onConvert, onDelete, canEdit = true, canDelete = true }: ActionMenuProps) => {
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
            onClick={() => { onView(lead); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Eye size={14} /> View Details
          </button>
          
          {canEdit && (
            <button
              onClick={() => { onEdit(lead); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Edit size={14} /> Edit
            </button>
          )}
          
          <button
            onClick={() => { onConvert(lead); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <User size={14} /> Convert to Applicant
          </button>
          
          {canDelete && (
            <button
              onClick={() => { onDelete(lead.id); setOpen(false); }}
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

// ── Main Page ────────────────────────────────────────────────────────────────

const AllLeadsPage = () => {
  // ── Permissions ──
  const { menuStatus } = usePermissions();
  const { canEdit, canDelete, canAdd } = useMenuPermissionData(menuStatus);

  // ── State ──
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [conversionData, setConversionData] = useState<ConvertToApplicantPayload>({
    userId: '',
    passportNo: '',
    targetCountry: '',
  });
  const [openFilter, setOpenFilter] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
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

  // ── Fetch leads ──
  const fetchLeads = async (customParams?: string) => {
    try {
      setLoading(true);
      setError(null);

      const queryString = customParams || buildQueryString();
      const url = `/api/Enrolments/FilterInquery${queryString}`;
      console.log('Fetching leads:', url);

      const response = await api.get<ApiResponse>(url);
      const data = response.data;
      const items = data.Items || [];

      const formattedLeads: Lead[] = items.map((item: any) => ({
        id: item.userId || Math.random().toString(),
        userId: item.userId,
        name: item.fullName || 'N/A',
        email: item.email || 'N/A',
        phone: item.contactNumber || 'N/A',
        source: item.source || 'website',
        educationLevel: item.educationLevel || 0,
        completionYear: item.completionYear || 'N/A',
      }));

      setLeads(formattedLeads);
      setTotalItems(data.TotalItems ?? 0);
      setTotalPages(data.TotalPages ?? 1);
      setCurrentPage(data.PageIndex ?? paginationParams.pageIndex);
    } catch (error: any) {
      const errorMsg = handleError(error);
      setError(errorMsg);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  // ── Initial fetch ──
  useEffect(() => {
    fetchLeads();
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
          loading: "Fetching leads...",
          success: "Leads fetched successfully!",
        }
      );
    } catch (error) {
      const errorMsg = handleError(error);
      toast.error(errorMsg);
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
    toast.success('Filters cleared');
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
      toast.error('Failed to search profiles');
    } finally {
      setIsSearching(false);
    }
  };

  // ── Handle profile selection ──
  const handleProfileSelected = (profile: UserProfile | null) => {
    if (!profile) return;
    
    setSelectedProfile(profile);
    
    // Check if lead already exists
    const existingLead = leads.find(lead => lead.email === profile.email);
    if (existingLead) {
      toast.success(`Profile ${profile.fullName} already exists in leads`);
      const element = document.getElementById(`lead-${existingLead.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('bg-yellow-100', 'dark:bg-yellow-900/30');
        setTimeout(() => element.classList.remove('bg-yellow-100', 'dark:bg-yellow-900/30'), 2000);
      }
    } else {
      // Add to filter and fetch
      filterForm.setValue('firstName', profile.fullName);
      handleFilterSubmit(filterForm.getValues());
      toast.success(`Added ${profile.fullName} to leads`);
    }
  };

  // ── Handle convert ──
  const handleConvertClick = (lead: Lead) => {
    setSelectedLead(lead);
    setConversionData({ userId: lead.userId, passportNo: '', targetCountry: '' });
    setShowConvertModal(true);
  };

  const handleConversionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConversionData(prev => ({ ...prev, [name]: value }));
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    try {
      setConvertingId(selectedLead.id);
      await api.post('/api/Enrolments/ConvertToApplicant', conversionData);
      toast.success(`Successfully converted ${selectedLead.name} to applicant!`);
      setShowConvertModal(false);
      fetchLeads(); // Refresh the list
    } catch (error: any) {
      const errorMsg = handleError(error);
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setConvertingId(null);
    }
  };

  // ── Handle CRUD operations ──
  const handleDelete = async (id: string) => {
    try {
      // Add your delete API call here
      // await api.delete(`/api/Enrolments/${id}`);
      toast.success('Lead deleted successfully!');
      fetchLeads();
    } catch (error) {
      toast.error('Error deleting lead.');
    }
  };

  // ── Handle successful lead creation ──
  const handleLeadSuccess = () => {
    fetchLeads(); // Refresh the leads list
    setIsAddLeadModalOpen(false);
    toast.success('Lead added successfully!');
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


  function handleViewDetails(lead: Lead): void {
    throw new Error('Function not implemented.');
  }

  function handleEdit(lead: Lead): void {
    throw new Error('Function not implemented.');
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">All Leads</h1>
            <div className="flex items-center space-x-3">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-emerald-600 hover:!bg-emerald-700 !text-white !font-bold"
              />

              {/* Add New Lead Button - Always visible regardless of permissions */}
              <ButtonElement
                icon={<Plus size={20} />}
                type="button"
                text="Add New Lead"
                onClick={() => setIsAddLeadModalOpen(true)}
                className="!text-md !font-bold !bg-blue-600 hover:!bg-blue-700 !text-white"
              />
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
                    // Removed renderOptionExtra to show only the main label
                  />
                </div>

                <div className="flex gap-2 ml-auto">
                  <ButtonElement
                    type="submit"
                    text="Filter"
                    icon={<Filter size={14} />}
                    className="!bg-emerald-600 hover:!bg-emerald-700 transition-all duration-150 !text-white"
                  />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={onClearClick}
                    className="!bg-gray-500 hover:!bg-gray-600 transition-all duration-150 !text-white"
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
                  <th className="px-4 py-3 text-left">Source</th>
                  <th className="px-4 py-3 text-left">Education Level</th>
                  <th className="px-4 py-3 text-left">Completion Year</th>
                  <th className="px-4 py-3 text-center w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      Loading Leads...
                    </td>
                  </tr>
                ) : leads.length > 0 ? (
                  leads.map((lead, index) => (
                    <tr
                      key={lead.id}
                      id={`lead-${lead.id}`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                    >
                      <td className="py-1 px-4">
                        {((currentPage - 1) * paginationParams.pageSize + index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="py-1 px-4 font-medium">{lead.name}</td>
                      <td className="py-1 px-4">{lead.email}</td>
                      <td className="py-1 px-4">{lead.phone}</td>
                      <td className="py-1 px-4 capitalize">{lead.source}</td>
                      <td className="py-1 px-4">{getEducationLevelText(lead.educationLevel)}</td>
                      <td className="py-1 px-4">{lead.completionYear}</td>
                      <td className="py-1 px-4">
                        <ActionMenu
                          lead={lead}
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
                      No Leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modals */}
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
        </div>

        {/* Pagination */}
        {!loading && leads.length > 0 && (
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