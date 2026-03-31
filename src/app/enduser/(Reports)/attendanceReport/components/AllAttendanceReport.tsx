"use client";
import { useMemo, useState, useEffect } from "react";
import React from "react";
import { Toaster } from "react-hot-toast";
import { ChevronLeft, ChevronRight, Users, Search } from "lucide-react";
import { useGetAttendanceReport, useGetAllStudents } from "../hooks";
import { NEPALI_MONTHS, STATUS_CONFIG, IStudent } from "../types/Iattendance";

const AllAttendanceForm = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: attendanceData, isLoading: isLoadingAttendance } =
    useGetAttendanceReport(selectedMonth);
  const { data: studentData, isLoading: isLoadingStudents } =
    useGetAllStudents();

  const studentMap = useMemo(() => {
    const map: Record<string, IStudent> = {};
    studentData?.Items?.forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, [studentData]);

  const getFullName = (studentId: string) => {
    const s = studentMap[studentId];
    if (!s) return studentId;
    return [s.firstName, s.middleName, s.lastName].filter(Boolean).join(" ");
  };

  const days = useMemo(() => {
    if (!attendanceData?.Students?.length) return [];
    const keys = Object.keys(attendanceData.Students[0].Attendance);
    return keys
      .map((k) => ({ key: k, day: parseInt(k.split("-")[2], 10) }))
      .sort((a, b) => a.day - b.day);
  }, [attendanceData]);

  const getSummary = (attendance: Record<string, { Status: string }>) => {
    let present = 0, absent = 0, late = 0, noData = 0;
    Object.values(attendance).forEach(({ Status }) => {
      if (Status === "P") present++;
      else if (Status === "A") absent++;
      else if (Status === "L") late++;
      else noData++;
    });
    return { present, absent, late, noData };
  };

  const students = attendanceData?.Students ?? [];

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    return students.filter((s) =>
      getFullName(s.StudentId).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm, studentMap]);

  const overallSummary = useMemo(() => {
    let totalPresent = 0, totalAbsent = 0, totalLate = 0;
    students.forEach((s) => {
      const { present, absent, late } = getSummary(s.Attendance);
      totalPresent += present;
      totalAbsent += absent;
      totalLate += late;
    });
    return { totalPresent, totalAbsent, totalLate };
  }, [students]);

  const isLoading = isLoadingAttendance || isLoadingStudents;

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6 space-y-4">

        {/* Top bar */}
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Attendance Report
          </h1>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
            />
          </div>

          {/* Month pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedMonth((m) => Math.max(1, m - 1))}
              disabled={selectedMonth === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition"
            >
              <ChevronLeft size={15} />
            </button>
            <div className="flex gap-1 flex-wrap">
              {Object.entries(NEPALI_MONTHS).map(([num, name]) => (
                <button
                  key={num}
                  onClick={() => setSelectedMonth(Number(num))}
                  className={`px-2.5 py-1 text-xs rounded-full font-medium transition ${
                    selectedMonth === Number(num)
                      ? "bg-blue-600 text-white shadow"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#444] dark:text-gray-300"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedMonth((m) => Math.min(12, m + 1))}
              disabled={selectedMonth === 12}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-blue-50 dark:bg-[#2f3a4a] rounded-xl p-3 border border-blue-100">
            <p className="text-xs text-blue-500 font-medium uppercase tracking-wide flex items-center gap-1">
              <Users size={11} /> Students
            </p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{students.length}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-[#2f3a3a] rounded-xl p-3 border border-emerald-100">
            <p className="text-xs text-emerald-500 font-medium uppercase tracking-wide">Present</p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{overallSummary.totalPresent}</p>
          </div>
          <div className="bg-red-50 dark:bg-[#3a2f2f] rounded-xl p-3 border border-red-100">
            <p className="text-xs text-red-500 font-medium uppercase tracking-wide">Absent</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{overallSummary.totalAbsent}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-[#3a3a2f] rounded-xl p-3 border border-yellow-100">
            <p className="text-xs text-yellow-500 font-medium uppercase tracking-wide">Late</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{overallSummary.totalLate}</p>
          </div>
        </div>

        {/* Student Cards */}
        {isLoading ? (
          <div className="text-center text-gray-500 py-16">Loading attendance data...</div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center text-gray-500 italic py-16">
            No attendance data found for {NEPALI_MONTHS[selectedMonth]}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredStudents.map((student, idx) => {
              const summary = getSummary(student.Attendance);
              const fullName = getFullName(student.StudentId);
              const attendanceRate =
                days.length > 0
                  ? Math.round((summary.present / days.length) * 100)
                  : 0;

              return (
                <div
                  key={student.StudentId}
                  className="bg-white dark:bg-[#3a3a3a] border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="px-4 py-3 bg-gray-50 dark:bg-[#2f2f2f] border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                        {fullName}
                      </span>
                    </div>
                    {/* Attendance rate badge */}
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        attendanceRate >= 75
                          ? "bg-emerald-100 text-emerald-700"
                          : attendanceRate >= 50
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {attendanceRate}%
                    </span>
                  </div>

                  {/* Day Grid — wraps naturally, no scroll */}
                  <div className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {days.map(({ key, day }) => {
                        const statusVal = student.Attendance[key]?.Status ?? "-";
                        const config = STATUS_CONFIG[statusVal] ?? STATUS_CONFIG["-"];
                        return (
                          <div
                            key={key}
                            title={`Day ${day}: ${config.label}`}
                            className={`w-7 h-7 rounded text-xs font-semibold flex items-center justify-center cursor-default ${config.className}`}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary footer */}
                  <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-600 flex justify-between text-xs">
                    <span className="text-emerald-600 font-semibold">P: {summary.present}</span>
                    <span className="text-red-500 font-semibold">A: {summary.absent}</span>
                    <span className="text-yellow-500 font-semibold">L: {summary.late}</span>
                    <span className="text-gray-400">–: {summary.noData}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        {!isLoading && filteredStudents.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 text-xs pt-2">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs font-semibold ${cfg.className}`}>
                  {cfg.short}
                </span>
                <span className="text-gray-500 dark:text-gray-400">{cfg.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AllAttendanceForm;