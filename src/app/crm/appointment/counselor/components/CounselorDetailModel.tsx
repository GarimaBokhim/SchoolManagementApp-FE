'use client'

import { X, Mail, Phone, User, BookOpen } from 'lucide-react'
import { Counselor } from '../types/ICounselor'
import LeadEnquiryCard from '@/app/crm/applications/leads/components/LeadInquiryCard'

interface Props {
  counselor: Counselor
  onClose: () => void
}

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span
    className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
      isActive
        ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700'
        : 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700'
    }`}
  >
    {isActive ? 'Active' : 'Inactive'}
  </span>
)

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) => (
  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center shrink-0 shadow-sm">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
          {label}
        </p>
        <div className="text-sm text-gray-800 dark:text-gray-200 font-medium break-all">
          {value || 'N/A'}
        </div>
      </div>
    </div>
  </div>
)

const CounselorDetailModal = ({ counselor, onClose }: Props) => {
  const initials = counselor.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // counselor.id is used as leadId — adjust the field name if your Counselor type uses a different key
  const leadId = counselor.id
  const leadName = counselor.fullName

  return (
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center
                 bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
      onClick={onClose}
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a]
                   w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[75vw]
                   max-h-[95vh] md:max-h-[92vh]
                   rounded-lg overflow-hidden shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div className="shrink-0 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 md:px-8 py-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={18} className="text-white" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{counselor.fullName}</h2>
              <p className="text-emerald-100 text-sm mt-0.5">Counselor</p>
              <div className="mt-2">
                <StatusBadge isActive={counselor.isActive} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">

          {/* Left: Contact Info */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Contact Information
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                icon={<User size={16} className="text-emerald-600 dark:text-emerald-400" />}
                label="Full Name"
                value={counselor.fullName}
              />
              <InfoCard
                icon={<Mail size={16} className="text-blue-600 dark:text-blue-400" />}
                label="Email"
                value={counselor.email}
              />
              <InfoCard
                icon={<Phone size={16} className="text-purple-600 dark:text-purple-400" />}
                label="Contact Number"
                value={counselor.contactNumber}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-gray-200 dark:bg-gray-700 shrink-0" />
          <div className="block lg:hidden h-px bg-gray-200 dark:bg-gray-700 mx-6 shrink-0" />

          {/* Right: Lead Enquiry Details */}
          <div className="lg:w-80 xl:w-96 shrink-0 overflow-y-auto px-6 md:px-8 py-6">
            
            <LeadEnquiryCard leadId={leadId} leadName={leadName} />
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 px-6 md:px-8 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}

export default CounselorDetailModal