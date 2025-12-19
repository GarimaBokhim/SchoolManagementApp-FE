"use client";
import { BriefcaseBusiness, Bus, DollarSign, School, User } from "lucide-react";
import StatCard from "./StatCard";
import BarChartSection from "./BarChart";
import PieChartSection from "./PieChart";
import SchoolInfoCard from "./SchoolCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAllNotices } from "../../notice/hooks";

const Dashboard: React.FC = () => {
  const [schoolId, setSchoolId] = useState("");
  const navigate = useRouter();
  const { data: allNotice } = useGetAllNotices();
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

  return (
    <div className=" bg-[#FBFBFB] dark:bg-[#0A0A0A] ">
      <div className="p-6 flex flex-col gap-4">
        <div>
          <SchoolInfoCard schoolId={schoolId} />
        </div>
        <div className="lg:w-full flex-none">
          <StatCard
            cards={[
              {
                cardHead: "Total Students",
                cardStats: "1200",
                cardIcon: <User className="text-green-400 text-4xl" />,
              },
              {
                cardHead: "Total Staffs",
                cardStats: "40",
                cardStyle: "!bg-orange-500/30",
                cardIcon: (
                  <BriefcaseBusiness className="text-orange-400 text-4xl" />
                ),
              },
              {
                cardHead: "Total Vehicle",
                cardStats: "5",
                cardStyle: "!bg-blue-500/30",
                cardIcon: <Bus className="text-blue-400 text-4xl" />,
              },
              {
                cardHead: "Total Revenue",
                cardStats: "500k",
                cardStyle: "!bg-red-500/30",
                cardIcon: <DollarSign className="text-red-400 text-4xl" />,
              },
              {
                cardHead: "Total ",
                cardStats: "5",
                cardStyle: "!bg-amber-500/30",
                cardIcon: <School className="text-amber-800 text-4xl" />,
              },
            ]}
          />
        </div>
        <div className="lg:w-full  flex space-x-6 h-[28rem]">
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
          <div className="lg:w-full flex space-x-6 h-[20rem]">
            <div className="w-[50%]">
              <div className="relative h-full">
                <div className="h-full bg-white dark:bg-[#171717] p-6 rounded-2xl border border-[#4e97f1]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#4e97f1] tracking-wider">
                      LATEST NOTICES
                    </h3>
                  </div>

                  <div className="space-y-3 overflow-y-auto max-h-[13rem] pr-2">
                    {allNotice?.map((n, index) => (
                      <div
                        key={index}
                        className="group p-4 rounded-xl border border-gray-200 dark:border-gray-600 
                         hover:shadow-md transition-all bg-gray-50 dark:bg-[#2a2a2a]"
                      >
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-1">
                          {n.title}
                        </h4>

                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                          {n.shortDescription}
                        </p>

                        <div className="text-[10px] text-gray-400 mt-2">
                          {n.createdAt}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[50%]">
              <div className="relative h-full">
                <div className="relative h-full dark:bg-[#171717] bg-white p-6 rounded-2xl border border-[#4e97f1]">
                  <h3 className="text-lg font-bold text-[#4e97f1] tracking-wider mb-4">
                    RECENT ACTIVITIES
                  </h3>

                  <div className="space-y-3 overflow-y-auto max-h-[13rem] pr-2">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#2a2a2a]">
                      <p className="text-sm text-gray-700 dark:text-white">
                        Purchased New Feature by Reliance School
                      </p>
                      <span className="text-xs text-gray-400">
                        Oct 10, 2025
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#2a2a2a]">
                      <p className="text-sm text-gray-700 dark:text-white">
                        Subscription about to expire of Mother School
                      </p>
                      <span className="text-xs text-gray-400">
                        Oct 11, 2025
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
