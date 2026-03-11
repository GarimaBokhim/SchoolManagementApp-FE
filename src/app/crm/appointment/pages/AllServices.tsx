"use client";

import { useState } from "react";
import AllCounselors from "../counselor/pages/All";

const AllServices = () => {
  const servicesTabs = [
    { id: "counselor", label: "Counselor" },
    { id: "appointment", label: "Appointments" },
  ];

  const [activeTab, setActiveTab] = useState<string>("counselor");

  const renderContent = () => {
    switch (activeTab) {
      case "appointment":
        return <AllAppointments />;
      case "counselor":
        return <AllCounselors />;
      default:
        return <AllCounselors />;
    }
  };

  return (
    <div className="p-4 h-full">
      {/* Tabs */}
      <div className="bg-blue-100 rounded-t-xl px-4 pt-4 flex gap-1">
        {servicesTabs.map((tab) => {
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

      {/* Content */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg h-[90%] p-6 bg-white dark:bg-gray-800 transition-all overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default AllServices;