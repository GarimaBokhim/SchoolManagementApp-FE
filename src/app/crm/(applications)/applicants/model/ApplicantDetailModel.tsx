"use client";

import { useEffect, useState } from 'react';
import { api } from '@/utils/instance';
import { X, User, Mail, Phone, Calendar, MapPin, GraduationCap, BookOpen, Award, Users, Globe, Hash, Flag, Clock, Edit, CheckCircle, XCircle } from 'lucide-react';

interface ApplicantDetail {
  userId: string;
  fullName: string;
  email: string;
  enrolmentType: number;
  passportNo: string;
  countryId: string;
  universityId: string;
  courseId: string;
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
    case 1: return { label: 'Lead', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800' };
    case 2: return { label: 'Applicant', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800' };
    case 3: return { label: 'Student', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' };
    default: return { label: 'Unknown', className: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-700' };
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

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">{value || 'N/A'}</div>
    </div>
  </div>
);

export const ApplicantDetailModal = ({ isOpen, onClose, applicantId }: ApplicantDetailModalProps) => {
  const [detail, setDetail] = useState<ApplicantDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const { data: countries } = useGetAllCountries();
  // const { data: universities } = useGetUniversities();
  // const { data: courses } = useGetAllCourses();

  // const getCountryName = (id: string) => {
  //   if (!countries || !id) return id;
  //   const country = countries.find((c: any) => c.id === id);
  //   return country ? country.name : id;
  // };

  // const getUniversityName = (id: string) => {
  //   if (!universities || !id) return id;
  //   const university = universities.find((u: any) => u.id === id);
  //   return university ? university.name : id;
  // };

  // const getCourseName = (id: string) => {
  //   if (!courses || !id) return id;
  //   const course = courses.find((c: any) => c.id === id);
  //   return course ? (course.title || course.name || course.courseName || id) : id;
  // };

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
  const initials = detail?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={onClose}
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a]
                   w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
                   max-h-[95vh] md:max-h-[92vh]
                   rounded-lg overflow-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 md:px-8 py-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={18} className="text-white" />
          </button>

          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {initials || '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{detail?.fullName || 'Applicant Details'}</h2>
              <p className="text-emerald-100 text-sm mt-0.5">Applicant Information</p>
              <div className="mt-2 flex items-center gap-2">
                {enrolmentType && (
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${enrolmentType.className}`}>
                    {enrolmentType.label}
                  </span>
                )}
                {detail && (
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${detail.isActive
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
                    }`}>
                    {detail.isActive ? 'Active' : 'Inactive'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 md:px-8 py-6">
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading applicant details...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <X size={24} className="text-red-500" />
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            </div>
          )}

          {detail && !loading && (
            <div className="space-y-6">
              {/* Personal Information Section */}
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Personal Information
                </p>
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    <InfoRow
                      icon={<User size={16} className="text-emerald-600 dark:text-emerald-400" />}
                      label="Full Name"
                      value={detail.fullName}
                    />
                    <InfoRow
                      icon={<Mail size={16} className="text-blue-600 dark:text-blue-400" />}
                      label="Email"
                      value={detail.email}
                    />
                    <InfoRow
                      icon={<Hash size={16} className="text-purple-600 dark:text-purple-400" />}
                      label="Passport Number"
                      value={detail.passportNo}
                    />
                  </div>
                </div>
              </div>

              {/* Enrollment Information Section */}
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Enrollment Information
                </p>
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {/* <InfoRow
                      icon={<Globe size={16} className="text-emerald-600 dark:text-emerald-400" />}
                      label="Target Country"
                      value={getCountryName(detail.countryId)}
                    />
                    <InfoRow
                      icon={<GraduationCap size={16} className="text-blue-600 dark:text-blue-400" />}
                      label="University"
                      value={getUniversityName(detail.universityId)}
                    />
                    <InfoRow
                      icon={<BookOpen size={16} className="text-purple-600 dark:text-purple-400" />}
                      label="Course"
                      value={getCourseName(detail.courseId)}
                    /> */}
                    <InfoRow
                      icon={<Clock size={16} className="text-orange-500 dark:text-orange-400" />}
                      label="Enrolled On"
                      value={formatDate(detail.createdAt)}
                    />
                    <InfoRow
                      icon={<Edit size={16} className="text-indigo-600 dark:text-indigo-400" />}
                      label="Last Modified"
                      value={formatDate(detail.modifiedAt)}
                    />
                    <InfoRow
                      icon={detail.isActive ? <CheckCircle size={16} className="text-green-600 dark:text-green-400" /> : <XCircle size={16} className="text-red-600 dark:text-red-400" />}
                      label="Status"
                      value={
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${detail.isActive
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                          {detail.isActive ? 'Active' : 'Inactive'}
                        </span>
                      }
                    />
                  </div>
                </div>
              </div>


            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 md:px-8 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};