/* eslint-disable react-hooks/set-state-in-effect */
'use client'
import React, { useEffect, useState } from 'react'
import StatsCard from './stats_card'
import StudentDestinations from './student_destination'
import UpcomingDeadlines from './upcomming_deadline'
import PopularPrograms from './popular_programs'
import StudentTable from './student_table'
import { dashboardStats } from '../data/mock_data'
import DestinationsPieChart from './destinatinoPiechart'
import ConversionsSection from './conversationSection'
import AnnouncementsSection from './announcementSection'
import SchoolInfoCard from '../../../enduser/dashboard/components/SchoolCard'

// ✅ FIXED: was next/router — must be next/navigation in App Router
import { useRouter } from 'next/navigation'

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [schoolId, setSchoolId] = useState('')

  const firstRowStats = dashboardStats.slice(0, 5)
  const secondRowStats = dashboardStats.slice(5, 10)

  // ✅ FIXED: renamed navigate → router (cleaner convention)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    const userDetailsString = localStorage.getItem('userDetails')
    if (userDetailsString) {
      try {
        const parsed = JSON.parse(userDetailsString)
        setSchoolId(parsed.schoolId || '')
      } catch (e) {
        console.error('Failed to parse userDetails', e)
      }
    }

    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="bg-[#FBFBFB] dark:bg-[#0A0A0A] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] transition-colors duration-300">
      <div className="p-6 space-y-6">
        {/* School Info Card */}
        {schoolId ? (
          <SchoolInfoCard schoolId={schoolId} />
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
            <p className="text-yellow-800 dark:text-yellow-200">
              No school selected. Please select a school to view details.
            </p>
          </div>
        )}

        {/* Stats Cards - First Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {firstRowStats.map((stat, index) => (
            <StatsCard key={index} stat={stat} />
          ))}
        </div>

        {/* Stats Cards - Second Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {secondRowStats.map((stat, index) => (
            <StatsCard key={index} stat={stat} />
          ))}
        </div>

        {/* Pie Chart + Conversions + Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DestinationsPieChart />
          <ConversionsSection />
          <AnnouncementsSection />
        </div>

        {/* Student Table */}
        <StudentTable />

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PopularPrograms />
          <UpcomingDeadlines />
          <StudentDestinations />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
