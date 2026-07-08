// app/dashboard/salary-management/page.tsx
'use client';

import LayoutWrapper from "@/components/Sidebar/ClientWrapper";
import { useState } from "react";

// Static data for the salary breakup
const salaryData = {
    salaryComponents: [
        { name: "Basic", calculation: "50% OF CTC", amount: 15000, isDeduction: false },
        { name: "HRA", calculation: "50% OF HRA", amount: 7500, isDeduction: false },
        { name: "Leave travel allowance", calculation: "FIXED AMOUNT", amount: 3000, isDeduction: false },
        { name: "Special allowance", calculation: "BALANCE FIGURE", amount: 2700, isDeduction: false },
        { name: "PF employer contribution", calculation: "[GROSS-HRA] * 12 % LIMIT TO 1800", amount: 1800, isDeduction: false },
    ],
    deductions: [
        { name: "PF EMPLOYEE CONTRIBUTION", amount: 1800 },
        { name: "PF EMPLOYER CONTRIBUTION", amount: 1800 },
    ],
    grossSalary: 30000,
    totalDeductions: 3600,
    netSalary: 26400,
};

export default function SalaryManagement() {
    const [employeeName, setEmployeeName] = useState("John Doe");
    const [employeeId, setEmployeeId] = useState("EMP001");
    const [month, setMonth] = useState("June");
    const [year, setYear] = useState("2026");

    // Calculate net salary
    const netSalary = salaryData.grossSalary - salaryData.totalDeductions;

    return (
        <LayoutWrapper title="Staff Salary">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Employee Info Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Employee Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Employee Name</label>
                            <input
                                type="text"
                                value={employeeName}
                                onChange={(e) => setEmployeeName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Employee ID</label>
                            <input
                                type="text"
                                value={employeeId}
                                onChange={(e) => setEmployeeId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Month</label>
                            <select
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            >
                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Year</label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            >
                                {["2023", "2024", "2025", "2026", "2027"].map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Salary Breakup Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-xl font-semibold text-gray-800">Employee Monthly Salary Breakup Chart</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Salary Components</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Calculation</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Amount</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Deductions</th>
                                    <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {/* Map through salary components and deductions */}
                                {Array.from({ length: Math.max(salaryData.salaryComponents.length, salaryData.deductions.length) }).map((_, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-3 text-sm text-gray-700">
                                            {salaryData.salaryComponents[idx]?.name || ""}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-600">
                                            {salaryData.salaryComponents[idx]?.calculation || ""}
                                        </td>
                                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                            {salaryData.salaryComponents[idx]?.amount ? `₹${salaryData.salaryComponents[idx].amount.toLocaleString()}` : ""}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-700">
                                            {salaryData.deductions[idx]?.name || ""}
                                        </td>
                                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                                            {salaryData.deductions[idx]?.amount ? `₹${salaryData.deductions[idx].amount.toLocaleString()}` : ""}
                                        </td>
                                    </tr>
                                ))}
                                {/* Gross Salary Row */}
                                <tr className="bg-blue-50 border-t border-b border-blue-100">
                                    <td className="px-6 py-3 text-sm font-semibold text-gray-800">Gross Salary</td>
                                    <td className="px-6 py-3 text-sm text-gray-600">Basic + allowances</td>
                                    <td className="px-6 py-3 text-sm font-bold text-blue-700">₹{salaryData.grossSalary.toLocaleString()}</td>
                                    <td className="px-6 py-3 text-sm font-semibold text-gray-800">Total Deductions</td>
                                    <td className="px-6 py-3 text-sm font-bold text-red-600">₹{salaryData.totalDeductions.toLocaleString()}</td>
                                </tr>
                                {/* Net Salary Row */}
                                <tr className="bg-green-50">
                                    <td colSpan={2} className="px-6 py-4 text-sm font-semibold text-gray-800">Net Salary (Gross - Deductions)</td>
                                    <td colSpan={3} className="px-6 py-4 text-sm font-bold text-green-700">₹{netSalary.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Salary Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                        <p className="text-sm text-blue-600 font-medium">Gross Salary</p>
                        <p className="text-2xl font-bold text-blue-800">₹{salaryData.grossSalary.toLocaleString()}</p>
                        <p className="text-xs text-blue-500 mt-1">Before deductions</p>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
                        <p className="text-sm text-red-600 font-medium">Total Deductions</p>
                        <p className="text-2xl font-bold text-red-800">₹{salaryData.totalDeductions.toLocaleString()}</p>
                        <p className="text-xs text-red-500 mt-1">PF contributions</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                        <p className="text-sm text-green-600 font-medium">Net Salary</p>
                        <p className="text-2xl font-bold text-green-800">₹{netSalary.toLocaleString()}</p>
                        <p className="text-xs text-green-500 mt-1">Take home amount</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Download PDF
                    </button>
                    <button className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Salary Slip
                    </button>
                    <button className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M6 7h12M6 4h12M6 19h12M9 13h6M7 16h10" />
                        </svg>
                        Export Excel
                    </button>
                </div>
            </div>
        </LayoutWrapper>
    );
}