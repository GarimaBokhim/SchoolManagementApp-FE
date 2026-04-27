'use client'

import { X, Mail, Phone, Calendar, User } from 'lucide-react'
import { Counselor } from '../types/ICounselor'

interface Props {
  counselor: Counselor
  onClose: () => void
}

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr.startsWith('0001')) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
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

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-700/60 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0 mt-0.5">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <div className="text-sm text-gray-800 dark:text-gray-200 font-medium break-all">
        {value || 'N/A'}
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
        {/* ── Header ── */}
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
        <div className="px-6 md:px-8 py-6">
          
          {/* Contact Information */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Contact Information
            </p>
            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <InfoRow
                  icon={<User size={16} className="text-emerald-600 dark:text-emerald-400" />}
                  label="Full Name"
                  value={counselor.fullName}
                />
                <InfoRow
                  icon={<Mail size={16} className="text-blue-600 dark:text-blue-400" />}
                  label="Email"
                  value={counselor.email}
                />
                <InfoRow
                  icon={<Phone size={16} className="text-purple-600 dark:text-purple-400" />}
                  label="Contact Number"
                  value={counselor.contactNumber}
                />
              </div>
            </div>
          </div>

          {/* Activity Information */}
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Activity Information
            </p>
            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <InfoRow
                  icon={<Calendar size={16} className="text-orange-500 dark:text-orange-400" />}
                  label="Created At"
                  value={formatDate(counselor.createdAt)}
                />
                <InfoRow
                  icon={<Calendar size={16} className="text-gray-500 dark:text-gray-400" />}
                  label="Modified At"
                  value={formatDate(counselor.modifiedAt)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
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
  )
}

export default CounselorDetailModal