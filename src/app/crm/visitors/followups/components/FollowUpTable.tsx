// src/app/crm/applications/followups/components/followup_ui_components/FollowUpTable.tsx

'use client'

import { FOLLOW_UP_STATUS_MAP, FollowUp } from "../types/IFollowUps"


interface FollowUpTableProps {
  followUps: FollowUp[]
  loading: boolean
  currentPage: number
  pageSize: number
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return '-'
  }
}

const formatTime = (timeStr: string) => {
  if (!timeStr) return '-'
  try {
    const [hour, minute] = timeStr.split(':').map(Number)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 === 0 ? 12 : hour % 12
    return `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`
  } catch {
    return timeStr
  }
}

const StatusBadge = ({ status }: { status: number }) => {
  const info = FOLLOW_UP_STATUS_MAP[status] ?? {
    label: 'Unknown',
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  }
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${info.color}`}>
      {info.label}
    </span>
  )
}

export const FollowUpTable = ({
  followUps,
  loading,
  currentPage,
  pageSize,
}: FollowUpTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="bg-gray-50 dark:text-white text-gray-700 dark:bg-[#80878c] uppercase text-sm font-semibold border-b border-gray-200">
            <th className="px-4 py-3 text-left w-[60px]">S.N</th>
            <th className="px-4 py-3 text-left">Follow Up Date</th>
            <th className="px-4 py-3 text-left">Start Time</th>
            <th className="px-4 py-3 text-left">End Time</th>
            <th className="px-4 py-3 text-left">Notes</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">
                Loading Follow Ups...
              </td>
            </tr>
          ) : followUps.length > 0 ? (
            followUps.map((followUp, index) => (
              <tr
                key={followUp.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:text-gray-100 text-gray-700"
              >
                <td className="py-1 px-4">
                  {((currentPage - 1) * pageSize + index + 1)
                    .toString()
                    .padStart(2, '0')}
                </td>
                <td className="py-1 px-4">{formatDate(followUp.followUpDate)}</td>
                <td className="py-1 px-4">{formatTime(followUp.startTime)}</td>
                <td className="py-1 px-4">{formatTime(followUp.endTime)}</td>
                <td className="py-1 px-4 max-w-[200px] truncate" title={followUp.notes}>
                  {followUp.notes && followUp.notes !== 'string' ? followUp.notes : '-'}
                </td>
                <td className="py-1 px-4">
                  <StatusBadge status={followUp.followUpStatus} />
                </td>
                <td className="py-1 px-4">{formatDate(followUp.createdAt)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500 italic">
                No Follow Ups found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}