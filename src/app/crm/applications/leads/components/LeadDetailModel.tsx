"use client";

import { useEffect, useState } from 'react';
import { api } from '@/utils/instance';
import { X } from 'lucide-react';

interface LeadDetail {
  userId: string;
  fullName: string;
  email: string;
  enrolmentType: number;
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
}

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

const getGenderText = (gender: number) => {
  switch (gender) {
    case 1: return 'Male';
    case 2: return 'Female';
    case 3: return 'Other';
    default: return 'N/A';
  }
};

const getEducationLevelText = (level: number) => {
  switch (level) {
    case 1: return 'SEE';
    case 2: return '+2 / A-Level';
    case 3: return 'Bachelor';
    case 4: return 'Master';
    default: return 'N/A';
  }
};

const getEnrolmentTypeText = (type: number) => {
  switch (type) {
    case 1: return { label: 'Lead', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
    case 2: return { label: 'Applicant', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
    case 3: return { label: 'Student', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
    default: return { label: 'Unknown', className: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' };
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide sm:w-48 shrink-0">
      {label}
    </span>
    <span className="text-sm text-gray-800 dark:text-gray-200">{value || 'N/A'}</span>
  </div>
);

export const LeadDetailModal = ({ isOpen, onClose, userId }: LeadDetailModalProps) => {
  const [detail, setDetail] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        setDetail(null);
        const response = await api.get<LeadDetail>(`/api/Enrolments/Inquiry/${userId}`);
        setDetail(response.data);
      } catch (err) {
        setError('Failed to load lead details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const enrolmentType = detail ? getEnrolmentTypeText(detail.enrolmentType) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="relative bg-white dark:bg-[#353535] rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Lead Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          {loading && (
            <div className="flex justify-center items-center h-40">
              <div className="text-gray-500 dark:text-gray-400 text-sm">Loading details...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {detail && !loading && (
            <div>
              {/* Name + badge at top */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-lg shrink-0">
                  {detail.fullName?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{detail.fullName}</p>
                  {enrolmentType && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${enrolmentType.className}`}>
                      {enrolmentType.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <DetailRow label="Email" value={detail.email} />
              <DetailRow label="Contact Number" value={detail.contactNumber} />
              <DetailRow label="Date of Birth" value={formatDate(detail.dateOfBirth)} />
              <DetailRow label="Gender" value={getGenderText(detail.gender)} />
              <DetailRow label="Permanent Address" value={detail.permanentAddress} />
              <DetailRow label="Education Level" value={getEducationLevelText(detail.educationLevel)} />
              <DetailRow label="Completion Year" value={detail.completionYear} />
              <DetailRow label="Current GPA" value={detail.currentGpa} />
              <DetailRow
                label="Previous Qualification"
                value={detail.previousAcademicQualification}
              />
              <DetailRow label="Source" value={<span className="capitalize">{detail.source}</span>} />
              <DetailRow label="Feedback / Suggestion" value={detail.feedBackOrSuggestion} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};