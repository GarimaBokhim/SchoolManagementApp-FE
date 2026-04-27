'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { IStudent } from '../types/IStudents'
import { useGetClassById } from '@/app/enduser/(Academics)/Class/hooks'
import { useGetParentById } from '../../_Parent/hooks'
import { useGetStudentById } from '../hooks'
import {
  useGetAllProvince,
  useGetDistrictByProvince,
  useGetMunicipalityByDistrict,
  useGetVDCByDistrict,
} from '@/components/common/hooks'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

// ─── maps ─────────────────────────────────────────────────────────────────────

const ENROLLMENT_STATUS_MAP: Record<number, { label: string; color: string }> = {
  1: { label: 'Active',    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  2: { label: 'Promoted',  color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  3: { label: 'Repeated',  color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  4: { label: 'Graduated', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  5: { label: 'Dropped',   color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  6: { label: 'Added',     color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  7: { label: 'Enrolled',  color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
}

const GENDER_STATUS_MAP: Record<number, string> = { 1: 'Male', 2: 'Female', 3: 'Other' }

const STUDENT_STATUS_MAP: Record<number, { label: string; color: string }> = {
  0: { label: 'Active',   color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  1: { label: 'Inactive', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

const getEnrollmentInfo = (type?: number) =>
  type ? (ENROLLMENT_STATUS_MAP[type] ?? { label: 'Unknown', color: 'bg-gray-100 text-gray-700' })
       : { label: 'Not Set', color: 'bg-gray-100 text-gray-700' }

const getStudentStatusInfo = (status?: number) =>
  status !== undefined
    ? (STUDENT_STATUS_MAP[status] ?? { label: 'Unknown', color: 'bg-gray-100 text-gray-700' })
    : { label: 'Not Set', color: 'bg-gray-100 text-gray-700' }

const getInitials = (firstName?: string, lastName?: string, middleName?: string | null) =>
  ((firstName?.charAt(0) ?? '') + (middleName?.charAt(0) ?? '') + (lastName?.charAt(0) ?? ''))
    .toUpperCase()
    .substring(0, 2) || 'S'

const formatDate = (date?: Date | string | null) => {
  if (!date) return '-'
  try {
    const d = date instanceof Date ? date : new Date(date)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return '-'
  }
}

// ─── component ────────────────────────────────────────────────────────────────

interface StudentProfilePopupProps {
  student: IStudent | null
  onClose: () => void
  schoolDetail?: { name: string; address?: string } | null
}

const StudentProfilePopup = ({ student, onClose, schoolDetail }: StudentProfilePopupProps) => {
  const [imgError, setImgError] = useState(false)

  // ── Fetch FULL student record so location IDs are populated ──────────────────
  // The list API returns provinceId/districtId as 0; the detail API has the real values.
  const { data: fullStudent } = useGetStudentById(student?.id ?? '')

  // Use full record when available, fall back to the prop for other fields
  const s = fullStudent ?? student

  // Numeric IDs derived from the full record (> 0 means actually set)
  const provinceId     = s?.provinceId     ? Number(s.provinceId)     : undefined
  const districtId     = s?.districtId     ? Number(s.districtId)     : undefined
  const municipalityId = s?.municipalityId ? Number(s.municipalityId) : undefined
  const vdcId          = (s as any)?.vdcid ? Number((s as any).vdcid) : undefined

  // ── All hooks must be called unconditionally before any early return ──────────
  const { data: classDetail,  isLoading: isClassLoading  } = useGetClassById(s?.classId ?? '')
  const { data: parentDetail, isLoading: isParentLoading } = useGetParentById(s?.parentId ?? '')

  const { data: allProvince }          = useGetAllProvince()
  const { data: filteredDistrict }     = useGetDistrictByProvince(provinceId)
  const { data: filteredMunicipality } = useGetMunicipalityByDistrict(districtId)
  const { data: filteredVdc }          = useGetVDCByDistrict(districtId)

  // ── Early return after all hooks ─────────────────────────────────────────────
  if (!student) return null

  // ── Derived display values ────────────────────────────────────────────────────
  const displayName       = `${student.firstName} ${student.middleName || ''} ${student.lastName}`.trim()
  const enrollmentInfo    = getEnrollmentInfo(student.enrollmentStatus)
  const studentStatusInfo = getStudentStatusInfo(student.studentStatus)
  const className         = isClassLoading  ? 'Loading...' : (classDetail?.name      || '-')
  const parentName        = isParentLoading ? 'Loading...' : (parentDetail?.fullName  || '-')

  // ── Location name resolution ─────────────────────────────────────────────────
  const provinceName =
    (provinceId && allProvince?.Items)
      ? (allProvince.Items.find(p => p.Id === provinceId)?.provinceNameInEnglish || '-')
      : '-'

  const districtName =
    (districtId && filteredDistrict)
      ? (filteredDistrict.find(d => d.Id === districtId)?.districtNameInEnglish || '-')
      : '-'

  const municipalityName =
    (municipalityId && filteredMunicipality)
      ? (filteredMunicipality.find(m => m.Id === municipalityId)?.MunicipalityNameinEnglish || '-')
      : '-'

  const vdcName =
    (vdcId && filteredVdc)
      ? (filteredVdc.find(v => v.Id === vdcId)?.VdcNameInEnglish || '-')
      : '-'

  // ── Image URL ─────────────────────────────────────────────────────────────────
  const imageUrl = student.imageUrl ? `${BASE_URL}/${student.imageUrl}` : null

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
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Student Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Left — Profile Card */}
            <div className="md:col-span-5">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-full">
                {/* Avatar + Name */}
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                    {imageUrl && !imgError ? (
                      <img
                        src={imageUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <span className="text-3xl font-bold text-white">
                        {getInitials(student.firstName, student.lastName, student.middleName)}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">{displayName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {student.email || 'No email provided'}
                  </p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${enrollmentInfo.color}`}>
                    {enrollmentInfo.label}
                  </span>
                </div>

                {/* Profile Details */}
                <div className="space-y-3">
                  {[
                    { label: 'Student Status', value: (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${studentStatusInfo.color}`}>
                        {studentStatusInfo.label}
                      </span>
                    )},
                    { label: 'Registration No', value: student.registrationNumber || '-' },
                    { label: 'Admission No',    value: student.admissionNumber    || '-' },
                    { label: 'Gender',          value: GENDER_STATUS_MAP[student.genderStatus] || '-' },
                    { label: 'Date of Birth',   value: formatDate(student.dateOfBirth) },
                    { label: 'Phone Number',    value: student.phoneNumber || '-' },
                    { label: 'Address',         value: student.address     || '-' },
                  ].map(({ label, value }, i, arr) => (
                    <div
                      key={label}
                      className={`flex justify-between py-2 ${i < arr.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                    >
                      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                      <span className="text-sm text-gray-800 dark:text-white font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Send Message
                  </button>
                  <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                    View Reports
                  </button>
                </div>
              </div>
            </div>

            {/* Right — Info Boxes */}
            <div className="md:col-span-7 space-y-6">

              {/* Academic Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  Academic Information
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Class</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{className}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Section</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{student.classSectionId || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enrollment Date</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{formatDate(student.enrollmentDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enrollment Status</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 ${enrollmentInfo.color}`}>
                      {enrollmentInfo.label}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Student ID</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {student.id ? `STU-${student.id.substring(0, 8).toUpperCase()}` : '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-100 dark:border-emerald-800">
                <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location Details
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Province</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{provinceName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">District</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{districtName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Municipality</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{municipalityName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">VDC</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{vdcName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ward Number</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{s?.wardNumber || '-'}</p>
                  </div>
                </div>
              </div>

              {/* School & Parent Information */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  School &amp; Parent Information
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'School',         value: schoolDetail?.name    || '-' },
                    { label: 'Parent Name',    value: parentName },
                    { label: 'Parent Phone',   value: isParentLoading ? 'Loading...' : (parentDetail?.phoneNumber || '-') },
                    { label: 'School Address', value: schoolDetail?.address || '-' },
                  ].map(({ label, value }, i, arr) => (
                    <div
                      key={label}
                      className={`flex justify-between items-center py-2 ${i < arr.length - 1 ? 'border-b border-purple-100 dark:border-purple-800' : ''}`}
                    >
                      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-white text-right">{value}</span>
                    </div>
                  ))}
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

export default StudentProfilePopup