"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Printer } from "lucide-react";
import AdmitCard from "./Admitcard";
import { IExam } from "../types/IExams";
import { useGetStudentByClass } from "@/app/enduser/(StudentManagement)/Student/hooks";

type PrintAdmitCardProps = {
  exam: IExam;
};

const PrintAdmitCard = ({ exam }: PrintAdmitCardProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const { data: students } = useGetStudentByClass(exam.classId);

 const handlePrint = useReactToPrint({
    contentRef: printRef, 
    documentTitle: `${exam.name}-Admit-Cards`,
  });

  if (!students?.Items?.length) return null;

  return (
    <>
      <ButtonElement
        type="button"
        text=""
        icon={<Printer size={14} />}
        onClick={handlePrint}
      />

      <div className="hidden">
        <div ref={printRef}>
          {students.Items.map((student) => (
            <div key={student.id} className="m-4 page-break">
              <AdmitCard student={student} exam={exam} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PrintAdmitCard;
