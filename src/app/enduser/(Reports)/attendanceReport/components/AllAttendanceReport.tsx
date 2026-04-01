"use client";
import { useMemo, useState } from "react";
import React from "react";
import { Toaster } from "react-hot-toast";
import { ChevronLeft, ChevronRight, Search, Download } from "lucide-react";
import { useGetAttendanceReport, useGetAllStudents } from "../hooks";
import { NEPALI_MONTHS, STATUS_CONFIG, IStudent } from "../types/Iattendance";
import { AppCombobox } from "@/components/Input/ComboBox";
import { useForm } from "react-hook-form";
import { useGetAllClasses } from "@/app/enduser/(StudentManagement)/_Activities/hooks";
import { Toast } from "@/components/Toast/toast";

const AllAttendanceForm = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [monthStartIndex, setMonthStartIndex] = useState<number>(0);

  const form = useForm({ defaultValues: { classId: "" } });

  const { data: attendanceData, isLoading: isLoadingAttendance } =
    useGetAttendanceReport(selectedMonth);
  const { data: studentData, isLoading: isLoadingStudents } =
    useGetAllStudents();
  const { data: allClasses } = useGetAllClasses();

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

  const isLoading = isLoadingAttendance || isLoadingStudents;

  const selectedClass = allClasses?.find((c) => c.id === selectedClassId) ?? allClasses?.[0] ?? null;

  // Get visible months (6 at a time)
  const visibleMonths = useMemo(() => {
    const monthsArray = Object.entries(NEPALI_MONTHS);
    return monthsArray.slice(monthStartIndex, monthStartIndex + 6);
  }, [monthStartIndex]);

  const canGoPrev = monthStartIndex > 0;
  const canGoNext = monthStartIndex + 6 < Object.keys(NEPALI_MONTHS).length;

  const handlePrevMonths = () => {
    setMonthStartIndex((prev) => Math.max(0, prev - 6));
  };

  const handleNextMonths = () => {
    setMonthStartIndex((prev) => 
      Math.min(Object.keys(NEPALI_MONTHS).length - 6, prev + 6)
    );
  };

  // Export to CSV functionality
  const handleExport = () => {
    if (filteredStudents.length === 0) {
      Toast.error("No data to export");
      return;
    }

    const csvData = filteredStudents.map((student, index) => {
      const fullName = getFullName(student.StudentId);
      const summary = getSummary(student.Attendance);
      const attendanceRate = days.length > 0
        ? Math.round((summary.present / days.length) * 100)
        : 0;

      // Create a row with day-wise attendance
      const dayAttendance: Record<string, string> = {};
      days.forEach(({ key, day }) => {
        const statusVal = student.Attendance[key]?.Status ?? "-";
        const config = STATUS_CONFIG[statusVal] ?? STATUS_CONFIG["-"];
        dayAttendance[`Day ${day}`] = config.label;
      });

      return {
        "S.N.": index + 1,
        "Student Name": fullName,
        "Present": summary.present,
        "Absent": summary.absent,
        "Late": summary.late,
        "No Data": summary.noData,
        "Attendance Rate (%)": attendanceRate,
        ...dayAttendance,
      };
    });

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) =>
        headers.map((h) => {
          const value = row[h as keyof typeof row];
          // Handle values that might contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report_${NEPALI_MONTHS[selectedMonth]}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    Toast.success("Report exported successfully");
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6 space-y-4">

        {/* Top bar with controls */}
        <div className="bg-white dark:bg-[#353535] border border-gray-200 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left side: Class and Search */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Class Combobox */}
              <div className="w-48">
                <AppCombobox
                  value={selectedClassId || (allClasses?.[0]?.id ?? "")}
                  dropDownWidth="w-full"
                  dropdownPositionClass="absolute z-50"
                  label="Class"
                  name="classId"
                  form={form}
                  options={allClasses ?? []}
                  selected={selectedClass}
                  onSelect={(cls) => {
                    if (cls) {
                      setSelectedClassId(cls.id);
                      form.setValue("classId", cls.id);
                    }
                  }}
                  getLabel={(c) => c?.name ?? ""}
                  getValue={(c) => c?.id ?? ""}
                />
              </div>

              {/* Search field */}
              <div className="relative w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search student..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
            </div>

            {/* Right side: Export button and Month navigation */}
            <div className="flex items-center gap-3">
              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={filteredStudents.length === 0}
                className="flex items-center gap-2 px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={15} />
                <span className="text-sm">Export</span>
              </button>

              {/* Month navigation with 6 visible months */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonths}
                  disabled={!canGoPrev}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition"
                >
                  <ChevronLeft size={15} />
                </button>
                
                <div className="flex gap-1">
                  {visibleMonths.map(([num, name]) => (
                    <button
                      key={num}
                      onClick={() => setSelectedMonth(Number(num))}
                      className={`px-2.5 py-1 text-xs rounded-full font-medium transition whitespace-nowrap ${
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
                  onClick={handleNextMonths}
                  disabled={!canGoNext}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 transition"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
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

                  {/* Day Grid */}
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