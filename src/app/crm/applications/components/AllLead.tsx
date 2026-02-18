'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Plus, Filter, RotateCcw, Edit, Trash, Search, User, X, Eye, MoreVertical } from 'lucide-react';
import { api } from '@/utils/instance';
import ConvertToApplicantModal from '../model/ConvertToApplicationModel';
import useDropdown from '../hooks/useDropdown';
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import toast, { Toaster } from "react-hot-toast";
import AddLeadModal from '../model/AddLeadFormModel';

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
}

const ActionMenu = ({ lead, onView, onEdit, onConvert, onDelete }: ActionMenuProps) => {
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
          <button
            onClick={() => { onEdit(lead); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Edit size={14} /> Edit
          </button>
          <button
            onClick={() => { onConvert(lead); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <User size={14} /> Convert to Applicant
          </button>
          <button
            onClick={() => { onDelete(lead.id); setOpen(false); }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Trash size={14} /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

// ── User Profile Search ──────────────────────────────────────────────────────

const UserProfileSearch = ({ onProfileSelected }: { onProfileSelected: (profile: UserProfile) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [hasFetchedAll, setHasFetchedAll] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node))
        setShowResults(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAllUsers = async () => {
    if (hasFetchedAll) return;
    setIsSearching(true);
    try {
      const response = await api.get<UserProfileResponse>(`/api/Enrolments/GetAllUserProfile?search=`);
      if (response.data?.Items) {
        setSearchResults(response.data.Items);
        setHasFetchedAll(true);
      }
    } catch (error: any) {
      toast.error('Failed to fetch users');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await api.get<UserProfileResponse>(
          `/api/Enrolments/GetAllUserProfile?search=${encodeURIComponent(searchQuery)}`
        );
        if (response.data?.Items) {
          setSearchResults(response.data.Items);
          setShowResults(true);
        }
      } catch {
        toast.error('Failed to search profiles');
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, hasFetchedAll]);

  const handleInputFocus = () => { fetchAllUsers(); setShowResults(true); };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim() && hasFetchedAll) setShowResults(true);
  };
  const handleSelectProfile = (profile: UserProfile) => {
    onProfileSelected(profile);
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
    setHasFetchedAll(false);
  };

  const getEnrolmentTypeText = (type: number) => {
    switch (type) {
      case 1: return 'Student';
      case 2: return 'Partner';
      default: return 'Other';
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search users..."
          className="w-full sm:w-64 pl-10 pr-10 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00786f] focus:border-transparent dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00786f]" />
          </div>
        )}
        {searchQuery && !isSearching && (
          <button
            onClick={() => { setSearchQuery(''); fetchAllUsers(); setShowResults(true); }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 mt-2 w-full sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[100] max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">Loading users...</div>
          ) : searchResults.length > 0 ? (
            searchResults.map((profile) => (
              <div
                key={profile.id}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0 transition-colors"
                onClick={() => handleSelectProfile(profile)}
              >
                <div className="font-medium text-gray-800 dark:text-white">{profile.fullName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <div>{profile.email}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-full ${
                      profile.enrolmentType === 1
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {getEnrolmentTypeText(profile.enrolmentType)}
                    </span>
                    <span>Joined: {formatDate(profile.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {searchQuery ? `No profiles found matching "${searchQuery}"` : 'No users found'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Filter Button ────────────────────────────────────────────────────────────

const FilterButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 text-xs sm:text-sm font-bold text-white rounded-lg transition-all duration-150 whitespace-nowrap ${
      isActive
        ? 'bg-[#00786f] shadow-lg transform scale-105'
        : 'bg-[#00786f] hover:bg-[#00635a] opacity-80 hover:opacity-100 hover:shadow-md hover:scale-105'
    }`}
  >
    {label}
  </button>
);

// ── Main Page ────────────────────────────────────────────────────────────────

const AllLeadsPage = () => {
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
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  const { closeDropdown } = useDropdown();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<ApiResponse>(`/api/Enrolments/FilterInquery`);
      const items = response.data.Items || [];
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
    } catch (error: any) {
      setError(error.response?.data?.message || error.message || 'Failed to fetch leads');
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleProfileSelected = (profile: UserProfile) => {
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
      const newLead: Lead = {
        id: profile.id,
        userId: profile.id,
        name: profile.fullName,
        email: profile.email,
        phone: profile.contactNumber || 'N/A',
        source: profile.source || 'profile-search',
        educationLevel: 0,
        completionYear: 'N/A',
      };
      setLeads(prev => [newLead, ...prev]);
      toast.success(`Added ${profile.fullName} to leads`);
    }
  };

  const refreshLeads = () => fetchLeads();

  const handleConvertClick = (lead: Lead) => {
    setSelectedLead(lead);
    setConversionData({ userId: lead.userId, passportNo: '', targetCountry: '' });
    setShowConvertModal(true);
    closeDropdown();
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
      // ✅ No local state removal — lead stays visible until next fresh API fetch
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to convert to applicant';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setConvertingId(null);
    }
  };

  // ✅ No API yet — just show toast, do NOT touch local state
  const handleDelete = (_id: string) => {
    toast('Deleting lead...', { icon: '🗑️' });
  };

  const handleViewDetails = (lead: Lead) => {
    toast.success(`Viewing details for ${lead.name}`);
  };

  // ✅ No API yet — just show toast, do NOT touch local state
  const handleEdit = (_lead: Lead) => {
    toast('Editing lead...', { icon: '✏️' });
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    toast.success(`Filtering by ${filter}`);
  };

  const onClearClick = () => {
    setActiveFilter('');
    setOpenFilter(false);
    toast.success('Filters cleared');
  };

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
      <div className="p-4 sm:p-6 relative">
        <div className={`bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
          isAddLeadModalOpen || showConvertModal ? 'blur-sm' : ''
        }`}>

          {/* Header */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">All Leads</h1>
            <div className="flex items-center space-x-3">
              <ButtonElement
                type="button"
                text="Filter"
                icon={<Filter size={14} />}
                onClick={() => setOpenFilter(!openFilter)}
                className="!bg-[#00786f] hover:!bg-[#00635a] !text-white !font-bold transition-all duration-150 hover:shadow-md hover:scale-105"
              />
              <ButtonElement
                icon={<Plus size={24} />}
                type="button"
                text="Add New Lead"
                onClick={() => setIsAddLeadModalOpen(true)}
                className="!text-md !font-bold !bg-[#00786f] hover:!bg-[#00635a] !text-white transition-all duration-150 hover:shadow-md hover:scale-105"
              />
            </div>
          </div>

          {/* Filter Section */}
          {openFilter && (
            <div className="mb-6 mx-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-200 dark:bg-[#353535] dark:border-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  {['Yesterday', '7 Days', '30 Days', 'This Month', 'Last Month', 'This Year'].map(f => (
                    <FilterButton key={f} label={f} isActive={activeFilter === f} onClick={() => handleFilterClick(f)} />
                  ))}
                </div>
                <div className="flex items-center gap-2 lg:ml-auto">
                  <UserProfileSearch onProfileSelected={handleProfileSelected} />
                  <ButtonElement
                    type="button"
                    text="Filter"
                    icon={<Filter size={14} />}
                    className="!bg-[#00786f] hover:!bg-[#00635a] !text-white !font-bold transition-all duration-150 hover:shadow-md hover:scale-105 whitespace-nowrap"
                  />
                  <ButtonElement
                    type="button"
                    text="Clear"
                    icon={<RotateCcw size={14} />}
                    onClick={onClearClick}
                    className="!bg-[#00786f] hover:!bg-[#00635a] !text-white !font-bold transition-all duration-150 hover:shadow-md hover:scale-105 whitespace-nowrap"
                  />
                </div>
              </div>
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
                    <td colSpan={8} className="p-4 text-center text-gray-500">Loading Leads...</td>
                  </tr>
                ) : leads.length > 0 ? (
                  leads.map((lead, index) => (
                    <tr
                      key={lead.id}
                      id={`lead-${lead.id}`}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                    >
                      <td className="py-3 px-4">{(index + 1).toString().padStart(2, '0')}</td>
                      <td className="py-3 px-4 font-medium">{lead.name}</td>
                      <td className="py-3 px-4">{lead.email}</td>
                      <td className="py-3 px-4">{lead.phone}</td>
                      <td className="py-3 px-4 capitalize">{lead.source}</td>
                      <td className="py-3 px-4">{getEducationLevelText(lead.educationLevel)}</td>
                      <td className="py-3 px-4">{lead.completionYear}</td>
                      <td className="py-3 px-4">
                        <ActionMenu
                          lead={lead}
                          onView={handleViewDetails}
                          onEdit={handleEdit}
                          onConvert={handleConvertClick}
                          onDelete={handleDelete}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500 italic">No Leads found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {isAddLeadModalOpen && (
          <AddLeadModal
            isOpen={isAddLeadModalOpen}
            onClose={() => setIsAddLeadModalOpen(false)}
            onSuccess={refreshLeads}
          />
        )}
        {showConvertModal && (
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
    </>
  );
};

export default AllLeadsPage;