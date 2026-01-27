"use client";
import React from "react";
import { School, Underline, X } from "lucide-react";
    import { useGetSchoolAwardById } from "../hooks"; 
    import { useGetAllSchool } from "@/app/admin/Setup/School/hooks";
    import { useGetAllStudents } from "@/app/enduser/(StudentManagement)/Student/hooks";


interface Props {
    visible: boolean
  awardId: string;
  onClose: () => void;
}

const SchoolAwardCertificate: React.FC<Props> = ({visible, awardId, onClose }) => {

  const { data: awardData } = useGetSchoolAwardById(awardId);
    const {data:allschool}=useGetAllSchool();
    const{data:allstudent} =useGetAllStudents();
  const handlePrint = () => {
    const content = document.getElementById("awardCertificate")?.outerHTML;
    if (!content) return;

    const printWindow = window.open("", "", "width=900,height=1000");
    printWindow?.document.write(`
      <html>
        <head>
          <title>School Award Certificate</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              @page { size: A4 landscape; margin: 0 !important; }
              body { margin: 0; padding: 0; }
              body * { visibility: hidden; }
              #awardCertificate, #awardCertificate * { visibility: visible; }
              #awardCertificate { position: absolute; top: 0; left: 0; width: 297mm; height: 210mm; padding: 2rem; }
              #printBtn { display: none !important; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
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
  const schoolName = allschool?.Items.find((school) => school.id === awardData?.schoolId)?.name;
  const schoolAddress = allschool?.Items.find((school) => school.id === awardData?.schoolId)?.address;
  const schoolFiscalYear = allschool?.Items.find((school) => school.id === awardData?.schoolId)?.contactNumber;
  const StudentName = allstudent?.Items.find((student) => student.id === awardData?.Id)?.firstName;

  return (
    <div className="fixed inset-0 z-50 ml-12 md:ml-64 sm:ml-16 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-[#FBFBFB] dark:bg-[#27272a] w-full max-w-[100vw] md:max-w-[100vw] lg:max-w-[75vw] xl:max-w-[100vw] h-full rounded-lg overflow-auto md:p-8 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-50">
            Print School Award
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="text-red-400 text-2xl hover:text-red-500"
          >
            <X strokeWidth={3} />
          </button>
        </div>

        <div
          id="awardCertificate"
          className="shadow-xl font-[Times_New_Roman] h-[794px] w-[1123px] mx-auto p-12 px-18 bg-white"
          style={{
            backgroundImage: "url('/assets/border.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
          }}
        >
          {/* Header */}
          <header className="pb-4 mb-2 text-center text-blue-800">
            <h2 className="text-6xl font-bold">{schoolName}</h2>
            <p className="text-md mt-1 font-semibold">{schoolAddress}</p>
            <p className="text-md mt-1 font-semibold">({schoolFiscalYear})</p>
          </header>

          <div className="flex justify-center mb-6">
            <h1 className="bg-red-800 px-6 py-4 text-white text-4xl font-bold rounded-3xl">
              CERTIFICATE OF MERIT
            </h1>
          </div>
          <div className="text-[16px] leading-relaxed text-center mt-6">
  <p className="my-3">
    This is to formally recognize <strong><u>{StudentName}</u></strong>, 
    a diligent student of <strong>{schoolName}</strong>, for outstanding 
    achievement in <strong>{awardData?.awardedBy}</strong>. 
    The award is granted on <strong>{new Date(awardData?.awardedAt || "").toLocaleDateString()}</strong> 
    in appreciation of <strong>{awardData?.awardDescriptions}</strong>.
  </p>

  <p className="my-3">
    This award honors the exemplary dedication, effort, and performance demonstrated 
    by the student, serving as a testament to their commitment to excellence.
  </p>

  <p className="italic mt-3">
    We extend our heartfelt congratulations and best wishes for continued success in all future endeavors.
  </p>
</div>


          <footer className="flex justify-between mt-56 text-center">
            <div className="w-1/3 font-semibold">Principal</div>
            <div className="w-1/3 font-semibold">School Seal</div>
            <div className="w-1/3 font-semibold">Award Committee</div>
          </footer>
        </div>

        <div className="flex justify-end mt-4">
          <button
            id="printBtn"
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

export default SchoolAwardCertificate;
