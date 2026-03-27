"use client";

import React, { useState } from "react";
import {
  Plus,
  MessageSquare,
  FileText,
  Calendar,
  Download,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { IStudent } from "@/app/enduser/(StudentManagement)/Student/types/IStudents";
import AddStudentForm from "@/app/enduser/(StudentManagement)/Student/_components/AddStudentForm";

const QuickActions = () => {
  const form = useForm<IStudent>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const actions = [
    {
      icon: Plus,
      label: "Add Student",
      gradient: "from-[#0A53C3] to-[#3B82F6]",
      onClick: () => setIsAddModalOpen(true),
    },
    {
      icon: MessageSquare,
      label: "Send Message",
      gradient: "from-emerald-600 to-emerald-400",
      onClick: () => alert("Send Message clicked!"),
    },
    {
      icon: FileText,
      label: "Generate Report",
      gradient: "from-purple-600 to-pink-500",
      onClick: () => alert("Generate Report clicked!"),
    },
    {
      icon: Calendar,
      label: "Schedule Meeting",
      gradient: "from-orange-500 to-amber-400",
      onClick: () => alert("/meetings"),
    },
    {
      icon: Download,
      label: "Export Data",
      gradient: "from-[#0A53C3] to-indigo-400",
      onClick: () => alert("/export"),
    },
    {
      icon: Users,
      label: "Bulk Email",
      gradient: "from-red-500 to-orange-400",
      onClick: () => alert("/bulk-email"),
    },
  ];

  return (
    <>
      <div className="bg-white dark:bg-[#161B27] rounded-xl shadow-sm border border-gray-200 dark:border-[#1E2A3E] p-6 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-5">
          {/* Primary accent dot */}
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: "#0A53C3" }}
          />
          <h3 className="text-base font-semibold text-gray-800 dark:text-white">
            Quick Actions
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.onClick}
                className="group flex flex-col items-center justify-center p-4 
                  bg-gray-50 dark:bg-[#1E2A3E]/60 
                  border border-gray-100 dark:border-[#1E2A3E]
                  rounded-xl 
                  hover:border-[#0A53C3]/40 dark:hover:border-[#0A53C3]/50
                  hover:bg-[#EBF1FB] dark:hover:bg-[#0A53C3]/10
                  hover:shadow-sm
                  transition-all duration-200"
              >
                <div
                  className={`p-3 bg-gradient-to-br ${action.gradient} rounded-xl mb-3 
                    shadow-sm group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300 text-center leading-tight group-hover:text-[#0A53C3] dark:group-hover:text-[#5B8FE0] transition-colors duration-200">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex ml-12 md:ml-64 sm:ml-16 xs:ml-0 justify-center">
          <div className="bg-white dark:bg-[#161B27] w-full h-full p-6 relative overflow-auto">
            <AddStudentForm
              form={form}
              onClose={() => setIsAddModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;