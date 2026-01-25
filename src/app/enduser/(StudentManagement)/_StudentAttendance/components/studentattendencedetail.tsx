"use client";
import React from "react";
import { IAllAttendance } from "../types/IStudentAttendance";
import { X } from "lucide-react";

interface Props {
  visible: boolean;
  onClose: () => void;
  studentAttendance: IAllAttendance | null;
}

const MonthlyAttendanceSheet = ({
  visible,
  onClose,
  studentAttendance,
}: Props) => {
  if (!visible) return null;

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const rows = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="fixed ml-12 md:ml-64 sm:ml-16 xs:ml-0  inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-[#2f2f2f] w-[96%] max-w-7xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden">

        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-600">
          <h2 className="text-lg font-semibold">
            Monthly Attendance Sheet
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            <X size={22} />
          </button>
        </div>

        {studentAttendance && (
          <div className="px-6 py-2 text-sm text-gray-600 dark:text-gray-300">
            Attendance Date:{" "}
            <span className="font-medium">
              {new Date(studentAttendance.attendanceDate)
                .toISOString()
                .split("T")[0]}
            </span>
          </div>
        )}

        <div className="overflow-auto px-4 pb-4">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-[#80878c]">
              <tr>
                <th className="border px-2 py-2 text-center">S.N</th>
                <th className="border px-2 py-2 min-w-[180px] text-left">
                  Student Name
                </th>
                {days.map((d) => (
                  <th
                    key={d}
                    className="border px-2 py-2 text-center"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr
                  key={r}
                  className="odd:bg-gray-50 dark:odd:bg-[#3a3a3a]"
                >
                  <td className="border px-2 py-2 text-center font-medium">
                    {r}
                  </td>
                  <td className="border px-2 py-2"></td>
                  {days.map((d) => (
                    <td
                      key={d}
                      className="border px-2 py-2 hover:bg-emerald-100 dark:hover:bg-emerald-800 transition"
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t dark:border-gray-600 flex flex-wrap gap-3 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
            P = Present
          </span>
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700">
            A = Absent
          </span>
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
            T = Tardy
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700">
            U = Unexcused
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">
            E = Excused
          </span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyAttendanceSheet;
