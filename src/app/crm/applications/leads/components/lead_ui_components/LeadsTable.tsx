"use client";

import { Lead } from '../../types/ILeads';
import { getEducationLevelText } from '../../utils/helpers';
import { ActionMenu } from './ActionMenu';

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onConvert: (lead: Lead) => void;
  onDelete: (id: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const getEnrolmentTypeBadge = (type: number) => {
  switch (type) {
    case 1:
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          Lead
        </span>
      );
    case 2:
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
          Applicant
        </span>
      );
    case 3:
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          Student
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          Unknown
        </span>
      );
  }
};

export const LeadsTable = ({
  leads,
  loading,
  currentPage,
  pageSize,
  onView,
  onEdit,
  onConvert,
  onDelete,
  canEdit = true,
  canDelete = true
}: LeadsTableProps) => {
  return (
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
            <th className="px-4 py-3 text-left">Enrollment Type</th>
            <th className="px-4 py-3 text-center w-[80px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="p-4 text-center text-gray-500">
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
                  {((currentPage - 1) * pageSize + index + 1).toString().padStart(2, '0')}
                </td>
                <td className="py-1 px-4 font-medium">{lead.name}</td>
                <td className="py-1 px-4">{lead.email}</td>
                <td className="py-1 px-4">{lead.phone}</td>
                <td className="py-1 px-4 capitalize">{lead.source}</td>
                <td className="py-1 px-4">{getEducationLevelText(lead.educationLevel)}</td>
                <td className="py-1 px-4">{lead.completionYear}</td>
                <td className="py-1 px-4">{getEnrolmentTypeBadge(lead.enrolmentType)}</td> {/* ✅ new cell */}
                <td className="py-1 px-4">
                  <ActionMenu
                    lead={lead}
                    onView={onView}
                    onEdit={onEdit}
                    onConvert={onConvert}
                    onDelete={onDelete}
                    canEdit={canEdit}
                    canDelete={canDelete}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="p-4 text-center text-gray-500 italic">
                No Leads found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};