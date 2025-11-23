"use client";
import { X } from "lucide-react";
import { useGenerateMarkSheet } from "../hooks";
import { useGetAllSubjects } from "../../Subject/hooks";
import { useGetStudentById } from "@/app/enduser/StudentManagement/Student/hooks";
import { useGetSchoolById } from "@/app/admin/Setup/School/hooks";

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
              @page {
                size: A4 portrait;
                margin: 0 !important;
              }

              body {
                margin: 0;
                padding: 0;
              }

              body * {
                visibility: hidden;
              }

              #marksheet, #marksheet * {
                visibility: visible;
              }

              #marksheet {
                position: absolute;
                top: 0;
                left: 0;
                width: 210mm;
                height: 297mm;
                padding: 20mm;
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center ">
      <div className="bg-white w-[90%] max-w-[900px] rounded-md p-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Print Marksheet</h2>
          <button onClick={onClose} className="text-red-500 text-xl">
            <X />
          </button>
        </div>
        <div
          id="marksheet"
          className="bg-white shadow-2xl mx-auto border-3 text-sky-600 "
          style={{
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
          }}
        >
          <div className="border-4 border-sky-500 p-5">
            <header className=" pb-4 mb-2">
              <div className="flex items-start ">
                <div className="w-28 ">
                  <img
                    src={StudentData?.imageUrl}
                    alt="Logo"
                    className="w-full h-auto"
                  />
                </div>

                <div className="flex ml-[-13%] w-full">
                  <div className="w-full">
                    <div className="text-center mb-4">
                      <h1 className="text-2xl font-bold">{SchoolData?.name}</h1>
                      <p>{SchoolData?.address}</p>
                      <p className="font-semibold mt-2 underline">
                        SECOND TERMINAL EXAMINATION 2082
                      </p>
                      <h2 className="text-xl font-bold mt-1">GRADE SHEET</h2>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-2 text-sm mb-2 border border-sky-500 p-2">
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
            <table className="w-full border text-sm">
              <thead>
                <tr className="text-center font-semibold">
                  <th className="border border-sky-500 p-1 w-10">S.N</th>
                  <th className="border border-sky-500 p-1">Subjects</th>
                  <th className="border border-sky-500 p-1 ">Grade</th>
                  <th className="border p-1 border-sky-500 ">GPA</th>
                  <th className="border border-sky-500 p-1 w-24">
                    Marks Obtained
                  </th>
                </tr>
              </thead>

              <tbody>
                {data &&
                  data.MarksWithGrades?.map((m, index: number) => (
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
                      {/* <td className="border p-1">{m.gradePoint || "-"}</td> */}
                      <td className="border border-sky-500 p-1">
                        {m.marksObtained}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {/* Grade Table */}
            <div className="mt-2 text-sm w-full flex border border-sky-500">
              <table className="w-[70%] ">
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
                    <td className=" font-semibold">GRADE POINT</td>
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

              <div className="text-start w-[30%] p-2 text-sky-600">
                <strong className="border border-sky-500  inline-block px-2">
                  {" "}
                  OBT.MARKS
                </strong>
                <div className="">{data?.totalObtainedMarks}</div>

                <div className="">
                  <p className="border  border-sky-500 inline-block px-2 mr-2">
                    {" "}
                    {data?.GPA}
                  </p>
                  {data?.grade}
                </div>
              </div>
            </div>

            {/* GPA, Remarks */}
            <div className="mt-5 text-sm">
              <p>
                <strong>Remarks:</strong> {data?.remarks}
              </p>
              <p>
                <strong>DATE OF ISSUE:</strong>
              </p>
            </div>

            <div className="flex justify-between mt-20 text-center font-semibold">
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
