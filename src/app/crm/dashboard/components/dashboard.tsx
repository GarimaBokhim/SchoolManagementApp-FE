"use client";
import React from "react";
import { dashboardStats } from "../data/mock_data";
import StatsCard from "./stats_card";
import StudentDestinations from "./student_destination";
import UpcomingDeadlines from "./upcomming_deadline";
import PopularPrograms from "./popular_programs";
import StudentTable from "./student_table";
import QuickActions from "./quickActionscrm";

const Dashboard: React.FC = () => {
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
          {/* Primary color accent bar under title */}
          <div
            className="hidden md:block h-8 w-1 rounded-full mt-1"
            style={{ backgroundColor: "#0A53C3" }}
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {dashboardStats.map((stat, index) => (
            <StatsCard key={index} stat={stat} />
          ))}
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