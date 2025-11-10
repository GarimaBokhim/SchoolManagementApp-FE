"use client";
import { ButtonElement } from "./ButtonElement";
import { ReactNode, useRef, useState } from "react";
import { Printer } from "lucide-react";

interface Props {
  children?: ReactNode;
}

export const PrintButton = ({ children }: Props) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);

  const handlePrint = () => {
    setShowContent(true);

    setTimeout(() => {
      if (!printRef.current) return;

      const printWindow = window.open("", "_blank", "width=900,height=700");
      if (!printWindow) return;

      const html = printRef.current.innerHTML;

      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <style>
              body {
                font-family: 'Times New Roman', serif;
                padding: 40px;
                color: #000;
                font-size: 14px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #ccc;
                padding: 12px;
                text-align: left;
              }
              th {
                background-color: #f0f0f0;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                table, tr, td, th {
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            ${html}
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();

      // unmount after printing
      setTimeout(() => setShowContent(false), 1000);
    }, 100); // small delay so children can render
  };

  return (
    <div className="mx">
      {/* only mount children when printing */}
      {showContent && (
        <div style={{ display: "none" }}>
          <div ref={printRef}>{children}</div>
        </div>
      )}

      <div className="tooltip">
        <ButtonElement
          type="button"
          text=""
          icon={<Printer size={20} />}
          onClick={handlePrint}
          className="!text-xs font-bold !bg-teal-500 !p-[0.4rem] mx-2"
        />
      </div>
    </div>
  );
};
