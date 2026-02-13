"use client";
import React, { useRef, useState, useEffect } from "react";
import { useGetStudentById } from "@/app/enduser/(StudentManagement)/Student/hooks";

import { PrinterIcon } from "lucide-react";
import StudentIDCard from "./printstudentcard";
import { ButtonElement } from "@/components/Buttons/ButtonElement";

interface Props {
  StudentId: string | number;
}

export const PrintIDCardButton = ({ StudentId }: Props) => {
  const { data: student } = useGetStudentById(StudentId as string);
  const printRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);

  const handlePrint = () => {
    if (!student) return;

    setShowContent(true);

    setTimeout(() => {
      if (!printRef.current) return;

      const printWindow = window.open("", "_blank", "width=900,height=700");
      if (!printWindow) return;

      const html = printRef.current.innerHTML;

      printWindow.document.write(`
        <html>
          <head>
            <title>Print Student ID Card</title>
            <style>
              body { font-family: 'Times New Roman', serif; padding: 20px; }
              @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                * { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>${html}
            <script>
              setTimeout(() => { window.print(); window.close(); }, 300);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();

      // Hide content after printing
      setTimeout(() => setShowContent(false), 1000);
    }, 100);
  };

  if (!student) return null;

  return (
    <div>
      {/* Hidden Student ID Card for printing */}
      {showContent && (
        <div style={{ display: "none" }}>
          <div ref={printRef}>
            <StudentIDCard
              StudentId={StudentId}
              visible={true}
              onClose={() => {}}
            />
          </div>
        </div>
      )}

      {/* Print Button */}
      <ButtonElement
        type="button"
        text=""
        icon={<PrinterIcon size={16} />}
        onClick={handlePrint}
        className="!bg-teal-500 !text-xs !p-[0.4rem]"
      />
    </div>
  );
};
