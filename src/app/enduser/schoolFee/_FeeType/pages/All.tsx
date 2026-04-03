"use client";
import { useState } from "react";
import AllFeeTypeForm from "../_components/AllFeeType";
import AllFeeStructureForm from "../../_FeeStructure/_components/AllFeeStructure";
import AllStudentFeeForm from "../../_StudentFee/_components/AllStudentFee";
const AllFeeType = () => {
  const exam = [
    { id: "feeType", label: "FeeType", color: "gray" },
   { id: "feeCategory", label: "Fee Category", color: "gray" },
    { id: "feeStructure", label: "Fee Structure", color: "gray" },
    { id: "studentFee", label: "Student Fee", color: "gray" },
  ];
  const [activeReport, setActiveReport] = useState<string>("feeType");

  const renderReport = () => {
    switch (activeReport) {
      case "studentFee":
        return <div className=" text-center">{<AllStudentFeeForm />}</div>;
      case "feeCategory":
        return (
          <div className=" text-center">
            { <AllFeeStructureForm /> }  
          </div>
        );
      case "feeStructure":
        return (
          <div className=" text-center">
            <AllFeeStructureForm />
          </div>
        );
      default:
        return <AllFeeTypeForm />;
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

export default AllFeeType;
