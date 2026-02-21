"use client";

import { Applicant } from '../types';
import { ActionMenu } from './ActionMenu';

interface ApplicantsTableProps {
  applicants: Applicant[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  onView: (applicant: Applicant) => void;
  onEdit: (applicant: Applicant) => void;
  onConvert: (applicant: Applicant) => void;
  onDelete: (id: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const ApplicantsTable = ({ 
  applicants, 
  loading, 
  currentPage, 
  pageSize,
  onView,
  onEdit,
  onConvert,
  onDelete,
  canEdit = true,
  canDelete = true
}: ApplicantsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
            <th className="px-4 py-3 text-left w-[60px]">S.N</th>
            <th className="px-4 py-3 text-left">Passport No</th>
            <th className="px-4 py-3 text-left">Target Country</th>
            <th className="px-4 py-3 text-left">School</th>
            <th className="px-4 py-3 text-center w-[80px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="p-4 text-center text-gray-500">
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
                  {((currentPage - 1) * pageSize + index + 1).toString().padStart(2, '0')}
                </td>
                <td className="py-1 px-4 font-medium">{applicant.passportNo}</td>
                <td className="py-1 px-4">{applicant.targetCountry}</td>
                <td className="py-1 px-4">{applicant.schoolName}</td>
                <td className="py-1 px-4">
                  <ActionMenu
                    applicant={applicant}
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
              <td colSpan={5} className="p-4 text-center text-gray-500 italic">
                No applicants found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};