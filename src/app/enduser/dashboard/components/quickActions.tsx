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
import AddStudentForm from "../../(StudentManagement)/Student/_components/AddStudentForm";
import { IStudent } from "../../(StudentManagement)/Student/types/IStudents";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const QuickActions = () => {
  const form = useForm<IStudent>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();

  const actions = [
    {
      icon: Plus,
      label: "Add Student",
      color: "from-blue-600 to-cyan-500",
      onClick: () => setIsAddModalOpen(true),
    },
    { 
      icon: MessageSquare, 
      label: "Send Message", 
      color: "from-green-600 to-emerald-500", 
      onClick: () => router.push("/enduser/notice"),
    }, 
    { 
      icon: FileText, 
      label: "Generate Report", 
      color: "from-purple-600 to-pink-500", 
      onClick: () => router.push("/enduser/attendanceReport"),
    }, 
    {   
      icon: Calendar, 
      label: "Schedule Meeting", 
      color: "from-orange-600 to-amber-500", 
      onClick: () => router.push("/enduser/Exam"),
    }, 
    {   
      icon: Download, 
      label: "Export Data", 
      color: "from-indigo-600 to-blue-500", 
      onClick: () => router.push("/enduser/miscellaneous/Events"),
    }, 
    {   
      icon: Users, 
      label: "Bulk Email",
      color: "from-red-600 to-orange-500", 
      onClick: () => router.push("/enduser/Student"),
    }, 
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition group"
            >
              <div
                className={`p-3 bg-gradient-to-r ${action.color} rounded-lg mb-3 group-hover:scale-110 transition-transform`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex ml-12 md:ml-64 sm:ml-16 xs:ml-0 justify-center">
          <div className="bg-white dark:bg-gray-800 w-full h-full p-6 relative overflow-auto">
            <AddStudentForm
              form={form}
              onClose={() => setIsAddModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;