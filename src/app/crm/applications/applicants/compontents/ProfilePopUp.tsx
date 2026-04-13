'use client'

import React from 'react'
import { X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchUserProfile } from '../hooks/useUserProfile'

const ENROLMENT_TYPE_MAP: Record<number, { label: string; color: string }> = {
  1: { label: 'New Student',    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  2: { label: 'Transfer',       color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  3: { label: 'Applicant',      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  4: { label: 'Re-enrollment',  color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
}

const GENDER_STATUS_MAP: Record<number, string> = {
  1: 'Male',
  2: 'Female',
  3: 'Other',
}

const getEnrolmentInfo = (type: number) =>
  ENROLMENT_TYPE_MAP[type] ?? { label: 'Unknown', color: 'bg-gray-100 text-gray-700' }

const getInitials = (name?: string | null) => {
  if (!name) return 'U'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
  } catch {
    return '-'
  }
}

interface UserProfilePopupProps {
  isOpen: boolean
  onClose: () => void
  applicant: {
    fullName?: string | null
    email?: string | null
    passportNo?: string | null
    targetCountry?: string | null
    schoolName?: string | null
    isActive?: boolean | null
    id?: string | null
    userId?: string | null
  } | null
}

const ProfileSkeleton = () => (
  <div className="animate-pulse space-y-4 p-4">
    <div className="flex flex-col items-center gap-3">
      <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
        <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    ))}
  </div>
)

const UserProfilePopup = ({ isOpen, onClose, applicant }: UserProfilePopupProps) => {
  const userId = applicant?.userId ?? applicant?.id ?? null

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['UserProfile', userId],
    queryFn: () => fetchUserProfile(userId!),
    enabled: isOpen && !!userId,
    staleTime: 2 * 60 * 1000,
  })

  if (!isOpen || !applicant) return null

  const displayName  = profile?.fullName  ?? applicant.fullName  ?? 'Unknown User'
  const displayEmail = profile?.email     ?? applicant.email     ?? 'No email provided'

  const enrolmentInfo = getEnrolmentInfo(profile?.enrolmentType ?? 0)

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">User Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          {isError ? (
            <div className="flex items-center justify-center py-12 text-red-500 dark:text-red-400 text-sm">
              Failed to load profile. Please try again.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

              {/* Left — Profile Card */}
              <div className="md:col-span-5">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full">
                  {isLoading ? (
                    <ProfileSkeleton />
                  ) : (
                    <>
                      {/* Avatar + Name */}
                      <div className="text-center mb-6">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                          <span className="text-3xl font-bold text-white">
                            {getInitials(displayName)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                          {displayName}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {displayEmail}
                        </p>
                        {/* Enrolment type badge */}
                        {profile?.enrolmentType != null && (
                          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${enrolmentInfo.color}`}>
                            {enrolmentInfo.label}
                          </span>
                        )}
                      </div>

                      {/* Profile Details */}
                      <div className="space-y-3">

                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            applicant.isActive
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {applicant.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Gender</span>
                          <span className="text-sm text-gray-800 dark:text-white font-medium">
                            {GENDER_STATUS_MAP[profile?.genderStatus ?? 0] ?? '-'}
                          </span>
                        </div>

                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</span>
                          <span className="text-sm text-gray-800 dark:text-white font-medium">
                            {formatDate(profile?.dob)}
                          </span>
                        </div>

                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Admission Date</span>
                          <span className="text-sm text-gray-800 dark:text-white font-medium">
                            {formatDate(profile?.admissionDate)}
                          </span>
                        </div>

                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Passport No</span>
                          <span className="text-sm text-gray-800 dark:text-white font-medium">
                            {applicant.passportNo || '-'}
                          </span>
                        </div>

                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Target Country</span>
                          <span className="text-sm text-gray-800 dark:text-white font-medium">
                            {applicant.targetCountry || '-'}
                          </span>
                        </div>

                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Interested Country</span>
                          <span className="text-sm text-gray-800 dark:text-white font-medium">
                            {profile?.intrestedCountry || '-'}
                          </span>
                        </div>

                        <div className="flex justify-between py-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">School</span>
                          <span className="text-sm text-gray-800 dark:text-white font-medium text-right">
                            {applicant.schoolName || '-'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                          Message
                        </button>
                        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                          Schedule
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Right — Info Boxes */}
              <div className="md:col-span-7 space-y-6">

                {/* Application Details */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Application Details
                  </h3>
                  {isLoading ? (
                    <div className="animate-pulse space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-4 bg-blue-100 dark:bg-blue-900/30 rounded w-3/4" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Application ID</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {profile?.id ? `APP-${profile.id.substring(0, 8).toUpperCase()}` : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Enrolment Type</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 ${enrolmentInfo.color}`}>
                          {enrolmentInfo.label}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Admission Date</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {formatDate(profile?.admissionDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Date of Birth</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {formatDate(profile?.dob)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {GENDER_STATUS_MAP[profile?.genderStatus ?? 0] ?? '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Interested Country</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {profile?.intrestedCountry || '-'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact & Source Info */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-400 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Contact & Source
                  </h3>
                  {isLoading ? (
                    <div className="animate-pulse space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-4 bg-purple-100 dark:bg-purple-900/30 rounded w-3/4" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-purple-100 dark:border-purple-800">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                          {profile?.email || '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-purple-100 dark:border-purple-800">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Contact Number</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                          {profile?.contactNumber || '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Source</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-white">
                          {profile?.source || '-'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

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
  )
}

export default UserProfilePopup