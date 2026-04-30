"use client";
import React from "react";
import StatsCard from "./stats_card";
import StudentDestinations from "./student_destination";
import UpcomingDeadlines from "./upcomming_deadline";
import PopularPrograms from "./popular_programs";
import StudentTable from "./student_table";
import { dashboardStats } from "../data/mock_data";
import DestinationsPieChart from "./destinatinoPiechart";
import ConversionsSection from "./conversationSection";
import AnnouncementsSection from "./announcementSection";

const Dashboard: React.FC = () => {
  const firstRowStats = dashboardStats.slice(0, 5);
  const secondRowStats = dashboardStats.slice(5, 10);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D1117] transition-colors duration-300">
      <div className="p-6 space-y-6">

        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Education Consultancy Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Manage student applications and track study abroad progress
            </p>
          </div>
          <div
            className="hidden md:block h-8 w-1 rounded-full mt-1"
            style={{ backgroundColor: "#0A53C3" }}
          />
        </div>

        {/* Stats Cards - First Row (5 cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {firstRowStats.map((stat, index) => (
            <StatsCard key={index} stat={stat} />
          ))}
        </div>

        {/* Stats Cards - Second Row (5 cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {secondRowStats.map((stat, index) => (
            <StatsCard key={index} stat={stat} />
          ))}
        </div>

        {/* Pie Chart + Conversions + Announcements - Same Row */}
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
  );
};

export default Dashboard;