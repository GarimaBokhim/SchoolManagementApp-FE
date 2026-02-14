"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { PrinterIcon } from "lucide-react";
import { ButtonElement } from "@/components/Buttons/ButtonElement";
import StudentIDCard from "./printstudentcard";

interface Props {
  StudentId: string | number;
}

export const PrintIDCardButton = ({ StudentId }: Props) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef, 
    documentTitle: "Student ID Card",
    pageStyle: `
      @page {
        size: A4 landscape;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
  });

  return (
    <div>
      <div className="fixed left-0 top-0 -z-10 opacity-0">
        <div ref={printRef}>
          <StudentIDCard StudentId={StudentId} />
        </div>
      </div>

      <ButtonElement
        type="button"
        text=""
        icon={<PrinterIcon size={22} />}
        onClick={() => handlePrint()}
        className="!bg-teal-500 !text-xs !p-[0.4rem]"
      />
    </div>
  );
};
