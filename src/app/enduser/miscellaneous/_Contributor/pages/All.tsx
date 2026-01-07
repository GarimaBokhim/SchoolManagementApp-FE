"use client";
import { useState } from "react";
import AllContributorForm from "../_components/AllContributor";
import AllSchoolItemForm from "../../_SchoolItem/_components/AllSchoolItem";
import AllHistoryForm from "../../_History/_components/AllHIstory";
import AssetsReportByFiscalYear from "../../_Assetsreport/_components/Allassetsreport";
const AllContributor = () => {
  const exam = [
    { id: "contributor", label: "Contributor", color: "gray" },
    { id: "schoolItem", label: "School Item", color: "gray" },
    { id: "history", label: "History", color: "gray" },
    { id: "assetsreport", label: "Asset Report", color: "gray" },
  ];
  const [activeReport, setActiveReport] = useState<string>("contributor");

  const renderReport = () => {
    switch (activeReport) {
      case "schoolItem":
        return <div className=" text-center">{<AllSchoolItemForm />}</div>;
      case "history":
        return (
          <div className=" text-center">
            <AllHistoryForm />
          </div>
        );
        case "assetsreport":
        return <div className=" text-center">{<AssetsReportByFiscalYear  />}</div>;
      default:
        return <AllContributorForm />;
    }
  };

  return (
    <div className="p-4 h-full ">
      <div className="bg-blue-100 rounded-t-xl px-4 pt-4 flex gap-1">
        {exam.map((t) => {
          const isActive = activeReport === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setActiveReport(t.id)}
              className={
                "px-6 py-2  text-sm font-medium  " +
                (isActive
                  ? " text-blue-700 border-b-2 border-blue-700 font-semibold"
                  : "text-lue-600 hover:bg-blue-200 rounded-sm")
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg h-[90%] p-6 bg-white dark:bg-gray-800 transition-all overflow-auto">
        {renderReport()}
      </div>
    </div>
  );
};

export default AllContributor;
