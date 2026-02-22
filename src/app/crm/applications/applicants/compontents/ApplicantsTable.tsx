"use client";

import { Applicant } from '../types';
import { ActionMenu } from './ActionMenu';

// Map enum values to labels
const ENROLMENT_TYPE_LABELS: Record<number, string> = {
  1: 'Lead',
  2: 'Applicant',
  3: 'Student',
};

const EnrolmentBadge = ({ type }: { type?: number }) => {
  if (!type) return <span className="text-gray-400">-</span>;

  const label = ENROLMENT_TYPE_LABELS[type] ?? 'Unknown';

  const colorMap: Record<number, string> = {
    1: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    2: 'bg-blue-100 text-blue-700 border border-blue-300',
    3: 'bg-green-100 text-green-700 border border-green-300',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorMap[type] ?? 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  );
};

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
  canDelete = true,
}: ApplicantsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
            <th className="px-4 py-3 text-left w-[60px]">S.N</th>
            <th className="px-4 py-3 text-left">Full Name</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-left">Enrolment Type</th>
            <th className="px-4 py-3 text-left">Passport No</th>
            <th className="px-4 py-3 text-left">Target Country</th>
            <th className="px-4 py-3 text-center w-[80px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">
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
                <td className="py-1 px-4 font-medium">
                  {applicant.fullName ?? '-'}
                </td>
                <td className="py-1 px-4">
                  {applicant.email ?? '-'}
                </td>
                <td className="py-1 px-4">
                  <EnrolmentBadge type={applicant.enrolmentType} />
                </td>
                <td className="py-1 px-4 font-medium">{applicant.passportNo}</td>
                <td className="py-1 px-4">{applicant.targetCountry}</td>
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
              <td colSpan={7} className="p-4 text-center text-gray-500 italic">
                No applicants found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};