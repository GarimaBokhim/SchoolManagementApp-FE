/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { BriefcaseBusiness, User } from "lucide-react";
import StatCard from "./StatCard";
import BarChartSection from "./BarChart";
import PieChartSection from "./PieChart";
import SchoolInfoCard from "./SchoolCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAllNotices } from "../../notice/hooks";
import { useGetAllStudents } from "../../(StudentManagement)/Student/hooks";
import { useGetAllAcademicTeams } from "../../(Staff)/AcademicStaff/hooks";
import { useGetAllSchool } from "@/app/admin/Setup/School/hooks";
import QuickActions from "./quickActions";

const Dashboard: React.FC = () => {
  const [schoolId, setSchoolId] = useState("");
  const navigate = useRouter();

  const { data: allNotice } = useGetAllNotices();
  const { data: students } = useGetAllStudents();
  const { data: staffs } = useGetAllAcademicTeams();
  const { data: school } = useGetAllSchool();

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
  }, [navigate]);

  const cards = [
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
    {
      cardHead: "Total School",
      cardStats: String(school?.TotalItems ?? 0),
      cardStyle: "!bg-orange-500/30",
      cardIcon: <BriefcaseBusiness className="text-orange-400 text-4xl" />,
    },
  ];

  return (
    <div className="bg-[#FBFBFB] dark:bg-[#0A0A0A]">
      <div className="p-6 flex flex-col gap-6">
        <SchoolInfoCard schoolId={schoolId} />

        <StatCard cards={cards} />

        {/* Charts */}
        <div className="flex gap-6 h-[28rem]">
          <div className="w-[70%]">
            <BarChartSection />
          </div>
          <div className="w-[30%]">
            <PieChartSection />
          </div>
        </div>

        {/* Package + Notices + Activities */}
        <div className="flex gap-6">
          {/* Package Type */}
          <div className="w-[40%] h-[20rem]">
            <div className="h-full bg-white dark:bg-[#171717] p-8 rounded-2xl border border-[#4e97f1]">
              <h3 className="text-lg font-bold text-[#227ded] tracking-wider mb-6">
                PACKAGE TYPE
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center space-y-2">
                  <div className="border border-[#4e97f1] rounded-xl p-4">
                    <p className="text-xs uppercase">Premium</p>
                    <p className="text-2xl font-bold text-[#4e97f1]">5</p>
                  </div>
                  <div className="border border-[#4e97f1] rounded-xl p-4">
                    <p className="text-xs uppercase">Basic</p>
                    <p className="text-2xl font-bold text-emerald-400">10</p>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div className="border border-[#4e97f1] rounded-xl p-4">
                    <p className="text-xs uppercase">Gold</p>
                    <p className="text-2xl font-bold text-yellow-400">4</p>
                  </div>
                  <div className="border border-[#4e97f1] rounded-xl p-4">
                    <p className="text-xs uppercase">Silver</p>
                    <p className="text-2xl font-bold text-red-400">20</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-[60%] flex flex-col gap-6">
            {/* Notices + Activities row */}
            <div className="flex gap-6 h-[20rem]">
              {/* Notices */}
              <div className="w-1/2 bg-white dark:bg-[#171717] p-6 rounded-2xl border border-[#4e97f1]">
                <h3 className="text-lg font-bold text-[#4e97f1] mb-4">
                  LATEST NOTICES
                </h3>

                <div className="space-y-3 overflow-y-auto max-h-[13rem] pr-2">
                  {allNotice?.map((n, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-[#2a2a2a]"
                    >
                      <h4 className="text-sm font-semibold line-clamp-1">
                        {n.title}
                      </h4>
                      <p className="text-xs mt-1 line-clamp-2">
                        {n.shortDescription}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        {n.createdAt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="w-1/2 bg-white dark:bg-[#171717] p-6 rounded-2xl border border-[#4e97f1]">
                <h3 className="text-lg font-bold text-[#4e97f1] mb-4">
                  RECENT ACTIVITIES
                </h3>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#2a2a2a]">
                    Purchased New Feature by Reliance School
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#2a2a2a]">
                    Subscription about to expire of Mother School
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
            <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
