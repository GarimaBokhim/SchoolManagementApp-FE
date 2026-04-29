'use client'

import { X, CalendarDays, Clock, User, UserCheck, FileText, Globe, GraduationCap, BookOpen } from 'lucide-react'
import { Appointment } from '../types/IAppointment'
import { useGetLeadEnquiryDetails } from '../hooks'

interface Props {
  appointment: Appointment
  leadMap: Record<string, string>
  counselorMap: Record<string, string>
  countryMap: Record<string, string>
  universityMap: Record<string, string>
  courseMap: Record<string, string>
  onClose: () => void
}

const APPOINTMENT_STATUS_LABELS: Record<number, string> = {
  1: 'Scheduled',
  2: 'Completed',
  3: 'Cancelled',
  4: 'No Show',
}

const STATUS_STYLES: Record<number, string> = {
  1: 'bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700',
  2: 'bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700',
  3: 'bg-red-100 text-red-700 border border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700',
  4: 'bg-yellow-100 text-yellow-700 border border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700',
}

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr.startsWith('0001')) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

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

const EnquirySection = ({
  leadId,
  countryMap,
  universityMap,
  courseMap,
}: {
  leadId: string
  countryMap: Record<string, string>
  universityMap: Record<string, string>
  courseMap: Record<string, string>
}) => {
  const { data: enquiry, isLoading } = useGetLeadEnquiryDetails(leadId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500" />
      </div>
    )
  }

  if (!enquiry?.Countries || enquiry.Countries.length === 0) {
    return (
      <div className="flex flex-col items-center py-6 text-gray-400 dark:text-gray-500">
        <Globe size={32} className="mb-2 opacity-40" />
        <p className="text-sm italic">No enquiry details found.</p>
      </div>
    )
  }

  // Deduplicate by countryId
  const seen = new Set<string>()
  const uniqueCountries = enquiry.Countries.filter((c: any) => {
    if (seen.has(c.countryId)) return false
    seen.add(c.countryId)
    return true
  })

  return (
    <div className="space-y-3">
      {uniqueCountries.map((country: any, ci: number) => (
        <div
          key={ci}
          className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Country Header */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-800/40">
            <Globe size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {countryMap[country.countryId] ?? country.countryId}
            </span>
          </div>

          {/* Universities */}
          <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {country.Universities?.map((uni: any, ui: number) => (
              <div key={ui} className="px-4 py-3">
                {/* University */}
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap size={13} className="text-blue-500 dark:text-blue-400 shrink-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {universityMap[uni.universityId] ?? uni.universityId}
                  </span>
                </div>

                {/* Courses */}
                {uni.CourseIds?.length > 0 && (
                  <div className="ml-5 flex flex-wrap gap-1.5">
                    {uni.CourseIds.map((courseId: string, cIdx: number) => (
                      <span
                        key={cIdx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50"
                      >
                        <BookOpen size={10} />
                        {courseMap[courseId] ?? courseId}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

const AppointmentDetailModal = ({
  appointment,
  leadMap,
  counselorMap,
  countryMap,
  universityMap,
  courseMap,
  onClose,
}: Props) => {
  const statusLabel = APPOINTMENT_STATUS_LABELS[appointment.appointmentStatus] ?? 'Unknown'
  const statusStyle = STATUS_STYLES[appointment.appointmentStatus] ?? 'bg-gray-100 text-gray-600'

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
        {/* ── Modal Header ── */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 md:px-8 py-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={18} className="text-white" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <CalendarDays size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Appointment Details</h2>
              <p className="text-emerald-100 text-sm mt-0.5">
                {formatDate(appointment.appointmentDate)}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-4">
            <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyle}`}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* ── Modal Body ── */}
        <div className="px-6 md:px-8 py-6">

          {/* Appointment Info in Grid Format */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Appointment Information
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                icon={<User size={16} className="text-emerald-600 dark:text-emerald-400" />}
                label="Lead"
                value={leadMap[appointment.leadId] || 'Unknown'}
              />
              <InfoCard
                icon={<UserCheck size={16} className="text-blue-600 dark:text-blue-400" />}
                label="Counselor"
                value={counselorMap[appointment.counselorId] || 'Unknown'}
              />
              <InfoCard
                icon={<Clock size={16} className="text-purple-600 dark:text-purple-400" />}
                label="Time"
                value={`${appointment.startTime} – ${appointment.endTime}`}
              />
              <InfoCard
                icon={<FileText size={16} className="text-orange-500 dark:text-orange-400" />}
                label="Notes"
                value={appointment.notes || 'N/A'}
              />
            </div>
          </div>

          {/* Enquiry Details */}
          <div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Enquiry Details
            </p>
            <EnquirySection
              leadId={appointment.leadId}
              countryMap={countryMap}
              universityMap={universityMap}
              courseMap={courseMap}
            />
          </div>
        </div>

        {/* ── Modal Footer ── */}
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

export default AppointmentDetailModal