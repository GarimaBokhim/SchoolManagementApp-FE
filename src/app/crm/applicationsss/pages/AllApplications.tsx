"use client";

import { useState } from "react";
import AllApplicants from "../../(applications)/applicants/pages/All";
import AllCrmStudents from "../crm_students/pages/All";


const AllApplications = () => {
  const exam = [
    { id: "applicant", label: "Applicant" },
    { id: "student", label: "Student" },
  ];

  const [activeReport, setActiveReport] = useState<string>("lead");

  const renderReport = () => {
    switch (activeReport) {
      case "student":
        return <AllCrmStudents />;

      case "applicant":
        return <AllApplicants />;

      default:
        return <AllApplicants />;
    }
  };

  return (
    <div className="p-4 h-full">
      {/* Tabs */}
      <div className="bg-blue-100 rounded-t-xl px-4 pt-4 flex gap-1">
        {exam.map((t) => {
          const isActive = activeReport === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setActiveReport(t.id)}
              className={
                "px-6 py-2 text-sm font-medium transition-all " +
                (isActive
                  ? "text-blue-700 border-b-2 border-blue-700 font-semibold"
                  : "text-blue-600 hover:bg-blue-200 rounded-sm")
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg h-[90%] p-6 bg-white dark:bg-gray-800 transition-all overflow-auto">
        {renderReport()}
      </div>
    </div>
  );
};

export default AllApplications;
