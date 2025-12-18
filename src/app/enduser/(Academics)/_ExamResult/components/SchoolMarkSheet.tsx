"use client";
import { X } from "lucide-react";
import { useGenerateMarkSheet } from "../hooks";
import { useGetAllSubjects } from "../../Subject/hooks";
import { useGetStudentById } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { useGetSchoolById } from "@/app/admin/Setup/School/hooks";
import { useRef, useEffect } from "react";

interface Props {
  studentId: string;
  examId: string;
  onClose: () => void;
}

const SchoolMarkSheet: React.FC<Props> = ({ studentId, examId, onClose }) => {
  const { data } = useGenerateMarkSheet(studentId, examId);
  const { data: allSubject } = useGetAllSubjects();
  const { data: StudentData } = useGetStudentById(studentId);

  const storedUser = localStorage.getItem("userDetails");
  let schoolId = "";
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      schoolId = parsedUser.schoolId;
    } catch (error) {
      console.error("Failed to parse user details:", error);
    }
  }

  const { data: SchoolData } = useGetSchoolById(schoolId);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePrint = () => {
    const content = document.getElementById("marksheet")?.outerHTML;
    if (!content) return;

    const printWindow = window.open("", "", "width=900,height=1000");
    printWindow?.document.write(`
  <html>
    <head>
      <title>Marksheet</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @media print {
          @page { size: A4 portrait; margin: 0 !important; }
          body { margin: 0; padding: 0; }
          body * { visibility: hidden; }
          #marksheet, #marksheet * { visibility: visible; }
          #marksheet { position: absolute; top: 0; left: 0; width: 210mm; height: 297mm; padding: 20mm; }
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

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm items-center justify-center p-2 flex flex-col">
      <div
        ref={modalRef}
        className="bg-white w-full sm:w-[90%] max-w-[900px] rounded-md p-4 shadow-xl overflow-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Print Marksheet</h2>{" "}
          <button onClick={onClose} className="text-red-500 text-xl">
            <X />{" "}
          </button>{" "}
        </div>
        <div
          id="marksheet"
          className="bg-white shadow-2xl mx-auto border-2 text-sky-600 p-4 sm:p-6"
          style={{ backgroundRepeat: "no-repeat", backgroundSize: "100% 100%" }}
        >
          <div className="border-4 border-sky-500 p-3 sm:p-5">
            <header className="pb-4 mb-2">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-0">
                <div className="w-28 flex-shrink-0">
                  <div className="w-[120px] h-[130px] border-2 border-black flex items-center justify-center relative overflow-hidden">
                    {StudentData?.studentImg && (
                      <img
                        src={`https://schoolapp.netraverselabs.com/${StudentData.studentImg}`}
                        alt="Student Image"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left sm:ml-4">
                  <h1 className="text-2xl font-bold">{SchoolData?.name}</h1>
                  <p className="text-sm">{SchoolData?.address}</p>
                  <p className="font-semibold mt-2 underline">
                    SECOND TERMINAL EXAMINATION 2082
                  </p>
                  <h2 className="text-xl font-bold mt-1">GRADE SHEET</h2>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 text-sm mb-2 border border-sky-500 p-2 gap-1">
              <p>
                <strong>Name:</strong> {StudentData?.firstName}{" "}
                {StudentData?.lastName}
              </p>
              <p>
                <strong>Section:</strong> A
              </p>
              <p>
                <strong>Class:</strong> {StudentData?.classSectionId || 6}
              </p>
              <p>
                <strong>Roll No:</strong> 2
              </p>
            </div>

            <table className="w-full border text-sm table-auto">
              <thead>
                <tr className="text-center font-semibold">
                  <th className="border border-sky-500 p-1 w-10">S.N</th>
                  <th className="border border-sky-500 p-1">Subjects</th>
                  <th className="border border-sky-500 p-1">Grade</th>
                  <th className="border border-sky-500 p-1">GPA</th>
                  <th className="border border-sky-500 p-1 w-24">
                    Marks Obtained
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.MarksWithGrades?.map((m, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-sky-500 p-1">{index + 1}</td>
                    <td className="border border-sky-500 p-1 text-left px-2">
                      {
                        allSubject?.Items.find((i) => i.Id === m.subjectId)
                          ?.name
                      }
                    </td>
                    <td className="border border-sky-500 p-1">
                      {m.grade || "-"}
                    </td>
                    <td className="border border-sky-500 p-1">
                      {m.GPA || "-"}
                    </td>
                    <td className="border border-sky-500 p-1">
                      {m.marksObtained}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-2 text-sm w-full flex flex-col sm:flex-row border border-sky-500">
              <table className="w-full sm:w-[70%] table-auto">
                <thead>
                  <tr className="text-center font-semibold">
                    <th className="border-b border-r p-1 border-sky-500">
                      GRADE
                    </th>
                    <th className="border-b border-x p-1 border-sky-500">A+</th>
                    <th className="border-b border-x p-1 border-sky-500">A</th>
                    <th className="border-b border-x p-1 border-sky-500">B+</th>
                    <th className="border-b border-x p-1 border-sky-500">B</th>
                    <th className="border-b border-x p-1 border-sky-500">C+</th>
                    <th className="border-b border-x p-1 border-sky-500">C</th>
                    <th className="border-b border-x p-1 border-sky-500">D</th>
                    <th className="border-b border-x p-1 border-sky-500">NG</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    <td className="font-semibold">GRADE POINT</td>
                    <td className="border-t border-x p-1 border-sky-500">
                      4.0
                    </td>
                    <td className="border-t border-x p-1 border-sky-500">
                      3.6
                    </td>
                    <td className="border-t border-x p-1 border-sky-500">
                      3.2
                    </td>
                    <td className="border-t border-x p-1 border-sky-500">
                      2.8
                    </td>
                    <td className="border-t border-x p-1 border-sky-500">
                      2.4
                    </td>
                    <td className="border-t border-x p-1 border-sky-500">
                      2.0
                    </td>
                    <td className="border-t border-x p-1 border-sky-500">
                      1.6
                    </td>
                    <td className="border-t border-x p-1 border-sky-500">-</td>
                  </tr>
                </tbody>
              </table>

              <div className="text-start sm:w-[30%] p-2 text-sky-600 mt-2 sm:mt-0">
                <strong className="border border-sky-500 inline-block px-2">
                  OBT.MARKS
                </strong>
                <div>{data?.totalObtainedMarks}</div>
                <div>
                  <p className="border border-sky-500 inline-block px-2 mr-2">
                    {data?.GPA}
                  </p>
                  {data?.grade}
                </div>
              </div>
            </div>

            <div className="mt-5 text-sm">
              <p>
                <strong>Remarks:</strong> {data?.remarks}
              </p>
              <p>
                <strong>DATE OF ISSUE:</strong>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between mt-20 text-center font-semibold gap-4 sm:gap-0">
              <p>Exam Controller</p>
              <p>Class Teacher</p>
              <p>Principal</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-700 text-white rounded"
          >
            Print Marksheet
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolMarkSheet;
