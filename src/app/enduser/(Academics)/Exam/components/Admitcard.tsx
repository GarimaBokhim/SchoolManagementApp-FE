"use client";
import React, { forwardRef } from "react";
import { IStudent } from "@/app/enduser/(StudentManagement)/Student/types/IStudents";
import { IExam } from "../types/IExams";

type AdmitCardProps = {
  student: IStudent;
  exam: IExam;
};

const AdmitCard = forwardRef<HTMLDivElement, AdmitCardProps>(
  ({ student, exam }, ref) => {
    return (
      <div
        ref={ref}
        className="w-[780px] h-[280px] bg-white border border-gray-400  shadow-md rounded-md font-sans"
      >
        {/* HEADER */}
        <div className="relative h-[80px] bg-blue-900 text-white rounded-t-md">
          <div className="text-center pt-4">
            <h1 className="text-xl font-extrabold text-yellow-400">
              Saraswati Higher Secondary School
            </h1>
            <p className="text-xs">Birtamode-4, Jhapa</p>
            <p className="text-xs">Phone No. 023-544722</p>
          </div>
        </div>

        {/* BODY */}
        <div className="flex h-[170px]">
          <div className="w-10 bg-blue-900 text-yellow-400 flex items-center justify-center">
          <span className="[writing-mode:vertical-lr] [text-orientation:mixed] text-xs font-bold tracking-wider">
            EXAM ADMIT CARD
          </span>
        </div>
          <div className="flex-1 p-6 text-sm space-y-3 relative">
            <div>
              <b>Student Name:</b> {student.firstName} {student.lastName}
            </div>

            <div className="flex gap-10">
              <div><b>Class:</b> {student.classId}</div>
              <div><b>Roll No:</b>-
               {/* {student.rollno} */}
               </div>
            </div>

            <div className="flex gap-10">
              <div><b>Sec:</b> {student.classSectionId}</div>
              <div><b>Symbol No:</b> {student.registrationNumber}</div>
            </div>

            <div>
              <b>Exam Date:</b> {new Date(exam.examDate).toDateString()}
            </div>

            <div className="absolute right-6 bottom-6 text-xs font-semibold">
              Principal Signature
            </div>
          </div>

          <div className="w-[160px] p-5 flex items-center justify-center">
            <img
              src={student.studentImg || "/default.png"}
              className="w-[90px] h-[110px] border object-cover"
              alt="Student"
            />
          </div>
        </div>

        <div className="h-[30px] bg-blue-900 text-yellow-400 text-center text-xs flex items-center justify-center">
          www.saraswati.edu.np
        </div>
      </div>
    );
  }
);

AdmitCard.displayName = "AdmitCard";
export default AdmitCard;
