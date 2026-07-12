/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { School, User, UserCog, Shield, Users, Building2 } from "lucide-react";
import StatCard from "./StatCard";
import BarChartSection from "./BarChart";
import PieChartSection from "./PieChart";
import SchoolInfoCard from "./SchoolCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAllSchool } from "../../Setup/School/hooks";
import { useGetAllRoles } from "@/app/SuperAdmin/accessControl/roles/hooks";
import { useGetAllUsers } from "@/app/SuperAdmin/accessControl/user/hooks";
import { useGetAllInstitution } from "@/app/SuperAdmin/institutionSetup/Institution/hooks";

const Dashboard: React.FC = () => {
  const [schoolId, setSchoolId] = useState("");
  const navigate = useRouter();

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

  // Fetch counts from APIs
  const { data: schools } = useGetAllSchool();
  const { data: roles } = useGetAllRoles();
  const { data: users } = useGetAllUsers();
  const { data: institutions } = useGetAllInstitution();


  // Build cards dynamically
  const cards = [

    {
      cardHead: "Total Role",
      cardStats: String(roles?.TotalItems ?? 0),
      cardStyle: "!bg-blue-500/30",
      cardIcon: <UserCog className="text-blue-400 text-4xl" />,
    },
    {
      cardHead: "Total User",
      cardStats: String(users?.TotalItems ?? 0),
      cardStyle: "!bg-red-500/30",
      cardIcon: <User className="text-red-400 text-4xl" />,
    },
    {
      cardHead: "Total Institution",
      cardStats: String(institutions?.TotalItems ?? 0),
      cardStyle: "!bg-amber-500/30",
      cardIcon: <School className="text-amber-800 text-4xl" />,
    },
    {
      cardHead: "Total Schools",
      cardStats: String(schools?.TotalItems ?? 0),
      cardStyle: "!bg-teal-500/30",
      cardIcon: <School className="text-teal-400 text-4xl" />,
    },
  ];

  return (
    <div className="bg-[#FBFBFB] dark:bg-[#0A0A0A]">
      <div className="px-6 flex flex-col gap-4">
        {schoolId && <SchoolInfoCard schoolId={schoolId} />}
        <StatCard cards={cards} />
        <div className="lg:w-full flex space-x-6 h-[28rem]">
          <div className="w-[70%]">
            <BarChartSection />
          </div>
          <div className="w-[30%]">
            <PieChartSection />
          </div>
        </div>
        <div className="lg:w-full flex space-x-6 h-[20rem] ">
          <div className="w-[40%] ">
            <div className="relative h-full">
              <div className="relative h-full bg-white dark:bg-[#171717] backdrop-blur-sm p-8 rounded-2xl border border-[#4e97f1]">
                <div className="flex items-center justify-start gap-3 mb-6">
                  <h3 className="text-lg font-bold text-[#227ded] tracking-wider">
                    PACKAGE TYPE
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="bg-white/10 rounded-xl p-4 border border-[#4e97f1] ">
                      <p className="text-xs  uppercase tracking-wide mb-1">
                        Premium
                      </p>
                      <p className="text-2xl font-mono font-bold text-[#4e97f1] animate-pulse">
                        5
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-[#4e97f1]  mt-2">
                      <p className="text-xs  uppercase tracking-wide mb-1">
                        Basic
                      </p>
                      <p className="text-2xl font-mono font-bold text-emerald-400">
                        10
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/10 rounded-xl p-4 border border-[#4e97f1]">
                      <p className="text-xs  uppercase tracking-wide mb-1">
                        Gold
                      </p>
                      <p className="text-2xl font-mono font-bold text-yellow-400">
                        4
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-[#4e97f1] mt-2">
                      <p className="text-xs  uppercase tracking-wide mb-1">
                        Silver
                      </p>
                      <p className="text-2xl font-mono font-bold text-red-400">
                        20
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[60%]">
            <div className="relative h-full">
              <div className="relative h-full dark:bg-[#171717] bg-white backdrop-blur-sm p-8 rounded-2xl border border-[#4e97f1]">
                <div className="flex items-center justify-start gap-3 mb-6">
                  <h3 className="text-lg font-bold text-[#4e97f1] tracking-wider">
                    RECENT ACTIVITIES
                  </h3>
                </div>
                CRM ADMIN
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
