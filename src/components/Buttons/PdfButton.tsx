
import { ReactNode, useRef } from "react";
import pdfIcon from "../../../public/assets/pdf.png";
import { ButtonElement } from "./ButtonElement";
interface Props {
  children: ReactNode;
}

export const PdfButton = ({ children }: Props) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = () => {
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
  };
  return (
    <div className="mx">
      <div style={{ display: "none" }}>
        <div ref={printRef}>{children}</div>
      </div>
      <div className="tooltip">
        <ButtonElement
          type="button"
          text=""
          icon={
            <img
              src={pdfIcon.src}
              alt="Export as PDF"
              className="w-20 h-20 mx-auto"
            />
          }
          onClick={handlePrint}
          className="!text-xs font-bold !bg-white !p-[0.4rem]"
        />
      </div>
    </div>
  );
};