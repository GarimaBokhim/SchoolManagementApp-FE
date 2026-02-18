"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { api } from "@/utils/instance";


interface ApiApplicant {
  id?: string;
  fullName?: string;
  email?: string;
  contactNumber?: string;
  appliedProgram?: string;
  status?: "pending" | "approved" | "rejected";
  passportNo?: string;
  targetCountry?: string;
}

interface ApiResponse {
  items?: ApiApplicant[];
  data?: ApiApplicant[];
  totalItems?: number;
  pageIndex?: number;
  pageSize?: number;
  totalPages?: number;
}

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedProgram: string;
  status: "pending" | "approved" | "rejected";
  passportNo?: string;
  targetCountry?: string;
}

const AllApplicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      params.append('pageIndex', currentPage.toString());
      params.append('pageSize', pageSize.toString());
      if (searchTerm) {
        params.append('searchTerm', searchTerm);
      }

      // Make GET request to FilterApplicants endpoint with query parameters
      const response = await api.get<ApiResponse>(
        `/api/Enrolments/FilterApplicants?${params.toString()}`
      );
      
      console.log('API Response:', response.data);

      // Handle different possible response structures
      let applicantsData: ApiApplicant[] = [];
      
      if (response.data?.items && Array.isArray(response.data.items)) {
        applicantsData = response.data.items;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        applicantsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        applicantsData = response.data;
      }

      // Map the API response to your Applicant interface
      const formattedApplicants: Applicant[] = applicantsData.map((item: any, index: number) => ({
        id: item.id || `temp-${index}`,
        name: item.fullName || item.name || 'N/A',
        email: item.email || 'N/A',
        phone: item.contactNumber || item.phone || 'N/A',
        appliedProgram: item.appliedProgram || item.program || item.targetCountry || 'N/A',
        status: item.status || 'pending',
        passportNo: item.passportNo,
        targetCountry: item.targetCountry,
      }));

      setApplicants(formattedApplicants);
      
      // Set pagination if available
      if (response.data?.totalPages) {
        setTotalPages(response.data.totalPages);
      }
      
    } catch (err: any) {
      console.error("Fetch error:", err);
      console.error("Error response:", err.response);

      if (err.response?.status === 403) {
        setError("You don't have permission to view applicants.");
      } else if (err.response?.status === 400) {
        setError("Invalid request parameters.");
      } else if (err.response?.status === 404) {
        setError("API endpoint not found. Please check the URL.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (err.code === "ECONNABORTED") {
        setError("Request timeout. Please check your connection.");
      } else {
        setError(err.response?.data?.message || "Failed to fetch applicants.");
      }

      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch applicants on component mount and when page changes
  useEffect(() => {
    fetchApplicants();
  }, [currentPage]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        setCurrentPage(1); // Reset to first page on search
        fetchApplicants();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Applicants
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage all student applications
          </p>
        </div>

        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
          <Plus className="h-5 w-5 mr-2" />
          Add Applicant
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="search"
          placeholder="Search applicants by name, email, phone or program..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none dark:text-white"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-2 text-gray-500">Loading applicants...</p>
          </div>
        ) : applicants.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No applicants found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-gray-700 text-sm">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Program/Country</th>
                    <th className="p-4">Passport No</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((applicant) => (
                    <tr
                      key={applicant.id}
                      className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="p-4 font-medium">{applicant.name}</td>
                      <td className="p-4">{applicant.email}</td>
                      <td className="p-4">{applicant.phone}</td>
                      <td className="p-4">{applicant.appliedProgram}</td>
                      <td className="p-4">{applicant.passportNo || '-'}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusStyle(
                            applicant.status
                          )}`}
                        >
                          {applicant.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t dark:border-gray-700">
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllApplicants;