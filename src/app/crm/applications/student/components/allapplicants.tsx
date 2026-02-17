"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { api } from "../../constants/api_constant";

interface ApiApplicant {
  id?: string;
  fullName?: string;  
  email?: string;
  contactNumber?: string;  
  appliedProgram?: string;
  status?: "pending" | "approved" | "rejected";
}

interface ApiResponse {
  Items?: ApiApplicant[]; 
  data?: ApiApplicant[];
  TotalItems?: number;
  PageIndex?: number;
  pageSize?: number;
  TotalPages?: number;
}
interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedProgram: string;
  status: "pending" | "approved" | "rejected";
}

const AllApplicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try GET first (like your successful API call)
        const response = await api.get<ApiResponse>("/api/Enrolments/FilterApplicants");
        
        console.log('API Response:', response.data); // Log to see actual structure

        // Handle different possible response structures
        let applicantsData: ApiApplicant[] = [];
        
        if (response.data?.Items && Array.isArray(response.data.Items)) {
          // Structure like your first API
          applicantsData = response.data.Items;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          // Structure with data property
          applicantsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          // Direct array
          applicantsData = response.data;
        } else {
          throw new Error("Unexpected data format from server");
        }

        // Map the API response to your Applicant interface
        const formattedApplicants: Applicant[] = applicantsData.map((item: any, index: number) => ({
          id: item.id || index.toString(),
          name: item.fullName || item.name || 'N/A',
          email: item.email || 'N/A',
          phone: item.contactNumber || item.phone || 'N/A',
          appliedProgram: item.appliedProgram || item.program || 'N/A',
          status: item.status || 'pending',
        }));

        setApplicants(formattedApplicants);
      } catch (err: any) {
        console.error("Fetch error:", err);
        console.error("Error response:", err.response); // Log full error

        if (err.response?.status === 403) {
          setError("You don't have permission to view applicants.");
        } else if (err.response?.status === 404) {
          // If GET fails, try POST
          try {
            const postResponse = await api.post<ApiResponse>("/api/Enrolments/FilterApplicants", {});
            console.log('POST Response:', postResponse.data);
            
            // Handle POST response similarly
            // ... mapping logic here
            
          } catch (postErr: any) {
            setError("Endpoint not found. Please check the API URL.");
          }
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

    fetchApplicants();
  }, []);
  const filteredApplicants = applicants.filter((applicant) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      applicant.name?.toLowerCase().includes(searchLower) ||
      applicant.email?.toLowerCase().includes(searchLower) ||
      applicant.phone?.includes(searchTerm) ||
      applicant.appliedProgram?.toLowerCase().includes(searchLower)
    );
  });

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
          placeholder="Search applicants..."
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
          <div className="p-8 text-center">Loading applicants...</div>
        ) : filteredApplicants.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No applicants found.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-700 text-sm">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Program</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map((applicant) => (
                <tr
                  key={applicant.id}
                  className="border-t dark:border-gray-700"
                >
                  <td className="p-4">{applicant.name}</td>
                  <td className="p-4">{applicant.email}</td>
                  <td className="p-4">{applicant.phone}</td>
                  <td className="p-4">{applicant.appliedProgram}</td>
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
        )}
      </div>
    </div>
  );
};

export default AllApplicants;