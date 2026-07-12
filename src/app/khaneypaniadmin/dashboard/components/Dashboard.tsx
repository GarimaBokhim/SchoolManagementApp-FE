/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Droplets, Wallet, AlertCircle, ReceiptText, ScanLine, UserPlus, Home, TrendingUp, TrendingDown } from "lucide-react";
import StatCard from "./StatCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDashboardSummary, getReadings, getHouseById } from "../lib/khaneypaniStore";
import { MeterReading } from "../types/khaneypani";

import { useGetAllSchool } from "../../Setup/School/hooks";
import { useGetAllRoles } from "@/app/SuperAdmin/accessControl/roles/hooks";
import { useGetAllUsers } from "@/app/SuperAdmin/accessControl/user/hooks";
import { useGetAllInstitution } from "@/app/SuperAdmin/institutionSetup/Institution/hooks";
import SchoolInfoCard from "./SchoolCard";
import BarChartSection from "./BarChart";
import PieChartSection from "./PieChart";

// NOTE ON DATA SOURCE:
// Your other dashboards (Schools, Roles, Users, Institutions) pull live
// counts through hooks like useGetAllSchool(). This page follows the exact
// same shape, but reads from lib/khaneypaniStore.ts for now so the whole
// flow works end-to-end without a backend yet.
//
// When your API is ready, swap this block for real hooks, e.g.:
//   const { data: houses } = useGetAllHouses();
//   const { data: readings } = useGetAllReadings();
// and build `summary` / `recent` from their responses instead. Nothing
// else in this file needs to change.

function nf(n: number) {
    return new Intl.NumberFormat("en-IN").format(Math.round(n));
}

const Dashboard: React.FC = () => {

    const navigate = useRouter();
    const [summary, setSummary] = useState(getDashboardSummary());
    const [recent, setRecent] = useState<MeterReading[]>([]);

    const [schoolId, setSchoolId] = useState("");

    useEffect(() => {
        const userDetailsString = localStorage.getItem("userDetails");

        if (userDetailsString) {
            try {
                const parsed = JSON.parse(userDetailsString);
                setSchoolId(parsed.schoolId || "");
                setSummary(getDashboardSummary());
                setRecent(getReadings().slice(0, 6));
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



    // Build cards dynamically — same StatCard component your other
    // dashboards use, just fed with water-project numbers.
    const cards = [
        {
            cardHead: "Total Houses",
            cardStats: nf(summary.totalHouses),
            cardStyle: "!bg-cyan-500/30",
            cardIcon: <Home className="text-cyan-400 text-4xl" />,
        },
        {
            cardHead: "Collected This Month",
            cardStats: `Rs. ${nf(summary.thisMonthCollection)}`,
            cardStyle: "!bg-emerald-500/30",
            cardIcon: <Wallet className="text-emerald-400 text-4xl" />,
        },
        {
            cardHead: "Pending Dues",
            cardStats: `Rs. ${nf(summary.totalPending)}`,
            cardStyle: "!bg-amber-500/30",
            cardIcon: <AlertCircle className="text-amber-500 text-4xl" />,
        },
        {
            cardHead: "Net Balance",
            cardStats: `Rs. ${nf(summary.netBalance)}`,
            cardStyle: summary.netBalance >= 0 ? "!bg-emerald-500/30" : "!bg-red-500/30",
            cardIcon: <ReceiptText className={`text-4xl ${summary.netBalance >= 0 ? "text-emerald-400" : "text-red-400"}`} />,
        },
    ];

    return (
        <div className="bg-[#FBFBFB] dark:bg-[#0A0A0A]">
            <div className="px-6 flex flex-col gap-4">

                {/* Header */}
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

                <div className="lg:w-full flex space-x-6">
                    {/* Quick actions */}
                    <div className="w-full lg:w-[34%] flex flex-col gap-3">
                        <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-500 px-1">Quick Actions</h3>
                        <QuickAction icon={<ScanLine size={20} />} label="Scan QR & Enter Reading" onClick={() => navigate.push("/khaneypani/scan")} />
                        <QuickAction icon={<UserPlus size={20} />} label="Register New House" onClick={() => navigate.push("/khaneypani/register")} />
                        <QuickAction icon={<ReceiptText size={20} />} label="Payment History Report" onClick={() => navigate.push("/khaneypani/history")} />
                        <QuickAction icon={<Wallet size={20} />} label="Income & Expense" onClick={() => navigate.push("/khaneypani/income-expense")} />
                    </div>

                    {/* Recent readings */}
                    <div className="w-full lg:w-[66%]">
                        <div className="relative h-full">
                            <div className="relative h-full bg-white dark:bg-[#171717] backdrop-blur-sm p-8 rounded-2xl border border-[#4e97f1]">
                                <div className="flex items-center justify-start gap-3 mb-6">
                                    <h3 className="text-lg font-bold text-[#227ded] tracking-wider">
                                        RECENT METER READINGS
                                    </h3>
                                </div>

                                {recent.length === 0 ? (
                                    <p className="text-sm text-neutral-400 py-8 text-center">
                                        No readings yet. Scan a house QR to record the first one.
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left text-neutral-400 uppercase text-xs">
                                                    <th className="pb-2 pr-4">House</th>
                                                    <th className="pb-2 pr-4">Previous</th>
                                                    <th className="pb-2 pr-4">Current</th>
                                                    <th className="pb-2 pr-4">Units</th>
                                                    <th className="pb-2 pr-4">Amount</th>
                                                    <th className="pb-2">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recent.map((r) => {
                                                    const house = getHouseById(r.houseId);
                                                    return (
                                                        <tr key={r.id} className="border-t border-neutral-100 dark:border-neutral-800">
                                                            <td className="py-2 pr-4 font-medium text-neutral-800 dark:text-neutral-100">
                                                                {house?.houseNo ?? "—"}
                                                            </td>
                                                            <td className="py-2 pr-4 text-neutral-500">{r.previousUnit}</td>
                                                            <td className="py-2 pr-4 text-neutral-500">{r.currentUnit}</td>
                                                            <td className="py-2 pr-4 text-neutral-500">{r.unitsUsed}</td>
                                                            <td className="py-2 pr-4 font-semibold text-neutral-800 dark:text-neutral-100">
                                                                Rs. {nf(r.amount)}
                                                            </td>
                                                            <td className="py-2">
                                                                <span
                                                                    className={`text-xs px-2 py-1 rounded-full font-medium ${r.paymentStatus === "paid"
                                                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                                        }`}
                                                                >
                                                                    {r.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Income vs expense strip */}
                <div className="lg:w-full flex space-x-6 pb-6">
                    <div className="w-1/2">
                        <div className="relative h-full bg-white dark:bg-[#171717] backdrop-blur-sm p-6 rounded-2xl border border-[#4e97f1] flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                <TrendingUp size={22} />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-neutral-500">Total Income (incl. collections)</p>
                                <p className="text-2xl font-bold text-emerald-500">Rs. {nf(summary.totalIncome)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <div className="relative h-full bg-white dark:bg-[#171717] backdrop-blur-sm p-6 rounded-2xl border border-[#4e97f1] flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                                <TrendingDown size={22} />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-neutral-500">Total Expense</p>
                                <p className="text-2xl font-bold text-rose-500">Rs. {nf(summary.totalExpense)}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 bg-white dark:bg-[#171717] rounded-2xl p-4 border border-[#4e97f1] hover:ring-2 hover:ring-cyan-500/40 transition-all text-left w-full"
        >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <span className="font-medium text-neutral-800 dark:text-neutral-100">{label}</span>
        </button>
    );
}

export default Dashboard;