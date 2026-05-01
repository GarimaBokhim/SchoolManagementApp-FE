'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export interface StatItem {
  label: string
  count: number | string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  route?: string
}

interface StatsCardProps {
  stat: StatItem
}

const StatsCard: React.FC<StatsCardProps> = ({ stat }) => {
  const Icon = stat.icon
  const router = useRouter()

  const handleClick = () => {
    if (stat.route) {
      router.push(stat.route)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`
        group
        bg-white dark:bg-[#161B27]
        rounded-xl shadow-sm
        border border-gray-200 dark:border-[#1E2A3E]
        p-5 flex items-center gap-4
        transition-all duration-200
        ${
          stat.route
            ? 'cursor-pointer hover:shadow-md hover:border-[#0A53C3]/40 dark:hover:border-[#0A53C3]/50 hover:-translate-y-0.5'
            : 'cursor-default hover:shadow-sm'
        }
      `}
    >
      {/* Icon bubble */}
      <div
        className={`
          flex-shrink-0 w-13 h-13 w-12 h-12 rounded-xl
          flex items-center justify-center
          ${stat.iconBg}
          group-hover:scale-105 transition-transform duration-200
        `}
      >
        <Icon className={`w-5 h-5 ${stat.iconColor}`} />
      </div>

      {/* Label & Count */}
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-tight truncate">
          {stat.label}
        </span>
        <span className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5 tabular-nums">
          {stat.count}
        </span>
      </div>

      {/* Arrow — only for clickable cards */}
      {stat.route && (
        <div
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
          style={{ color: '#0A53C3' }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </div>
  )
}

export default StatsCard
