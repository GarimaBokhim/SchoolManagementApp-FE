"use client";
import { useState } from "react";
import AllLedgerForm from "../components/AllLedger";
import AllSubLedgerForm from "../../_SubLedgerGroup/components/AllSubLedgerGroup";
import AllLedgerGroupForm from "../../_LedgerGroup/components/AllLedgerGroup";
const AllLedger = () => {
  const ledger = [
    { id: "ledger", label: "Ledger", color: "gray" },
    { id: "subLedgerGroup", label: "Sub Ledger Group", color: "gray" },
    { id: "ledgerGroup", label: "Ledger Group", color: "gray" },
  ];
  const [activeReport, setActiveReport] = useState<string>("exam");

  const renderReport = () => {
    switch (activeReport) {
      case "subLedgerGroup":
        return (
          <div className=" text-center">
            <AllSubLedgerForm />
          </div>
        );
      case "ledgerGroup":
        return (
          <div className=" text-center">
            <AllLedgerGroupForm />
          </div>
        );
      default:
        return <AllLedgerForm />;
    }
  };

  return (
    <div className="p-4 h-full ">
      <div className="bg-blue-100 rounded-t-xl px-4 pt-4 flex gap-1">
        {ledger.map((t) => {
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

export default AllLedger;
