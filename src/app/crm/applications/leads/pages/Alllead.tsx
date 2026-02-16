'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { api } from '@/utils/instance';
import useDropdown from '../hooks/useDropdown';
import DropdownMenuButton from './drop_down';
import LeadActionsDropdown from './lead_dropdown';
import ConvertToApplicantModal from '../../model/ConvertToApplicationModel';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  countryInterest?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
}

// Define the API response interface
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

// Convert to Applicant payload interface
interface ConvertToApplicantPayload {
  userId: string;
  passportNo: string;
  targetCountry: string;
}

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

  // Use the custom dropdown hook
  const { openMenuId, closeDropdown, toggleDropdown, isDropdownOpen } = useDropdown();

  const [pagination, setPagination] = useState({
    totalItems: 0,
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0
  });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError(null);

        // Using the axios instance with pagination params
        const response = await api.get<ApiResponse>(
          `/api/Enrolments/FilterInquery?pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`
        );

        console.log('API Response:', response.data);

        // Extract the Items array from the response
        const items = response.data.Items || [];
        
        // Set pagination info
        setPagination({
          totalItems: response.data.TotalItems,
          pageIndex: response.data.PageIndex,
          pageSize: response.data.pageSize,
          totalPages: response.data.TotalPages
        });

        // Format the leads data
        const formattedLeads: Lead[] = items.map((item: any, index: number) => ({
          id: index.toString(), // Since no ID in the response, using index as fallback
          name: item.fullName || 'N/A',
          email: item.email || 'N/A',
          phone: item.contactNumber || 'N/A',
          source: item.source || 'website',
          countryInterest: 'N/A', // Not in the API response, set default
          status: 'new', // Default status since not in API
        }));

        setLeads(formattedLeads);
      } catch (error: any) {
        console.error('Error fetching leads:', error);
        setError(error.response?.data?.message || error.message || 'Failed to fetch leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [pagination.pageIndex, pagination.pageSize]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-700';
      case 'qualified':
        return 'bg-green-100 text-green-700';
      case 'lost':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Open convert modal
  const handleConvertClick = (lead: Lead) => {
    setSelectedLead(lead);
    setConversionData({
      userId: lead.id, // Using the lead ID as userId
      passportNo: '',
      targetCountry: '',
    });
    setShowConvertModal(true);
  };

  // Handle conversion form input change
  const handleConversionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConversionData(prev => ({ ...prev, [name]: value }));
  };

  // Submit conversion
  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedLead) return;
    
    try {
      setConvertingId(selectedLead.id);
      
      const response = await api.post('/api/Enrolments/ConvertToApplicant', conversionData);
      
      console.log('Conversion response:', response.data);
      
      alert(`Successfully converted ${selectedLead.name} to applicant!`);
      setShowConvertModal(false);
      
      // Optionally refresh the leads list
      // You might want to remove the converted lead from the list
      setLeads(prev => prev.filter(lead => lead.id !== selectedLead.id));
      
    } catch (error: any) {
      console.error('Conversion error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to convert to applicant';
      alert(`Error: ${errorMessage}`);
    } finally {
      setConvertingId(null);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, pageIndex: newPage }));
  };

  // View details handler
  const handleViewDetails = (lead: Lead) => {
    console.log('View details:', lead);
    alert(`Viewing details for ${lead.name} - This feature is coming soon!`);
  };

  // Edit handler
  const handleEdit = (lead: Lead) => {
    console.log('Edit:', lead);
    alert(`Editing ${lead.name} - This feature is coming soon!`);
  };

  // If there's an error, show it
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            All Leads
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and track all CRM leads
          </p>
        </div>

        <Link
          href="/crm/applications/leads/add"
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Lead
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No leads found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Source</th>
                    <th className="p-4">Country</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="p-4 font-medium">{lead.name}</td>
                      <td className="p-4">{lead.email}</td>
                      <td className="p-4">{lead.phone}</td>
                      <td className="p-4 capitalize">{lead.source}</td>
                      <td className="p-4">{lead.countryInterest}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 relative">
                        <div className="flex justify-center">
                          <DropdownMenuButton
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDropdown(lead.id);
                            }}
                            isOpen={isDropdownOpen(lead.id)}
                          />
                          
                          <LeadActionsDropdown
                            lead={lead}
                            isOpen={isDropdownOpen(lead.id)}
                            onClose={closeDropdown}
                            onViewDetails={handleViewDetails}
                            onEdit={handleEdit}
                            onConvert={handleConvertClick}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing page {pagination.pageIndex} of {pagination.totalPages} ({pagination.totalItems} total items)
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.pageIndex - 1)}
                    disabled={pagination.pageIndex === 1}
                    className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.pageIndex + 1)}
                    disabled={pagination.pageIndex === pagination.totalPages}
                    className="px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Convert to Applicant Modal */}
      <ConvertToApplicantModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        selectedLead={selectedLead}
        conversionData={conversionData}
        convertingId={convertingId}
        onInputChange={handleConversionInputChange}
        onSubmit={handleConvertSubmit}
      />
    </div>
  );
};

export default AllLeadsPage;