"use client";
import { School, X } from "lucide-react";
import { useGenerateMarkSheet } from "../hooks";
import { useGetAllSubjects } from "../../Subject/hooks";
import { useGetStudentById } from "@/app/enduser/(StudentManagement)/Student/hooks";
import { useGetSchoolById } from "@/app/admin/Setup/School/hooks";
import { useRef, useEffect } from "react";
import { useGetAllExams } from "../../Exam/hooks";
import { useGetAllClass } from "../../Class/hooks";


interface Props {
  studentId: string;
  examId: string;
  onClose: () => void;
}

const SchoolMarkSheet: React.FC<Props> = ({ studentId, examId, onClose }) => {
  const { data } = useGenerateMarkSheet(studentId, examId);
  const { data: allSubject } = useGetAllSubjects();
  const { data: StudentData } = useGetStudentById(studentId);
  const { data: allExam} = useGetAllExams();
  const {data:allclass} = useGetAllClass();

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
const ExamName = allExam?.Items.find((exam : any) => exam.id === examId)?.name;
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
    <div className="fixed inset-0 z-50 ml-13 md:ml-64 sm:ml-16 xs:ml-0  bg-black/40 backdrop-blur-sm items-center justify-center p-2 flex flex-col">
      <div
        ref={modalRef}
        className="bg-white w-full sm:w-[90%] max-w-[900px] rounded-md p-4 shadow-xl overflow-none"
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
            <header className="pb-4 mb-2 relative">
            <div className="flex items-start justify-center w-full">
          
              {StudentData?.studentImg && (
                <div className="absolute left-0 w-28 h-[130px] border-2 border-black flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://schoolapp.netraverselabs.com/${StudentData.studentImg}`}
                    alt="Student Image"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="text-center">
                <h1 className="text-2xl font-bold">{SchoolData?.name}</h1>
                <p className="text-sm">{SchoolData?.address}</p>
                <p className="font-semibold mt-2 underline">
                  {ExamName}
                </p>
                <h2 className="text-xl font-bold mt-1">GRADE SHEET</h2>
              </div>
            </div>
          </header>




            <div className="grid grid-cols-1 sm:grid-cols-2 text-sm mb-2 border border-sky-500 p-2 gap-1">
              <p className="flex">
                <strong>Name:</strong> {StudentData?.firstName}{" "}
                {StudentData?.lastName}
              </p>
              <p>
                <strong>Section:</strong> {StudentData?.classSectionId}
              </p>
              <p className="flex">
                <strong>Class:</strong>{allclass?.Items.find((c : any) => c.id === StudentData?.classId)?.name}
              </p>
              <p>
                <strong>Roll No:</strong> 
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
                <p className=" inline-block px-2">
                  OBT.MARKS :
                </p>
                <strong>{data?.totalObtainedMarks}</strong>
                <div>
                  <p className=" inline-block px-2">
                  GPA :
                </p>
                  <strong>
                    {data?.GPA}
                  </strong>
                 <strong>({data?.grade})</strong>
                </div>
              </div>
            </div>

            <div className="mt-5 text-sm">
              <p className="flex">
                <strong>Remarks:</strong> {data?.remarks}
              </p>
              <p className="flex">
                <strong>DATE OF ISSUE:</strong>{"date of issue yaha"}
              </p>
              <p className="flex justify-end gap-4">
                <strong>Total Running Days:</strong>
                <strong>Total Absent Days</strong>
                <strong> Total Present Days</strong>

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
