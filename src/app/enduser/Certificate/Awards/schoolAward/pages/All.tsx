"use client";
import { useState } from "react";
import AllSchoolAwardForm from "../component/Allschoolaward";
import AllStudentAwardForm from "../../studentAward/component/Allstudentaward";
const AllAwards = () => {
  const exam = [ 
    { id: "studentAward", label: "Student Award", color: "gray" },
    { id: "schoolAward", label: "School Award", color: "gray" },
  ];
  const [activeAward, setactiveAward] = useState<string>("School Award");

  const renderAward = () => {
    switch (activeAward) {
      case "schoolAward":
        return (
          <div className=" text-center">
            <AllSchoolAwardForm />
          </div>
        );
      case "studentAward":
        return (
          <div className=" text-center">
            <AllStudentAwardForm />
          </div>
        );
      default:
        return <AllStudentAwardForm />;
    }
  };

  return (
    <div className="p-4 h-full ">
      <div className="bg-blue-100 rounded-t-xl px-4 pt-4 flex gap-1">
        {exam.map((t) => {
          const isActive = activeAward === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setactiveAward(t.id)}
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
        {renderAward()}
      </div>
    </div>
  );
};

export default AllAwards;
