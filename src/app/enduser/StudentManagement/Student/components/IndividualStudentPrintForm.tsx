"use client";
import React from "react";
import { IStudent } from "../types/IStudents";
import { X } from "lucide-react";
import { useGetAllParents } from "@/app/enduser/ParentManagement/Parent/hooks";
import { useGetAllProvince } from "@/components/common/hooks";

interface Props {
  student: IStudent;
  onClose: () => void;
}

const Certificate: React.FC<Props> = ({ student, onClose }) => {
  const { data: allParents } = useGetAllParents();
  const { data: allProvince } = useGetAllProvince();
  const handlePrint = () => {
    const content = document.getElementById("certificate")?.outerHTML;
    if (!content) return;

    const printWindow = window.open("", "", "width=900,height=1000");
    printWindow?.document.write(`
    <html>
      <head>
        <title>Certificate</title>
        <script src="https://cdn.tailwindcss.com"></script>

        <style>
         @media print {
  @page {
    size: A4 landscape;  /* Force one landscape A4 page */
    margin: 0 !important;
  }

  body {
    margin: 0;
    padding: 0;
  }

  body * {
    visibility: hidden;
  }

  #certificate, #certificate * {
    visibility: visible;
  }
#certificate::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url('./assets/logo.png'); /* your watermark here */
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60%;  /* make it smaller/larger */
  opacity: 0.09;          /* adjust transparency */
  pointer-events: none;
  z-index: 0;
}
  #certificate {
    position: absolute;
    top: 0;
    left: 0;
    width: 297mm;
    height: 210mm;
    overflow: hidden;
  }

  #printBtn, #generateBtn {
    display: none !important;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
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
    <div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center 
             bg-black/40 backdrop-blur-sm ml-12 md:ml-64 sm:ml-16 xs:ml-0"
    >
      <div
        className="bg-[#FBFBFB] dark:bg-[#27272a] 
               w-full max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] xl:max-w-[70vw]
 h-full 
               rounded-lg overflow-auto md:p-8 shadow-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
            Print Certificate
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="text-red-400 text-2xl hover:text-red-500 "
          >
            <X strokeWidth={3} />
          </button>
        </div>
        <div
          id="certificate"
          className="shadow-xl font-[Times_New_Roman] h-[794px] w-[1123px] mx-auto p-12 px-18 bg-white print:w-[794px] print:h-[1123px]"
          style={{
            backgroundImage: "url('/assets/border.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
          }}
        >
          <header className="border-b-4 border-blue-800 pb-4 mb-6">
            <div className="flex items-start gap-2">
              <div className="w-28 mt-6">
                <img
                  src="/assets/logo.png"
                  alt="Logo"
                  className="w-full h-auto"
                />
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-3 text-sm text-blue-900 font-medium">
                  <div className="text-left">
                    <p>TU Regd. No.: 735</p>
                  </div>
                  <div className="text-center">
                    <p>Tribhuvan University</p>
                    <p>ISO 9001:2015 Certified</p>
                  </div>
                  <div className="text-right text-xs text-gray-700">
                    <p>WhatsApp: 98XXXXXXXX</p>
                    <p>email@example.com</p>
                  </div>
                </div>

                <div className="text-center mt-3 text-blue-800">
                  <h2 className="text-3xl font-bold leading-tight">
                    AASTHA COLLEGE OF MANAGEMENT
                  </h2>
                  <p className="text-sm mt-1">
                    Damak-04, Jhapa, Koshi Province, Nepal
                  </p>
                  <p className="text-xs mt-1">
                    ☎ 023-573549, 023-577127 &nbsp;&nbsp; ✉
                    aasthacollege23@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="flex justify-center items-center mb-6 ml-[20%]">
            <h1 className="bg-red-700 w-full md:w-[50%] text-white text-center text-2xl font-bold py-2 rounded-3xl">
              CHARACTER CERTIFICATE
            </h1>
            <div className="w-[120px] h-[150px] border-2 ml-[20%] border-black flex items-center justify-center">
              <img
                src={student.imageUrl}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex gap-8 mb-6 items-start">
            <div className="flex-1 text-[16px] leading-relaxed">
              <p>
                <strong>S. No.:</strong> 1567
              </p>

              <p className="text-justify my-3">
                This is to certify that Ms.{" "}
                <strong>
                  {student.firstName} {student.middleName} {student.lastName}
                </strong>
                , daughter of Mr.{" "}
                <strong>
                  {
                    allParents?.Items.find((i) => i.id === student.parentId)
                      ?.fullName
                  }
                </strong>
                , inhabitant of{" "}
                <strong>
                  {" "}
                  {
                    allProvince?.Items.find((i) => i.Id === student.provinceId)
                      ?.provinceNameInEnglish
                  }
                </strong>{" "}
                Province,
                <strong>{student.districtId}</strong> district,{" "}
                <strong>{"Municipality"}</strong> Rural Municipality, ward no{" "}
                <strong>{student.wardNumber}</strong>, was a bonafide student of
                this college. She passed{" "}
                <strong>{student.classSectionId || "SEE"}</strong> Examinations
                in the year <strong>{`${student.enrollmentDate}`}</strong> and
                secured <strong>{"80"}%</strong> with <strong>{"First"}</strong>{" "}
                division. Her conduct while at college was commendable. As per
                our record, her date of birth is{" "}
                <strong>{`${student.dateOfBirth}`}</strong> B.S. (
                <strong>{`${student.dateOfBirth}`}</strong> A.D.).
              </p>

              <p className="italic mt-3 text-center">
                We extend our best wishes for her future endeavors and success
                in life.
              </p>
            </div>
          </div>

          <footer className="border-t border-gray-400 pt-4">
            <div className="text-sm mb-10">
              <div>
                <strong>Final Symbol No.:</strong> {"982038103"}
              </div>
              <div>
                <strong>Registration No.:</strong> {student.registrationNumber}
              </div>
              <div>
                <strong>Date of Issue:</strong> {"2025/07/11"}
              </div>
            </div>

            <div className="flex justify-between text-center">
              <div className="w-1/3 border-t border-black pt-1 font-semibold">
                Issuing Staff
              </div>
              <div className="w-1/3 border-t border-black pt-1 font-semibold">
                College Seal
              </div>
              <div className="w-1/3 border-t border-black pt-1 font-semibold">
                Campus Chief
              </div>
            </div>
          </footer>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-700 text-white rounded"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
