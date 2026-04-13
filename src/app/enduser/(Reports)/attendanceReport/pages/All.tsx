"use client";

import AllAttendanceForm from "../components/AllAttendanceReport";

const AllAttendance = () => {
  return (
    <div className="p-4 h-full">
      <div className="bg-blue-100 rounded-t-xl px-4 pt-4 flex gap-1">
        <button className="px-6 py-2 text-sm font-medium text-blue-700 border-b-2 border-blue-700 font-semibold">
          Attendance
        </button>
      </div>
      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg h-[90%] p-6 bg-white dark:bg-gray-800 transition-all overflow-auto">
        <AllAttendanceForm />
      </div>
    </div>
  );
};

export default AllAttendance;