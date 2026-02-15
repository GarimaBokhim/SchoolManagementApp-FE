"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

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

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        // 🔹 Replace with real API later
        setApplicants([
          {
            id: "1",
            name: "Michael Scott",
            email: "michael@dundermifflin.com",
            phone: "9876543210",
            appliedProgram: "MBA",
            status: "pending",
          },
          {
            id: "2",
            name: "Pam Beesly",
            email: "pam@dundermifflin.com",
            phone: "9123456789",
            appliedProgram: "Design",
            status: "approved",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch applicants");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
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

        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center">
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
          className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : applicants.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
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
              {applicants.map((applicant) => (
                <tr
                  key={applicant.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-4 font-medium">{applicant.name}</td>
                  <td className="p-4">{applicant.email}</td>
                  <td className="p-4">{applicant.phone}</td>
                  <td className="p-4">{applicant.appliedProgram}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(
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
