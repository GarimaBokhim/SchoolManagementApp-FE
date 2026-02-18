'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Filter, RotateCcw, Edit, Trash, Search, Settings, LogOut, User, X } from 'lucide-react';
import { api } from '@/utils/instance';
import ConvertToApplicantModal from '../model/ConvertToApplicationModel';
import useDropdown from '../hooks/useDropdown';
import DropdownMenuButton from './common_componts/drop_down';
import LeadActionsDropdown from './common_componts/lead_dropdown';
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { EditButton } from "@/components/Buttons/EditButton";
import toast, { Toaster } from "react-hot-toast";
import AddLeadModal from '../model/AddLeadFormModel';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  countryInterest?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
}

// Define the API response interface for leads
interface ApiResponse {
  Items: Array<{
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

// Interface for user profile search
interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  source?: string;
  status?: string;
  countryInterest?: string;
}

interface UserProfileResponse {
  Items: UserProfile[];
  TotalItems: number;
  PageIndex: number;
  pageSize: number;
  TotalPages: number;
}

// Convert to Applicant payload interface
interface ConvertToApplicantPayload {
  userId: string;
  passportNo: string;
  targetCountry: string;
}

// User Profile Search Component - Real search input
const UserProfileSearch = ({ onSearch, onSelectProfile }: { 
  onSearch: (query: string) => void; 
  onSelectProfile: (profile: UserProfile) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  // Debounce search to avoid too many API calls
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        await onSearch(searchQuery);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
  };

  const handleSelectProfile = (profile: UserProfile) => {
    onSelectProfile(profile);
    setSearchQuery('');
    setShowResults(false);
    setSearchResults([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => searchQuery.trim() && setShowResults(true)}
          placeholder="Search profile"
          className="w-full sm:w-80 pl-10 pr-10 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00786f]"></div>
          </div>
        )}
      </div>
      
      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full sm:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
          {searchResults.map((profile) => (
            <div
              key={profile.id}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b last:border-b-0"
              onClick={() => handleSelectProfile(profile)}
            >
              <div className="font-medium text-gray-800 dark:text-white">
                {profile.fullName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {profile.email} • {profile.contactNumber}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Filter button component with original #00786f color
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
  
  // Search states
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Use the custom dropdown hook
  const { openMenuId, closeDropdown, toggleDropdown, isDropdownOpen } = useDropdown();

  // Fetch leads function
  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<ApiResponse>(`/api/Enrolments/FilterInquery`);

      console.log('API Response:', response.data);

      const items = response.data.Items || [];
      
      const formattedLeads: Lead[] = items.map((item: any, index: number) => ({
        id: index.toString(),
        name: item.fullName || 'N/A',
        email: item.email || 'N/A',
        phone: item.contactNumber || 'N/A',
        source: item.source || 'website',
        countryInterest: 'N/A',
        status: 'new',
      }));

      setLeads(formattedLeads);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch leads');
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Handle profile search
  const handleProfileSearch = async (query: string) => {
    try {
      setSearchLoading(true);
      
      // Call the API with the search query
      const response = await api.get<UserProfileResponse>(
        `/api/Enrolments/GetAllUserProfile?search=${encodeURIComponent(query)}`
      );
      
      console.log('Search results:', response.data);
      
      if (response.data?.Items) {
        setSearchResults(response.data.Items);
      } else {
        setSearchResults([]);
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error('Failed to search profiles');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle selecting a profile from search results
  const handleSelectProfile = (profile: UserProfile) => {
    // Check if profile already exists in leads
    const existingLead = leads.find(lead => lead.email === profile.email);
    
    if (existingLead) {
      toast.success(`Profile ${profile.fullName} already exists in leads`);
      // Scroll to or highlight the existing lead
    } else {
      // Add to leads as a new lead
      const newLead: Lead = {
        id: (leads.length + 1).toString(),
        name: profile.fullName,
        email: profile.email,
        phone: profile.contactNumber,
        source: profile.source || 'search',
        countryInterest: profile.countryInterest || 'N/A',
        status: 'new',
      };
      
      setLeads(prev => [newLead, ...prev]);
      toast.success(`Added ${profile.fullName} to leads`);
    }
  };

  const refreshLeads = () => {
    fetchLeads();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'qualified':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'lost':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const handleConvertClick = (lead: Lead) => {
    setSelectedLead(lead);
    setConversionData({
      userId: lead.id,
      passportNo: '',
      targetCountry: '',
    });
    setShowConvertModal(true);
    closeDropdown(); // Close dropdown after selection
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
      
      const response = await api.post('/api/Enrolments/ConvertToApplicant', conversionData);
      
      console.log('Conversion response:', response.data);
      
      toast.success(`Successfully converted ${selectedLead.name} to applicant!`);
      setShowConvertModal(false);
      
      setLeads(prev => prev.filter(lead => lead.id !== selectedLead.id));
      
    } catch (error: any) {
      console.error('Conversion error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to convert to applicant';
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setConvertingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      toast.success('Lead deleted successfully!');
      setLeads(prev => prev.filter(lead => lead.id !== id));
    } catch {
      toast.error('Error deleting lead.');
    }
  };

  const handleViewDetails = (lead: Lead) => {
    console.log('View details:', lead);
    toast.success(`Viewing details for ${lead.name}`);
  };

  const handleEdit = (lead: Lead) => {
    console.log('Edit:', lead);
    toast.success(`Editing ${lead.name}`);
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

  const buttonElement = (id: string) => {
    return (
      <ButtonElement
        icon={<Edit size={14} />}
        type="button"
        text=""
        onClick={() => {
          const lead = leads.find(l => l.id === id);
          if (lead) handleEdit(lead);
        }}
        className="!text-xs font-bold !bg-[#00786f] hover:!bg-[#00635a] text-white transition-all duration-150 hover:shadow-md hover:scale-105"
      />
    );
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
        {/* Main Content - with conditional blur */}
        <div className={`bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${
          isAddLeadModalOpen || showConvertModal ? 'blur-sm' : ''
        }`}>
          {/* Header */}
          <div className="flex w-full justify-between p-3 px-4 pt-4 items-center">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              All Leads
            </h1>
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
                {/* Date Filter Buttons */}
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  <FilterButton
                    label="Yesterday"
                    isActive={activeFilter === 'Yesterday'}
                    onClick={() => handleFilterClick('Yesterday')}
                  />
                  <FilterButton
                    label="7 Days"
                    isActive={activeFilter === '7 Days'}
                    onClick={() => handleFilterClick('7 Days')}
                  />
                  <FilterButton
                    label="30 Days"
                    isActive={activeFilter === '30 Days'}
                    onClick={() => handleFilterClick('30 Days')}
                  />
                  <FilterButton
                    label="This Month"
                    isActive={activeFilter === 'This Month'}
                    onClick={() => handleFilterClick('This Month')}
                  />
                  <FilterButton
                    label="Last Month"
                    isActive={activeFilter === 'Last Month'}
                    onClick={() => handleFilterClick('Last Month')}
                  />
                  <FilterButton
                    label="This Year"
                    isActive={activeFilter === 'This Year'}
                    onClick={() => handleFilterClick('This Year')}
                  />
                </div>

                {/* Search Bar and Action Buttons */}
                <div className="flex items-center gap-2 lg:ml-auto">
                  {/* Real Search Input Component - with updated placeholder */}
                  <UserProfileSearch 
                    onSearch={handleProfileSearch} 
                    onSelectProfile={handleSelectProfile}
                  />

                  {/* Updated button label from "Apply Filter" to just "Filter" */}
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
                  <th className="px-4 py-3 text-left">Country</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center w-[180px]">Actions</th>
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
                      className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
                    >
                      <td className="py-1 px-4">{(index + 1).toString().padStart(2, '0')}</td>
                      <td className="py-1 px-4 font-medium">{lead.name}</td>
                      <td className="py-1 px-4">{lead.email}</td>
                      <td className="py-1 px-4">{lead.phone}</td>
                      <td className="py-1 px-4 capitalize">{lead.source}</td>
                      <td className="py-1 px-4">{lead.countryInterest}</td>
                      <td className="py-1 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-1 px-4">
                        <div className="flex justify-center gap-2">
                          <DeleteButton
                            onConfirm={() => handleDelete(lead.id)}
                            headerText={<Trash size={14} />}
                            content="Are you sure you want to delete this lead?"
                          />
                          <EditButton
                            button={buttonElement(lead.id)}
                          />
                          
                          <div className="relative">
                            <DropdownMenuButton
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDropdown(lead.id);
                              }}
                              isOpen={isDropdownOpen(lead.id)}
                            />
                            
                            {/* Modified LeadActionsDropdown to show only Convert option */}
                            {isDropdownOpen(lead.id) && (
                              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                <button
                                  onClick={() => {
                                    handleConvertClick(lead);
                                    closeDropdown();
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  Convert to Applicant
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-4 text-center text-gray-500 italic"
                    >
                      No Leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals - Rendered outside the blurred container */}
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