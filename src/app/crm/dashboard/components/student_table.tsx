// src/components/StudentTable.tsx
import React, { useState } from "react";
import { Eye, Edit, Phone, Mail, MoreVertical } from "lucide-react";
import { students } from "../data/mock_data";

type StudentStatus = "active" | "pending" | "rejected";
type ApplicationStage =
  | "Visa Approved"
  | "Documentation"
  | "Offer Received"
  | "Visa Rejected"
  | "Under Review"
  | "Interview Scheduled";

interface Student {
  id: number;
  name: string;
  location: string;
  program: string;
  university: string;
  country: string;
  status: StudentStatus;
  stage: ApplicationStage;
  intake: string;
  applicationDate: string;
}

const StudentTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "active" | "pending" | "rejected" | "all"
  >("active");

  const statusBadge = (status: StudentStatus) => {
    const styles: Record<StudentStatus, string> = {
      active:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
      pending:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
      rejected:
        "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800",
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const stageBadge = (stage: ApplicationStage) => {
    const colors: Record<ApplicationStage, string> = {
      "Visa Approved":
        "bg-[#EBF1FB] text-[#0A53C3] dark:bg-[#0A53C3]/20 dark:text-[#5B8FE0] border border-[#C2D5F5] dark:border-[#0A53C3]/40",
      Documentation:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
      "Offer Received":
        "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800",
      "Visa Rejected":
        "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800",
      "Under Review":
        "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800",
      "Interview Scheduled":
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800",
    };
    return (
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          colors[stage] || "bg-gray-100 text-gray-700"
        }`}
      >
        {stage}
      </span>
    );
  };

  const tabs = ["active", "pending", "rejected", "all"] as const;

  return (
    <div className="bg-white dark:bg-[#161B27] rounded-xl shadow-sm border border-gray-200 dark:border-[#1E2A3E] overflow-hidden transition-colors duration-300">
      {/* Header & Tabs */}
      <div className="p-5 border-b border-gray-100 dark:border-[#1E2A3E]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: "#0A53C3" }}
              />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Student Applications
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-[18px]">
              Track and manage all student applications
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-gray-100 dark:bg-[#0D1117] rounded-lg p-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
                style={
                  activeTab === tab ? { backgroundColor: "#0A53C3" } : {}
                }
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-[#0D1117]/60">
            <tr>
              {[
                "Student",
                "Program & University",
                "Destination",
                "Status",
                "Application Stage",
                "Intake",
                "Actions",
              ].map((col) => (
                <th
                  key={col}
                  className="py-3 px-5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-[#1E2A3E]">
            {(students as Student[])
              .filter(
                (student) =>
                  activeTab === "all" || student.status === activeTab
              )
              .map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-[#EBF1FB]/40 dark:hover:bg-[#0A53C3]/5 transition-colors duration-150"
                >
                  {/* Student */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      {/* Avatar with primary color */}
                      <div
                        className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: "#0A53C3" }}
                      >
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {student.location}, Nepal
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Program & University */}
                  <td className="py-3.5 px-5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {student.program}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {student.university}
                    </p>
                  </td>

                  {/* Destination */}
                  <td className="py-3.5 px-5">
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {student.country}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-5">{statusBadge(student.status)}</td>

                  {/* Stage */}
                  <td className="py-3.5 px-5">{stageBadge(student.stage)}</td>

                  {/* Intake */}
                  <td className="py-3.5 px-5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {student.intake}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Applied: {student.applicationDate}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1">
                      {[Eye, Edit, Phone, Mail, MoreVertical].map(
                        (IconComp, i) => (
                          <button
                            key={i}
                            className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 
                              hover:text-[#0A53C3] dark:hover:text-[#5B8FE0]
                              hover:bg-[#EBF1FB] dark:hover:bg-[#0A53C3]/10
                              transition-all duration-150"
                          >
                            <IconComp className="h-3.5 w-3.5" />
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;