"use client";
import React, { forwardRef, useEffect, useState } from "react";
import { useGetStudentById } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { IStudent } from "@/app/enduser/(StudentManagement)/Student/types/IStudents";

type StudentIDCardProps = {
  StudentId: string | number;
  visible: boolean;
  onClose: () => void;
};

const StudentIDCard = forwardRef<HTMLDivElement, StudentIDCardProps>(
  ({ StudentId }, ref) => {
    const { data: studentData } = useGetStudentById(StudentId as string);
    const [student, setStudent] = useState<IStudent | null>(null);

    useEffect(() => {
      if (studentData) setStudent(studentData);
    }, [studentData]);

    if (!student) return null;

    return (
      <div
        ref={ref}
        className="w-[400px] h-[200px] bg-white border border-gray-400 shadow-md rounded-md font-sans"
      >
        {/* HEADER */}
        <div className="relative h-[50px] bg-green-700 text-white rounded-t-md">
          <div className="text-center pt-2">
            <h1 className="text-lg font-bold text-yellow-300">
              Saraswati Higher Secondary School
            </h1>
            <p className="text-xs">Birtamode-4, Jhapa</p>
          </div>
        </div>

        {/* BODY */}
        <div className="flex h-[120px]">
          {/* Vertical stripe */}
          <div className="w-8 bg-green-700 text-yellow-300 flex items-center justify-center">
            <span className="rotate-[-90deg] text-xs font-bold">STUDENT ID</span>
          </div>

          {/* Student info */}
          <div className="flex-1 p-4 text-sm space-y-2 relative">
            <div>
              <b>Name:</b> {student.firstName} {student.lastName}
            </div>
            <div><b>Class:</b> {student.classId}</div>
            <div><b>Sec:</b> {student.classSectionId}</div>
            <div><b>Reg No:</b> {student.registrationNumber}</div>

            <div className="absolute right-4 bottom-2 text-xs font-semibold">
              Principal Signature
            </div>
          </div>

          {/* Photo */}
          <div className="w-[100px] p-2 flex items-center justify-center">
            <img
              src={student.studentImg || "/default.png"}
              className="w-[80px] h-[100px] border object-cover"
              alt="Student"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="h-[30px] bg-green-700 text-yellow-300 text-center text-xs flex items-center justify-center rounded-b-md">
          www.saraswati.edu.np
        </div>
      </div>
    );
  }
);

StudentIDCard.displayName = "StudentIDCard";
export default StudentIDCard;
