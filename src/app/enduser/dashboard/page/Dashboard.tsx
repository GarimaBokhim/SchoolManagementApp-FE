/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { BriefcaseBusiness, CreditCard, User } from "lucide-react";
import StatCard from "../components/StatCard";
import BarChartSection from "../components/BarChart";
import SchoolInfoCard from "../components/SchoolCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAllNotices } from "../../notice/hooks";
import { useGetAllStudents } from "../../(StudentManagement)/Student/hooks";
import { useGetAllAcademicTeams } from "../../(Staff)/AcademicStaff/hooks";
import { useGetAllSchool } from "@/app/admin/Setup/School/hooks";
import QuickActions from "../components/quickActions";
import EventSchedule from "../../(StudentManagement)/curricularActivities/pages/schedulePage/EventSchedule";
import { useGetTotalFeeDetails } from "../../schoolFee/_StudentFee/hooks";

const Dashboard: React.FC = () => {
  const [schoolId, setSchoolId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useRouter();

  const { data: allNotice, isLoading: noticesLoading } = useGetAllNotices();
  const { data: students, isLoading: studentsLoading } = useGetAllStudents();
  const { data: staffs, isLoading: staffsLoading } = useGetAllAcademicTeams();
  const { data: school, isLoading: schoolLoading } = useGetAllSchool();
  const { data: feeDetails, isLoading: feeDetailsLoading } = useGetTotalFeeDetails(); // 👈 new

  useEffect(() => {
    const userDetailsString = localStorage.getItem("userDetails");

    if (userDetailsString) {
      try {
        const parsed = JSON.parse(userDetailsString);
        setSchoolId(parsed.schoolId || "");
      } catch (e) {
        console.error("Failed to parse userDetails", e);
      }
    }

    const token = localStorage.getItem("token");
    if (!token) navigate.push("/");

    setIsLoading(false);
  }, [navigate]);

  if (
    isLoading ||
    studentsLoading ||
    staffsLoading ||
    schoolLoading ||
    noticesLoading ||
    feeDetailsLoading // 👈 new
  ) {
    return (
      <div className="bg-[#FBFBFB] dark:bg-[#0A0A0A] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      cardHead: "Total Fee Amount",
      cardStats: String(feeDetails?.totalFeeAmount ?? 0), // 👈 dynamic
      cardStyle: "!bg-blue-500/30",
      cardStatUnit: "Rs.",
      cardIcon: <BriefcaseBusiness className="text-blue-400 text-4xl" />,
    },
    {
      cardHead: "Fee Collected",
      cardStats: String(feeDetails?.totalFeeCollected ?? 0), // 👈 dynamic
      cardStyle: "!bg-emerald-500/30",
      cardStatUnit: "Rs.",
      cardIcon: <CreditCard className="text-emerald-400 text-4xl" />,
    },
    {
      cardHead: "Due Amount",
      cardStats: String(feeDetails?.totalDueAmount ?? 0), // 👈 dynamic
      cardStyle: "!bg-red-500/30",
      cardStatUnit: "Rs.",
      cardIcon: <CreditCard className="text-red-400 text-4xl" />,
    },
    {
      cardHead: "Total Students",
      cardStats: String(students?.TotalItems ?? 0),
      cardIcon: <User className="text-green-400 text-4xl" />,
    },
    {
      cardHead: "Total Staffs",
      cardStats: String(staffs?.TotalItems ?? 0),
      cardStyle: "!bg-orange-500/30",
      cardIcon: <BriefcaseBusiness className="text-orange-400 text-4xl" />,
    },
  ];

  return (
    <div className="bg-[#FBFBFB] dark:bg-[#0A0A0A]">
      <div className="p-6 flex flex-col gap-6">
        {schoolId && <SchoolInfoCard schoolId={schoolId} />}

        {!schoolId && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
            <p className="text-yellow-800 dark:text-yellow-200">
              No school selected. Please select a school to view details.
            </p>
          </div>
        )}

        <QuickActions />
        <StatCard cards={cards} />

        <div className="flex gap-6">
          <div className="w-[70%]">
            <BarChartSection />
          </div>

          <div className="w-[30%] bg-white dark:bg-[#171717] p-6 rounded-2xl border border-[#4e97f1] overflow-auto">
            <h3 className="text-lg font-bold text-[#4e97f1] mb-4 sticky top-0 bg-white dark:bg-[#171717] pb-2">
              LATEST NOTICES
            </h3>
            <div className="space-y-3">
              {allNotice && allNotice.length > 0 ? (
                allNotice.slice(0, 5).map((n, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-[#2a2a2a] hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <h4 className="text-sm font-semibold line-clamp-1">{n.title}</h4>
                    <p className="text-xs mt-1 line-clamp-2 text-gray-600 dark:text-gray-400">
                      {n.shortDescription}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-2 block">{n.createdAt}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No notices available
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="bg-white dark:bg-[#171717] rounded-2xl border border-[#4e97f1] p-4">
            <h3 className="text-lg font-bold text-[#4e97f1] mb-4">EVENT SCHEDULE</h3>
            <div className="h-[500px] overflow-auto">
              <EventSchedule />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;