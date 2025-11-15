"use client";
import React from "react";
import { X } from "lucide-react";
import {
  useGetAllDistrict,
  useGetAllProvince,
} from "@/components/common/hooks";
import { useGenerateCertificateByStudent } from "../hooks";

interface Props {
  studentId: string;
  onClose: () => void;
}

const CollegeCertificate: React.FC<Props> = ({ studentId, onClose }) => {
  const { data: allProvince } = useGetAllProvince();
  const { data: allDistrict } = useGetAllDistrict();
  const { data: certificateData } = useGenerateCertificateByStudent(studentId);
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
    padding-right: 4rem;
    padding-left: 4rem;
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
          <header className=" pb-4 mb-2">
            <div className="flex items-start gap-2">
              <div className="w-28 mt-6">
                <img
                  src="/assets/logo.png"
                  alt="Logo"
                  className="w-full h-auto"
                />
              </div>

              <div className="flex ml-[-12%] w-full ">
                <div className="w-full">
                  <div className="grid grid-cols-3 text-sm  font-medium">
                    <div className="ml-2">
                      <p>TU Regd. No.: 735</p>
                    </div>
                    <div className="text-center">
                      <strong className="text-red-800 text-xl">
                        Tribhuvan University
                      </strong>
                      <p className="text-blue-700 text-2xl">
                        An ISO 9001:2015 Certified
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-700">
                      <p>WhatsApp: 98XXXXXXXX</p>
                      <p>email@example.com</p>
                    </div>
                  </div>

                  <div className="text-center ">
                    <h2 className="text-4xl font-extrabold text-blue-800">
                      AASTHA COLLEGE OF MANAGEMENT
                    </h2>
                    <p className="text-md mt-1 font-semibold">
                      Damak-04, Jhapa, Koshi Province, Nepal
                    </p>
                    <p className="text-md mt-1 font-semibold">
                      (Estd: 2064 BS)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex items-start mb-6 justify-between">
            <p className="mt-[1.7rem] font-semibold">
              <strong>S. No.:</strong> 1567
            </p>
            <h1 className="bg-red-800 px-5 py-4 text-white text-center text-4xl font-bold rounded-3xl">
              CHARACTER CERTIFICATE
            </h1>
            <div className="w-[120px] h-[130px] border-2 mt-[-2.5rem] border-black flex items-center justify-center">
              <img
                src={certificateData?.StudentImage}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex gap-8 mb-6 items-start">
            <div className="flex-1 text-[16px] leading-relaxed">
              <p className="text-justify my-3">
                This is to certify that Ms.{" "}
                <strong>{certificateData?.fullName}</strong>, daughter of Mr.{" "}
                <strong>{certificateData?.parentsName}</strong>, inhabitant of{" "}
                <strong>
                  {
                    allProvince?.Items.find(
                      (i) => i.Id === Number(certificateData?.provinceId)
                    )?.provinceNameInEnglish
                  }
                </strong>{" "}
                Province,
                <strong>
                  {" "}
                  {
                    allDistrict?.Items.find(
                      (i) => i.Id === Number(certificateData?.districtId)
                    )?.districtNameInEnglish
                  }
                </strong>{" "}
                district, <strong>{certificateData?.wardNumber}</strong>, was a
                bonafide student of this college. She passed{" "}
                <strong>{certificateData?.certificateProgram || "SEE"}</strong>{" "}
                Examinations in the year{" "}
                <strong>{`${certificateData?.yearOfCompletion}`}</strong> and
                secured <strong>{certificateData?.percentage}%</strong> with{" "}
                <strong>{certificateData?.division}</strong> division. Her
                conduct while at college was commendable. As per our record, her
                date of birth is{" "}
                <strong>{`${certificateData?.dateOfBirth}`}</strong> B.S. (
                <strong>{`${certificateData?.dateOfBirth}`}</strong> A.D.).
              </p>

              <p className="italic mt-10 text-start">
                We extend our best wishes for her future endeavors and success
                in life.
              </p>
            </div>
          </div>

          <footer className=" ">
            <div className="text-sm mb-20">
              <div>
                <strong>Final Symbol No.:</strong>{" "}
                {certificateData?.symbolNumber}
              </div>
              <div>
                <strong>Registration No.:</strong>{" "}
                {certificateData?.registrationNumber}
              </div>
              <div>
                <strong>Date of Issue:</strong>{" "}
                {`${certificateData?.dateOfIssue}`}
              </div>
            </div>

            <div className="flex justify-between text-center">
              <div className="w-1/3 pt-1 font-semibold">Issuing Staff</div>
              <div className="w-1/3 pt-1 font-semibold">College Seal</div>
              <div className="w-1/3 pt-1 font-semibold">Campus Chief</div>
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

export default CollegeCertificate;
