"use client";

import { useState } from "react";
import AllContributorForm from "../_components/AllContributor"; // Student Awards
import AllSchoolItemForm from "../../_SchoolItem/_components/AllSchoolItem"; // School Awards

const AllContributor = () => {
  const tabs = [
    { id: "studentAwards", label: "Student Awards" },
    { id: "schoolAwards", label: "School Awards" },
  ];

  const [activeTab, setActiveTab] = useState<string>("studentAwards");

  const renderContent = () => {
    switch (activeTab) {
      case "schoolAwards":
        return <AllSchoolItemForm />;
      case "studentAwards":
      default:
        return <AllContributorForm />;
    }
  };

  return (
    <div className="p-4 h-full">
      {/* Tabs */}
      <div className="bg-blue-100 rounded-t-xl px-4 pt-4 flex gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                "px-6 py-2 text-sm font-medium transition-all " +
                (isActive
                  ? "text-blue-700 border-b-2 border-blue-700 font-semibold"
                  : "text-blue-600 hover:bg-blue-200 rounded-sm")
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg h-[90%] p-6 bg-white dark:bg-gray-800 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default AllContributor;
