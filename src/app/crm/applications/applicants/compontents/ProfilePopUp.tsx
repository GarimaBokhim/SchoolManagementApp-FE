// components/UserProfilePopup.tsx
'use client'

import React from 'react'
import { X } from 'lucide-react'

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

const UserProfilePopup = ({ isOpen, onClose, applicant }: UserProfilePopupProps) => {
  if (!isOpen || !applicant) return null

  // Get initials for avatar
  const getInitials = () => {
    if (!applicant.fullName) return 'U'
    return applicant.fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col"
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
          <div className="grid grid-cols-12 gap-6">
            {/* Left side - Profile box */}
            <div className="col-span-5">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                {/* Profile Header */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-white">
                      {getInitials()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {applicant.fullName || 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {applicant.email || 'No email provided'}
                  </p>
                </div>

                {/* Profile Details */}
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      applicant.isActive 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {applicant.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Passport No</span>
                    <span className="text-gray-800 dark:text-white font-medium">
                      {applicant.passportNo || "-"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Target Country</span>
                    <span className="text-gray-800 dark:text-white font-medium">
                      {applicant.targetCountry || "-"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">School</span>
                    <span className="text-gray-800 dark:text-white font-medium">
                      {applicant.schoolName || "-"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Phone</span>
                    <span className="text-gray-800 dark:text-white font-medium">
                      +977 9812345678
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">Address</span>
                    <span className="text-gray-800 dark:text-white font-medium text-right">
                      Kausaltar, Bhaktapur, Nepal
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
              </div>
            </div>

            {/* Right side - Content area */}
            <div className="col-span-7 space-y-6">
              {/* Top row - Two boxes side by side */}
              <div className="grid grid-cols-2 gap-6">
                {/* Application Details Box */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Application Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Application ID</label>
                      <p className="text-base font-medium text-gray-800 dark:text-white">
                        {applicant.id ? `APP-${applicant.id.substring(0, 8)}` : 'APP-2024-001'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Applied Date</label>
                      <p className="text-base font-medium text-gray-800 dark:text-white">March 15, 2026</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Course Interested</label>
                      <p className="text-base font-medium text-gray-800 dark:text-white">Computer Science</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Preferred Intake</label>
                      <p className="text-base font-medium text-gray-800 dark:text-white">Fall 2026</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 dark:text-gray-400">Education Level</label>
                      <p className="text-base font-medium text-gray-800 dark:text-white">Bachelor's Degree</p>
                    </div>
                  </div>
                </div>

                {/* Documents Status Box */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-400 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Documents Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Passport</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        {applicant.passportNo ? 'Verified' : 'Not Uploaded'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Academic Transcripts</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Pending</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Language Test</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Verified</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">SOP</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Not Uploaded</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Financial Documents</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">In Review</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom box - Visa Processing Content */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-100 dark:border-amber-800">
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-400 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Visa Processing Status
                </h3>
                
                {/* Visa Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Application Submitted</span>
                    <span className="text-gray-600 dark:text-gray-400">Visa Approved</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-amber-600 dark:text-amber-400 font-medium">Step 3 of 5</span>
                    <span className="text-gray-500">65% Complete</span>
                  </div>
                </div>

                {/* Visa Steps */}
                <div className="grid grid-cols-5 gap-2 mb-6">
                  {[
                    { step: 1, label: 'Application', status: 'completed' },
                    { step: 2, label: 'Document Verification', status: 'completed' },
                    { step: 3, label: 'Interview', status: 'current' },
                    { step: 4, label: 'Background Check', status: 'pending' },
                    { step: 5, label: 'Approval', status: 'pending' },
                  ].map((item) => (
                    <div key={item.step} className="text-center">
                      <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-1
                        ${item.status === 'completed' ? 'bg-green-500 text-white' : 
                          item.status === 'current' ? 'bg-amber-500 text-white ring-4 ring-amber-200 dark:ring-amber-800' : 
                          'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        {item.status === 'completed' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          item.step
                        )}
                      </div>
                      <span className={`text-xs font-medium
                        ${item.status === 'completed' ? 'text-green-600 dark:text-green-400' : 
                          item.status === 'current' ? 'text-amber-600 dark:text-amber-400' : 
                          'text-gray-500 dark:text-gray-500'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Visa Details */}
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-amber-200 dark:border-amber-800">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Visa Type</label>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Student Visa (F-1)</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Interview Date</label>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">April 5, 2026 - 10:30 AM</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Embassy</label>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">US Embassy, New Delhi</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">SEVIS ID</label>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">N00-1234-5678</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">I-20 Status</label>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Issued</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Visa Fee</label>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">$160 - Paid</p>
                  </div>
                </div>

                {/* Action Buttons for Visa */}
                <div className="mt-4 flex justify-end space-x-3">
                  <button className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors">
                    Schedule Interview
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                    Upload Documents
                  </button>
                </div>
              </div>
            </div>
          </div>
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