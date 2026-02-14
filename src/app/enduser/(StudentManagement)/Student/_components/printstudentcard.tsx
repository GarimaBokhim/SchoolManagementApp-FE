"use client";
import React, { forwardRef, useEffect, useState } from "react";
import { useGetStudentById } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { IStudent } from "@/app/enduser/(StudentManagement)/Student/types/IStudents";
import { useGetAllClass } from "@/app/enduser/(Academics)/Class/hooks";

type Props = {
  StudentId: string | number;
};

const StudentIDCard = forwardRef<HTMLDivElement, Props>(
  ({ StudentId }, ref) => {
    const { data } = useGetStudentById(StudentId as string);
    const [student, setStudent] = useState<IStudent | null>(null);
    const {data:allClass} = useGetAllClass();
    

    useEffect(() => {
      if (data) setStudent(data);
    }, [data]);

    if (!student) return null;

    return (
      <div
        ref={ref}
        className="w-[520px] h-[300px] rounded-2xl overflow-hidden shadow-2xl border bg-white font-sans print:shadow-none"
      >
        <div className="h-[60px] bg-gradient-to-r from-indigo-800 via-blue-700 to-cyan-600 text-white flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-bold tracking-wide">
              Saraswati Higher Secondary School
            </h1>
            <p className="text-xs opacity-90">Birtamode-4, Jhapa</p>
          </div>
          <div className="text-xs font-semibold bg-white text-indigo-800 px-3 py-1 rounded-full">
            STUDENT ID
          </div>
        </div>

        <div className="flex h-[200px] px-6 py-4">
          <div className="w-[160px] flex flex-col items-center justify-center border-r pr-4">
            <div className="w-[110px] h-[110px] rounded-full border-4 border-indigo-600 overflow-hidden shadow-md">
              <img 
              src={student.studentImg}
              alt="Student Photo"
              className="object-cover w-full h-full"
              />

            </div>

            <p className="mt-3 text-xs font-semibold text-gray-500">
              Reg No: {student.registrationNumber}
            </p>
          </div>

          {/* Right Section - Details */}
          <div className="flex-1 pl-6 text-sm space-y-3">
            <div>
              <p className="text-gray-500 text-xs">Full Name</p>
              <p className="font-semibold text-base text-gray-800">
                {student.firstName} {student.lastName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs">Class</p>
                <p className="font-medium">{allClass?.Items.find((c) => c.id === student.classId)?.name}</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs">Section</p>
                <p className="font-medium">{student.classSectionId}</p>
              </div>
            </div>

            <div className="pt-6">
              <div className="border-t border-gray-400 w-[140px]"></div>
              <p className="text-xs text-gray-600 mt-1">
                Principal Signature
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="h-[40px] bg-indigo-800 text-white flex items-center justify-between px-6 text-xs">
          <span>www.saraswati.edu.np</span>
          <span>Valid Academic Year 2082</span>
        </div>
      </div>
    );
  }
);

StudentIDCard.displayName = "StudentIDCard";
export default StudentIDCard;
