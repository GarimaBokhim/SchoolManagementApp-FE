"use client";
import React from "react";
import { X } from "lucide-react";

interface Props {
  studentId: string;
  onClose: () => void;
  examId: string;
}

const BlankCertificateForm: React.FC<Props> = ({ onClose }) => {
  const handlePrint = () => {
    const content = document.getElementById("certificate")?.outerHTML;
    if (!content) return;

    const printWindow = window.open("", "", "width=1000,height=900");
    printWindow?.document.write(`
      <html>
        <head>
          <title>Certificate</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { size: A4 landscape; margin: 0 }
            body { margin:0 }

            body * { visibility:hidden }
            #certificate, #certificate * { visibility:visible }

            #certificate {
              position:absolute;
              top:0;
              left:0;
              width:297mm;
              height:210mm;
            }

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);

    printWindow?.document.close();
    printWindow?.focus();
    printWindow?.print();
  };

  return (
    <div className="fixed inset-0 z-50 ml-12 md:ml-64 sm:ml-16 xs:ml-0 flex justify-center items-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 w-[90vw] h-[95vh] rounded-xl shadow-xl p-6 overflow-auto">

        {/* Top Bar */}
        <div className="flex justify-between mb-4">
          <h1 className="text-lg font-semibold">Blank Certificate Preview</h1>
          <button onClick={onClose} className="text-red-500">
            <X />
          </button>
        </div>

        {/* Certificate */}
        <div
          id="certificate"
          className="mx-auto bg-white shadow-2xl relative"
          style={{
            width: "1123px",
            height: "794px",
            backgroundImage: "url('/assets/border.png')",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            fontFamily: "Times New Roman",
          }}
        >
          <div className="px-20 py-16 h-full flex flex-col justify-between">

            <div>
              <div className="flex items-start justify-between">
                <img src="/assets/logo.png" className="w-24 mt-4" />

                <div className="text-center flex-1 -ml-24">
                  <h2 className="text-6xl font-bold text-blue-800">
                    Bhabin Academy
                  </h2>
                  <p className="font-semibold text-md mt-2">
                    Damak-04, Jhapa, Koshi Province, Nepal
                  </p>
                  <p className="font-semibold text-md">(Estd: 2053 BS)</p>
                </div>

               
              </div>

              {/* Title Row */}
              <div className="flex justify-between items-center mt-10">
                <div className="font-semibold text-lg">
                  S. No.: __________
                </div>

                <div className="bg-red-800 text-white px-8 py-3 rounded-2xl text-3xl font-bold">
                  CHARACTER CERTIFICATE
                </div>

                <div className="w-[130px] h-[150px] border-2 border-black flex items-center justify-center text-sm">
                  Photo
                </div>
              </div>
            </div>

            <div className="text-[18px] leading-relaxed text-justify mt-6">
            </div>
            <div>
              <div className="grid grid-cols-3 text-center font-semibold text-lg">
             
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-blue-700 text-white rounded-lg"
          >
            Print Certificate
          </button>
        </div>

      </div>
    </div>
  );
};

export default BlankCertificateForm;
