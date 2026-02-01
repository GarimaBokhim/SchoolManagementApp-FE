"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import { Printer } from "lucide-react";
import AdmitCard from "./Admitcard";
import { IStudent } from "@/app/enduser/(StudentManagement)/Student/types/IStudents";
const PrintAdmitCard = ({ student }: { student: IStudent }) => {
  const admitCardRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: admitCardRef,
    documentTitle: "Exam-Admit-Card",
  });

  return (
    <>
      <ButtonElement
        type="button"
        icon={<Printer size={14} />}
        onClick={handlePrint}
      />

      <div style={{ display: "none" }}>
        <AdmitCard ref={admitCardRef} />
      </div>
    </>
  );
};

export default PrintAdmitCard;
