"use client";

import { useEffect, useState } from 'react';
import { api } from '@/utils/instance';
import { X } from 'lucide-react';

interface ApplicantDetail {
  userId: string;
  fullName: string;
  email: string;
  enrolmentType: number;
  passportNo: string;
  targetCountry: string;
  isActive: boolean;
  schoolId: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

interface ApplicantDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantId: string | null;
}

const getEnrolmentTypeText = (type: number) => {
  switch (type) {
    case 1: return { label: 'Lead', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
    case 2: return { label: 'Applicant', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
    case 3: return { label: 'Student', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
    default: return { label: 'Unknown', className: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' };
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr.startsWith('0001')) return 'N/A';
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

export const ApplicantDetailModal = ({ isOpen, onClose, applicantId }: ApplicantDetailModalProps) => {
  const [detail, setDetail] = useState<ApplicantDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !applicantId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        setDetail(null);
        const response = await api.get<ApplicantDetail>(`/api/Enrolments/Applicants/${applicantId}`);
        setDetail(response.data);
      } catch {
        setError('Failed to load applicant details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [isOpen, applicantId]);

  if (!isOpen) return null;

  const enrolmentType = detail ? getEnrolmentTypeText(detail.enrolmentType) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#353535] rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Applicant Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

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
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-700 dark:text-yellow-400 font-bold text-lg shrink-0">
                  {detail.fullName?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">{detail.fullName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {enrolmentType && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${enrolmentType.className}`}>
                        {enrolmentType.label}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      detail.isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {detail.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              <DetailRow label="Email" value={detail.email} />
              <DetailRow label="Passport No" value={detail.passportNo} />
              <DetailRow label="Target Country" value={detail.targetCountry} />
              <DetailRow label="Enrolled On" value={formatDate(detail.createdAt)} />
              <DetailRow label="Last Modified" value={formatDate(detail.modifiedAt)} />
            </div>
          )}
        </div>

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