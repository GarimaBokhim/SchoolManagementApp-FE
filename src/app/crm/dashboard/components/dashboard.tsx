// app/dashboard/components/Dashboard.tsx
"use client";
import React from "react";
import { dashboardStats } from "../data/mock_data";
import StatsCard from "./stats_card";
import QuickActions from "@/app/enduser/dashboard/components/quickActions";
import StudentDestinations from "./student_destination";
import UpcomingDeadlines from "./upcomming_deadline";
import PopularPrograms from "./popular_programs";
import StudentTable from "./student_table";

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Education Consultancy Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage student applications and track study abroad progress
        </p>
      </div>
 {/* Quick Actions */}
      <QuickActions />
      {/* Stats Cards — responsive: 1 col → 2 → 3 → 4 → up to 5 on very wide screens */}
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
  );
};

export default Dashboard;