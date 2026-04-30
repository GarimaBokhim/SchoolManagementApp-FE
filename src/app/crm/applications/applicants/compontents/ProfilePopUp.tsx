'use client'

import React, { useState } from 'react'
import { X, User, FileText, GraduationCap, Calendar, DollarSign, Mail, MessageSquare, CreditCard, Award, BookOpen, Clock } from 'lucide-react'
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

// Tab configuration
const TABS = [
  { id: 'visa', label: 'VISA', icon: CreditCard },
  { id: 'scores', label: 'SCORES', icon: Award },
  { id: 'academics', label: 'ACADEMICS', icon: BookOpen },
  { id: 'testDates', label: 'TEST DATES', icon: Calendar },
  { id: 'payments', label: 'PAYMENTS', icon: DollarSign },
  { id: 'classes', label: 'CLASSES', icon: GraduationCap },
  { id: 'emailHistory', label: 'EMAIL HISTORY', icon: Mail },
  { id: 'smsHistory', label: 'SMS HISTORY', icon: MessageSquare },
]

// Static Document Status Data
const documentStatusData = [
  { label: 'Passport', status: 'Verified', statusColor: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  { label: 'Academic Transcripts', status: 'Pending', statusColor: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
  { label: 'Language Test', status: 'Verified', statusColor: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  { label: 'SOP', status: 'Not Uploaded', statusColor: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  { label: 'Financial Documents', status: 'In Review', statusColor: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
]

// Static Visa Processing Steps
const visaSteps = [
  { label: 'Application Submitted', step: 3, total: 5, percentage: 60 },
  { label: 'Document Verification', completed: true },
  { label: 'Interview', completed: false },
  { label: 'Background Check', completed: false },
  { label: 'Approval', completed: false },
]

const getEnrolmentInfo = (type: number) =>
  ENROLMENT_TYPE_MAP[type] ?? { label: 'Unknown', color: 'bg-gray-100 text-gray-700' }

const getInitials = (name?: string | null) => {
  if (!name) return 'U'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return 'N/a'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  } catch {
    return 'N/a'
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
    <div className="flex flex-col items-center gap-4">
      <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    ))}
  </div>
)

const UserProfilePopup = ({ isOpen, onClose, applicant }: UserProfilePopupProps) => {
  const [activeTab, setActiveTab] = useState('visa')
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

  // Generate Student ID (static for now)
  const studentId = `SUS${Math.floor(Math.random() * 900000) + 100000}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0 overflow-y-auto py-8"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-2xl z-10">
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
            <div className="space-y-6">
              
              {/* Row 1: User Details + Application Details + Document Status */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* User Details Card - Now takes full vertical space with better alignment */}
                <div className="lg:col-span-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                    {isLoading ? (
                      <ProfileSkeleton />
                    ) : (
                      <>
                        {/* Avatar + Name - Vertically aligned */}
                        <div className="flex flex-col items-center text-center mb-6">
                          <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mb-4">
                            <span className="text-3xl font-bold text-white">
                              {getInitials(displayName)}
                            </span>
                          </div>
                          <div className="w-full">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                              {displayName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 break-all">
                              {displayEmail}
                            </p>
                            {profile?.enrolmentType != null && (
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${enrolmentInfo.color}`}>
                                {enrolmentInfo.label}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Student Info - Takes remaining space */}
                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Student ID</span>
                            <span className="text-sm font-mono font-semibold text-gray-800 dark:text-white">
                              {studentId}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Admission Date</span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">
                              {formatDate(profile?.admissionDate)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Country</span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">
                              {applicant.targetCountry || 'Nepal (NP)'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Phone</span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">
                              {profile?.contactNumber || '+977 9812345678'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Email</span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white truncate ml-2">
                              {displayEmail}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">D.O.B.</span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">
                              {formatDate(profile?.dob)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Gender</span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">
                              {GENDER_STATUS_MAP[profile?.genderStatus ?? 0] || 'N/a'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Interested Country</span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white">
                              {profile?.intrestedCountry || applicant.targetCountry || '-'}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Application Details Card */}
                <div className="lg:col-span-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800 h-full">
                    <h3 className="text-base font-semibold text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-2">
                      <FileText size={18} />
                      Application Details
                    </h3>
                    {isLoading ? (
                      <div className="animate-pulse space-y-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="h-4 bg-blue-100 dark:bg-blue-900/30 rounded w-3/4" />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-blue-100 dark:border-blue-800">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Application ID</span>
                          <span className="text-sm font-medium text-gray-800 dark:text-white">
                            APP-2024-001
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-blue-100 dark:border-blue-800">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Applied Date</span>
                          <span className="text-sm font-medium text-gray-800 dark:text-white">
                            March 15, 2026
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-blue-100 dark:border-blue-800">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Course Interested</span>
                          <span className="text-sm font-medium text-gray-800 dark:text-white">
                            Computer Science
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-blue-100 dark:border-blue-800">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Preferred Intake</span>
                          <span className="text-sm font-medium text-gray-800 dark:text-white">
                            Fall 2026
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-blue-100 dark:border-blue-800">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Education Level</span>
                          <span className="text-sm font-medium text-gray-800 dark:text-white">
                            Bachelor&apos;s Degree
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">School</span>
                          <span className="text-sm font-medium text-gray-800 dark:text-white text-right">
                            {applicant.schoolName || 'Shreentry College'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Status Card */}
                <div className="lg:col-span-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-100 dark:border-green-800 h-full">
                    <h3 className="text-base font-semibold text-green-800 dark:text-green-400 mb-4 flex items-center gap-2">
                      <FileText size={18} />
                      Documents Status
                    </h3>
                    <div className="space-y-3">
                      {documentStatusData.map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-green-100 dark:border-green-800 last:border-0">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{doc.label}</span>
                          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${doc.bgColor} ${doc.statusColor}`}>
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Visa Processing Status - Full Width */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-400 mb-4 flex items-center gap-2">
                  <CreditCard size={20} />
                  Visa Processing Status
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Application Submitted</span>
                    <span>65% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  {visaSteps.map((step, idx) => (
                    <div key={idx} className="text-center">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                        step.completed || (step.step && step.step > idx) 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.completed || (step.step && step.step > idx) ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-xs">{idx + 1}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{step.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 3: Tabs for Additional Components */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Tab Headers */}
                <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 overflow-x-auto">
                  {TABS.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                          activeTab === tab.id
                            ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-white dark:bg-gray-800'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                      >
                        <Icon size={16} />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                {/* Tab Content */}
                <div className="p-6 min-h-[200px]">
                  {activeTab === 'visa' && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <CreditCard size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No Visa Processing</p>
                    </div>
                  )}
                  {activeTab === 'scores' && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <Award size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No Scores Available</p>
                    </div>
                  )}
                  {activeTab === 'academics' && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No Academic Records</p>
                    </div>
                  )}
                  {activeTab === 'testDates' && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No Test Dates Scheduled</p>
                    </div>
                  )}
                  {activeTab === 'payments' && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <DollarSign size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No Payment Records</p>
                    </div>
                  )}
                  {activeTab === 'classes' && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <GraduationCap size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No Classes Available</p>
                    </div>
                  )}
                  {activeTab === 'emailHistory' && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <Mail size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No Email History</p>
                    </div>
                  )}
                  {activeTab === 'smsHistory' && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <MessageSquare size={48} className="mx-auto mb-3 opacity-50" />
                      <p>No SMS History</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-2">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                  Message
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                  Schedule Appointment
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end sticky bottom-0 bg-white dark:bg-gray-800 rounded-b-2xl">
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