'use client'

import React, { useState } from 'react'
import { X, User, FileText, GraduationCap, Calendar, DollarSign, Mail, MessageSquare, CreditCard, Award, BookOpen, Clock, FileCheck, FileSignature, Send, CheckCircle, FileWarning, Banknote, Plane, Stamp, XCircle, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useDocumentStatus, useUserProfileById } from '../hooks'
import VisaProcessingStatusForm from './VisaProcessingStatusForm'
import ApplicationDetailsForm from './ApplicationDetailsForm'


const getInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
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



const UserProfilePopupForm = ({ isOpen, onClose, applicant }: UserProfilePopupProps) => {

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {
        data: statusData,
        isLoading: statusLoading,
    } = useDocumentStatus({
        applicantId: applicant?.id ?? '',
        pageIndex,
        pageSize,
    });

    const DocumentStatusTypes = [
        { id: 1, name: 'Pending' },
        { id: 2, name: 'Approved' },
        { id: 3, name: 'Rejected' },
        { id: 4, name: 'ActionRequired' }
    ];

    const EnrolmentType = [
        { id: 1, name: 'Lead' },
        { id: 2, name: 'Applicant' },
        { id: 3, name: 'Student' },
        { id: 4, name: 'Counseling' },
        { id: 5, name: 'Qualified' },
        { id: 6, name: 'Rejected' },
        { id: 7, name: 'New' }
    ];

    const GenderType = [
        { id: 1, name: 'Male' },
        { id: 2, name: 'Female' },
        { id: 3, name: 'Others' }
    ];

    const DocumentsStatusDetails = statusData?.items ?? [];
    const userId = applicant?.userId ?? applicant?.id ?? null

    const {
        data: profile,
        isError,
        isLoading,
    } = useUserProfileById(userId)

    if (!isOpen || !applicant) {
        return null
    }

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
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                <div className="lg:col-span-4">
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 h-full flex flex-col">
                                        {isLoading ? (
                                            <ProfileSkeleton />
                                        ) : (
                                            <>
                                                <div className="flex flex-col items-center text-center mb-4">
                                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mb-3">
                                                        <span className="text-2xl font-bold text-white">
                                                            {getInitials(profile?.fullName ?? applicant.fullName ?? 'Unknown User')}
                                                        </span>
                                                    </div>
                                                    <div className="w-full">
                                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                                                            {profile?.fullName ?? applicant.fullName ?? 'Unknown User'}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 break-all">
                                                            {profile?.email ?? applicant.email ?? 'No email provided'}
                                                        </p>
                                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold`}>
                                                            {EnrolmentType.find(
                                                                (s) => s.id === Number(profile?.enrolmentType)
                                                            )?.name}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex-1 space-y-2">

                                                    {/* <div className="flex justify-between items-center py-1.5 border-b border-gray-200 dark:border-gray-700">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Admission Date</span>
                                                        <span className="text-xs font-semibold text-gray-800 dark:text-white">
                                                            {formatDate(profile?.admissionDate)}
                                                        </span>
                                                    </div> */}

                                                    <div className="flex justify-between items-center py-1.5 border-b border-gray-200 dark:border-gray-700">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email</span>
                                                        <span className="text-xs font-semibold text-gray-800 dark:text-white truncate ml-2">
                                                            {profile?.email ?? applicant.email ?? 'No email provided'}
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between items-center py-1.5 border-b border-gray-200 dark:border-gray-700">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Gender</span>
                                                        <span className="text-xs font-semibold text-gray-800 dark:text-white">
                                                            {GenderType.find(
                                                                (s) => s.id === Number(profile?.genderStatus)
                                                            )?.name}
                                                        </span>
                                                    </div>

                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Application Details Card - Reduced padding */}
                                <div className="lg:col-span-4">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800 h-full">
                                        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-400 mb-3 flex items-center gap-2">
                                            <FileText size={16} />
                                            Application Details
                                        </h3>
                                        {isLoading ? (
                                            <div className="animate-pulse space-y-2">
                                                {Array.from({ length: 6 }).map((_, i) => (
                                                    <div key={i} className="h-3 bg-blue-100 dark:bg-blue-900/30 rounded w-3/4" />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <div className="flex justify-between py-1.5 border-b border-blue-100 dark:border-blue-800">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">Application ID</span>
                                                    <span className="text-xs font-medium text-gray-800 dark:text-white">
                                                        {profile?.applicantId || '-'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between py-1.5 border-b border-blue-100 dark:border-blue-800">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">Applied Date</span>
                                                    <span className="text-xs font-medium text-gray-800 dark:text-white">
                                                        {profile?.admissionDate || '-'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between py-1.5 border-b border-blue-100 dark:border-blue-800">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">Interested Country</span>
                                                    <span className="text-xs font-medium text-gray-800 dark:text-white">
                                                        {profile?.intrestedCountry || '-'}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between py-1.5 border-b border-blue-100 dark:border-blue-800">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">Interested University</span>
                                                    <span className="text-xs font-medium text-gray-800 dark:text-white">
                                                        {profile?.intrestedUniversity || '-'}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between py-1.5 border-b border-blue-100 dark:border-blue-800">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">Interested Course</span>
                                                    <span className="text-xs font-medium text-gray-800 dark:text-white">
                                                        {profile?.intrestedCourse || '-'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between py-1.5 border-b border-blue-100 dark:border-blue-800">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">Preferred Intake</span>
                                                    <span className="text-xs font-medium text-gray-800 dark:text-white">
                                                        {profile?.intakeTitle || '-'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Document Status Card - Reduced padding */}
                                <div className="lg:col-span-4">
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800 h-full">
                                        <h3 className="text-sm font-semibold text-green-800 dark:text-green-400 mb-3 flex items-center gap-2">
                                            <FileText size={16} />
                                            Documents Status
                                        </h3>
                                        <div className="space-y-2">
                                            {DocumentsStatusDetails.map((doc) => (
                                                <div key={doc.id} className="flex justify-between items-center py-1.5 border-b border-green-100 dark:border-green-800 last:border-0">
                                                    <span className="text-xs text-gray-600 dark:text-gray-400">{doc.documentName}</span>
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full`}>
                                                        {DocumentStatusTypes.find(
                                                            (s) => s.id === Number(doc.documentStatus)
                                                        )?.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Visa Processing Status Card - KEPT AS IS */}
                            <VisaProcessingStatusForm ApplicantId={applicant?.id ?? ""} />

                            {/* Row 3: Tabs with Visa Timeline inside VISA tab */}
                            <ApplicationDetailsForm ApplicantId={applicant?.id ?? ""} />


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

export default UserProfilePopupForm