'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  countryInterest: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
}

const AllLeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Replace this with your real API later
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        // Example API call:
        // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`);
        // const data = await res.json();
        // setLeads(data);

        // Temporary dummy data:
        setLeads([
          {
            id: '1',
            name: 'John Doe hello',
            email: 'john@example.com',
            phone: '1234567890',
            source: 'website',
            countryInterest: 'USA',
            status: 'new',
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '9876543210',
            source: 'referral',
            countryInterest: 'Canada',
            status: 'qualified',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch leads');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

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
        return '';
    }
  };

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
          href="/crm/leads/add"
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Lead
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : leads.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No leads found.
          </div>
        ) : (
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
                  <td className="p-4 flex justify-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye size={18} />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <Edit size={18} />
                    </button>
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

export default AllLeadsPage;
